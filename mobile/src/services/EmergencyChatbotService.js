/**
 * Emergency Chatbot Service
 * Provides intelligent course of action based on patient symptoms via chat
 */

import { getCourseOfAction, getEmergencyNumbers, requiresImmediateHospitalization } from './CourseOfActionService';

// Symptom keywords for detection
const SYMPTOM_KEYWORDS = {
  cardiac: ['chest pain', 'heart attack', 'palpitations', 'irregular heartbeat', 'shortness of breath', 'difficulty breathing'],
  neurological: ['stroke', 'seizure', 'unconscious', 'dizziness', 'headache', 'confusion', 'loss of consciousness'],
  trauma: ['fracture', 'broken bone', 'accident', 'fall', 'injury', 'bleeding', 'wound', 'sprain', 'dislocation'],
  respiratory: ['choking', 'drowning', 'can\'t breathe', 'asthma', 'wheezing', 'coughing'],
  gastrointestinal: ['severe pain', 'abdominal pain', 'vomiting', 'poisoning', 'overdose'],
  general: ['help', 'emergency', 'urgent', 'severe', 'critical']
};

// Chatbot responses
const CHATBOT_RESPONSES = {
  greeting: [
    "Hello! I'm the LifeLink Emergency Assistant. I'm here to help you during this emergency. Can you describe what's happening?",
    "Welcome to LifeLink Emergency Support. Please tell me about your current situation and symptoms.",
    "Hi there! I'm ready to help. What emergency are you experiencing right now?"
  ],
  
  clarification: [
    "Can you tell me more about your symptoms?",
    "I want to make sure I understand correctly. Are you experiencing any other symptoms?",
    "Could you describe the severity of your pain or discomfort?",
    "How long have you been experiencing these symptoms?"
  ],
  
  critical: [
    "This sounds like a critical emergency. I'm immediately alerting emergency services.",
    "Your symptoms indicate a life-threatening situation. Emergency services are being contacted now.",
    "This requires immediate medical attention. Calling 108 (Ambulance) now."
  ],
  
  urgent: [
    "This is an urgent situation. You need immediate medical attention.",
    "Your symptoms require urgent care. I'm preparing to contact emergency services.",
    "This needs urgent medical evaluation. Let me help you get to a hospital."
  ],
  
  confirmation: [
    "I've understood your situation. Here's what we need to do:",
    "Based on your symptoms, here's the recommended course of action:",
    "I've assessed your condition. Here's what I recommend:"
  ]
};

class EmergencyChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.detectedSymptoms = [];
    this.severity = null;
    this.courseOfAction = null;
  }

  /**
   * Initialize chatbot conversation
   */
  initializeConversation() {
    this.conversationHistory = [];
    this.detectedSymptoms = [];
    this.severity = null;
    this.courseOfAction = null;
    
    const greeting = this.getRandomResponse(CHATBOT_RESPONSES.greeting);
    this.conversationHistory.push({
      role: 'assistant',
      message: greeting,
      timestamp: new Date()
    });
    
    return greeting;
  }

  /**
   * Process user message and provide response
   */
  async processUserMessage(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        message: userMessage,
        timestamp: new Date()
      });

      // Extract symptoms from message
      const newSymptoms = this.extractSymptoms(userMessage);
      this.detectedSymptoms = [...new Set([...this.detectedSymptoms, ...newSymptoms])];

      // Generate response
      let response = '';

      if (this.detectedSymptoms.length === 0) {
        // No symptoms detected yet
        response = this.getRandomResponse(CHATBOT_RESPONSES.clarification);
      } else {
        // Symptoms detected - provide course of action
        response = await this.generateCourseOfActionResponse();
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        message: response,
        timestamp: new Date()
      });

      return {
        message: response,
        symptoms: this.detectedSymptoms,
        severity: this.severity,
        courseOfAction: this.courseOfAction,
        requiresEmergency: this.severity === 'critical' || this.severity === 'high'
      };
    } catch (error) {
      console.error('Error processing user message:', error);
      return {
        message: 'I encountered an error processing your message. Please try again or call 108 immediately.',
        error: error.message
      };
    }
  }

  /**
   * Extract symptoms from user message
   */
  extractSymptoms(message) {
    const lowerMessage = message.toLowerCase();
    const symptoms = [];

    for (const [category, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          symptoms.push(keyword);
        }
      }
    }

    return symptoms;
  }

  /**
   * Generate course of action response
   */
  async generateCourseOfActionResponse() {
    try {
      // Get course of action
      this.courseOfAction = getCourseOfAction(
        this.detectedSymptoms.join(', '),
        this.detectedSymptoms
      );

      this.severity = this.courseOfAction.severity;

      // Build response message
      let response = '';

      // Add severity indicator
      if (this.severity === 'critical') {
        response += this.getRandomResponse(CHATBOT_RESPONSES.critical) + '\n\n';
      } else if (this.severity === 'high') {
        response += this.getRandomResponse(CHATBOT_RESPONSES.urgent) + '\n\n';
      }

      // Add confirmation
      response += this.getRandomResponse(CHATBOT_RESPONSES.confirmation) + '\n\n';

      // Add course of action
      response += this.formatCourseOfAction(this.courseOfAction);

      // Add emergency numbers if critical
      if (this.severity === 'critical' || this.severity === 'high') {
        response += '\n\n' + this.formatEmergencyNumbers();
      }

      return response;
    } catch (error) {
      console.error('Error generating course of action:', error);
      return 'Based on your symptoms, please call 108 (Ambulance) immediately for emergency assistance.';
    }
  }

  /**
   * Format course of action for display
   */
  formatCourseOfAction(courseOfAction) {
    let formatted = '';

    // Add summary
    formatted += `📋 Summary: ${courseOfAction.summary}\n\n`;

    // Add immediate actions
    formatted += '🚨 IMMEDIATE ACTIONS:\n';
    const immediateActions = courseOfAction.courseOfAction.filter(a => a.priority === 'IMMEDIATE');
    immediateActions.forEach((action, index) => {
      formatted += `${index + 1}. ${action.action}\n`;
      formatted += `   ${action.details}\n\n`;
    });

    // Add urgent actions
    if (courseOfAction.courseOfAction.some(a => a.priority === 'URGENT')) {
      formatted += '\n⚠️ URGENT ACTIONS:\n';
      const urgentActions = courseOfAction.courseOfAction.filter(a => a.priority === 'URGENT');
      urgentActions.forEach((action, index) => {
        formatted += `${index + 1}. ${action.action}\n`;
        formatted += `   ${action.details}\n\n`;
      });
    }

    // Add next steps
    if (courseOfAction.courseOfAction.some(a => a.priority === 'NEXT')) {
      formatted += '\n➡️ NEXT STEPS:\n';
      const nextActions = courseOfAction.courseOfAction.filter(a => a.priority === 'NEXT');
      nextActions.forEach((action, index) => {
        formatted += `${index + 1}. ${action.action}\n`;
        formatted += `   ${action.details}\n\n`;
      });
    }

    // Add hospital specializations
    if (courseOfAction.specializations.length > 0) {
      formatted += `\n🏥 Required Hospital Specializations:\n`;
      formatted += courseOfAction.specializations.join(', ') + '\n';
    }

    return formatted;
  }

  /**
   * Format emergency numbers
   */
  formatEmergencyNumbers() {
    const numbers = getEmergencyNumbers();
    let formatted = '📞 EMERGENCY NUMBERS:\n';
    formatted += `🚑 Ambulance: ${numbers.ambulance}\n`;
    formatted += `🚔 Police: ${numbers.police}\n`;
    formatted += `🔥 Fire: ${numbers.fire}\n`;
    formatted += `👩 Women Helpline: ${numbers.womenHelpline}\n`;
    formatted += `☠️ Poison Control: ${numbers.poisonControl}\n`;
    return formatted;
  }

  /**
   * Get random response from array
   */
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Get current assessment
   */
  getCurrentAssessment() {
    return {
      symptoms: this.detectedSymptoms,
      severity: this.severity,
      courseOfAction: this.courseOfAction,
      requiresEmergency: requiresImmediateHospitalization(this.severity)
    };
  }

  /**
   * Reset conversation
   */
  resetConversation() {
    this.conversationHistory = [];
    this.detectedSymptoms = [];
    this.severity = null;
    this.courseOfAction = null;
  }

  /**
   * Get follow-up question based on symptoms
   */
  getFollowUpQuestion() {
    if (this.detectedSymptoms.length === 0) {
      return "Can you describe what's happening right now?";
    }

    const questions = [
      "How long have you been experiencing these symptoms?",
      "Is the pain getting worse or staying the same?",
      "Are you having any difficulty breathing?",
      "Have you lost consciousness at any point?",
      "Are you experiencing any bleeding?",
      "Do you have any allergies we should know about?",
      "Are you taking any medications?",
      "Have you experienced this before?",
      "Is anyone with you right now?",
      "Can you move all your limbs?"
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * Provide first aid guidance for specific symptom
   */
  getFirstAidGuidance(symptom) {
    const guidance = {
      'chest pain': [
        '1. Sit or lie down in a comfortable position',
        '2. Loosen any tight clothing',
        '3. Chew aspirin if available and not allergic',
        '4. Stay calm and breathe slowly',
        '5. Do not exert yourself',
        '6. Call 108 immediately'
      ],
      'choking': [
        '1. Encourage coughing if able',
        '2. Perform Heimlich maneuver:',
        '   - Stand behind the person',
        '   - Place fist above navel',
        '   - Thrust upward quickly',
        '3. Repeat if necessary',
        '4. Call 108 if unsuccessful'
      ],
      'severe bleeding': [
        '1. Apply direct pressure with clean cloth',
        '2. Do not remove embedded objects',
        '3. Elevate injured area above heart',
        '4. Apply pressure to artery if needed',
        '5. Use tourniquet if necessary',
        '6. Call 108 immediately'
      ],
      'unconscious': [
        '1. Check responsiveness',
        '2. Call 108 immediately',
        '3. Check airway and breathing',
        '4. If not breathing, start CPR',
        '5. Place in recovery position if breathing',
        '6. Keep warm and monitor'
      ],
      'fracture': [
        '1. Immobilize the injured area',
        '2. Apply ice if available',
        '3. Elevate if possible',
        '4. Do not move the injured area',
        '5. Remove jewelry and tight clothing',
        '6. Call 108'
      ]
    };

    const lowerSymptom = symptom.toLowerCase();
    for (const [key, steps] of Object.entries(guidance)) {
      if (lowerSymptom.includes(key)) {
        return steps.join('\n');
      }
    }

    return 'Please call 108 for emergency assistance.';
  }

  /**
   * Check if emergency services should be called
   */
  shouldCallEmergency() {
    return this.severity === 'critical' || this.severity === 'high';
  }

  /**
   * Get hospital recommendation summary
   */
  getHospitalRecommendationSummary() {
    if (!this.courseOfAction) {
      return null;
    }

    return {
      specializations: this.courseOfAction.specializations,
      severity: this.severity,
      urgency: this.severity === 'critical' ? 'IMMEDIATE' : this.severity === 'high' ? 'URGENT' : 'SOON'
    };
  }
}

// Export singleton instance
export default new EmergencyChatbotService();
