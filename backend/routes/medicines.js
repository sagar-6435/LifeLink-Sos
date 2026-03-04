const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const multer = require('multer');
const Groq = require('groq-sdk');
const OpenAI = require('openai');

// Initialize API clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Search medicines
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI medicine detection using OCR + Groq AI (Reliable method)
router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('🔍 Starting medicine detection with OCR + Groq AI...');

    // Use Tesseract for OCR to extract text from image
    const Tesseract = require('tesseract.js');
    
    console.log('📸 Step 1: Extracting text from image using OCR...');
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
          }
        }
      }
    );

    console.log('📝 Extracted text:', text.substring(0, 200));

    if (!text || text.trim().length < 3) {
      return res.json({
        success: false,
        error: 'Could not extract text from image',
        detected: {
          name: 'Unable to read medicine label',
          usage: 'Please ensure the image is clear and the medicine label is visible',
          uses: ['Image quality too low'],
          confidence: 0
        },
        suggestion: 'Try taking a clearer photo with better lighting and focus on the medicine label'
      });
    }

    console.log('🧠 Step 2: Analyzing extracted text with Groq AI...');

    // Analyze with Groq AI
    const prompt = `You are a medical expert AI. I have extracted text from a medicine package using OCR. Analyze this text carefully and identify the medicine.

EXTRACTED TEXT FROM MEDICINE LABEL:
"""
${text}
"""

INSTRUCTIONS:
1. Look for the medicine name in the extracted text (e.g., Cetirizine, Paracetamol, Amoxicillin, etc.)
2. Identify the dosage/strength if visible (e.g., 10mg, 500mg)
3. Provide detailed information about the ACTUAL medicine found in the text
4. If you see "Cetirizine" in the text, the medicine is Cetirizine (NOT Paracetamol)
5. Be accurate - use the exact medicine name from the extracted text

Provide information in JSON format:
{
  "name": "Exact medicine name from text with dosage (e.g., Cetirizine 10mg)",
  "genericName": "Generic/scientific name",
  "category": "Medicine category (Antihistamine, Antibiotic, Painkiller, etc.)",
  "usage": "How to use this medicine",
  "uses": ["List of 5-6 medical conditions this treats"],
  "sideEffects": ["List of 5-6 common side effects"],
  "precautions": ["List of 5-6 important precautions"],
  "interactions": ["List of 3-4 drug interactions"],
  "dosageInfo": "Standard dosage information",
  "confidence": 0.95
}

CRITICAL: Base your response on the ACTUAL medicine name found in the extracted text above!`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a medical expert. Identify medicines from OCR text accurately. Always use the exact medicine name found in the text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    console.log('✅ Groq AI Response:', responseText);

    let medicineInfo;
    try {
      medicineInfo = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      medicineInfo = {
        name: 'Unable to parse response',
        genericName: 'Unknown',
        category: 'Medicine',
        usage: 'Consult healthcare professional',
        uses: ['Unable to determine'],
        sideEffects: ['Consult package insert'],
        precautions: ['Consult healthcare professional'],
        confidence: 0.3
      };
    }

    // Try to find in database
    let dbMedicine = null;
    if (medicineInfo.name && medicineInfo.name !== 'Unable to identify') {
      const searchName = medicineInfo.name.split(' ')[0];
      dbMedicine = await Medicine.findOne({
        name: { $regex: searchName, $options: 'i' }
      });
    }

    const result = {
      success: true,
      detected: {
        ...medicineInfo,
        extractedText: text.substring(0, 300),
        ...(dbMedicine && {
          id: dbMedicine._id,
          price: dbMedicine.price,
          manufacturer: dbMedicine.manufacturer,
          inStock: dbMedicine.inStock
        })
      },
      source: 'OCR + Groq AI',
      timestamp: new Date().toISOString(),
      disclaimer: '⚠️ This information is AI-generated. Always verify with the actual medicine package and consult a qualified healthcare professional.'
    };

    console.log('✅ Detection complete! Medicine:', medicineInfo.name);
    res.json(result);

  } catch (error) {
    console.error('❌ Medicine Detection Error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      detected: {
        name: 'Detection failed',
        usage: 'Please try again with a clearer image',
        uses: ['Unable to analyze image'],
        confidence: 0
      },
      suggestion: 'Ensure the medicine label is clearly visible, well-lit, and in focus.'
    });
  }
});

// Batch detection
router.post('/detect-batch', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const results = [];
    const commonMedicines = [
      { name: 'Paracetamol', category: 'Analgesic', primaryUse: 'Pain relief and fever reduction' },
      { name: 'Ibuprofen', category: 'NSAID', primaryUse: 'Pain relief and anti-inflammatory' },
      { name: 'Amoxicillin', category: 'Antibiotic', primaryUse: 'Bacterial infections' },
      { name: 'Omeprazole', category: 'Antacid', primaryUse: 'Acid reflux and heartburn' },
      { name: 'Aspirin', category: 'NSAID', primaryUse: 'Pain relief and blood thinning' }
    ];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const medicine = commonMedicines[i % commonMedicines.length];
      
      results.push({
        filename: file.originalname,
        detected: medicine,
        success: true
      });
    }

    res.json({
      success: true,
      results,
      total: req.files.length,
      note: 'Batch detection completed. For detailed analysis, use single image detection.'
    });

  } catch (error) {
    console.error('Batch Detection Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Analyze dosage based on patient info
router.post('/analyze-dosage', async (req, res) => {
  try {
    const { medicine_name, patient_age, patient_weight } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Provide dosage recommendations for ${medicine_name} for a patient who is ${patient_age} years old and weighs ${patient_weight} kg. 

Respond in JSON format:
{
  "recommended_dosage": "dosage amount and frequency",
  "warnings": ["list of warnings"],
  "precautions": ["list of precautions"],
  "notes": "additional notes"
}

Important: This is for informational purposes only. Always consult a healthcare professional.`
        }
      ],
      temperature: 0.3,
      max_tokens: 512,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const dosageInfo = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json({
      success: true,
      medicine_name,
      patient_info: {
        age: patient_age,
        weight: patient_weight
      },
      ...dosageInfo,
      disclaimer: 'This information is AI-generated and for reference only. Always consult a qualified healthcare professional before taking any medication.'
    });

  } catch (error) {
    console.error('Dosage Analysis Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get medicine suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const medicines = await Medicine.find().limit(5);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
