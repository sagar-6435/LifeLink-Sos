# Hospital Recommendation System

## Overview

The Hospital Recommendation System is a critical feature of LifeLink that analyzes emergency situations and patient symptoms to recommend the most appropriate nearby hospitals. It provides intelligent routing based on:

- **Patient Symptoms** - Extracted from emergency descriptions
- **Hospital Specializations** - Matching symptoms to hospital capabilities
- **Distance** - Proximity to patient location
- **Hospital Capacity** - Available beds and ICU capacity
- **Severity Level** - Critical, High, Medium, Low
- **Course of Action** - Step-by-step guidance for the patient

## Architecture

### Components

1. **Hospital Model** (`backend/models/Hospital.js`)
   - Stores hospital data with location, facilities, specializations
   - Tracks available beds, ICU capacity, blood bank inventory
   - Maintains response time metrics and ratings

2. **Hospital Recommendation Service** (`backend/services/HospitalRecommendationService.js`)
   - Core recommendation engine
   - Symptom extraction and analysis
   - Severity determination
   - Hospital scoring algorithm
   - First aid guidance generation

3. **Hospital Routes** (`backend/routes/hospitals.js`)
   - `/api/hospitals/recommend` - Get recommendations
   - `/api/hospitals/nearby` - Get nearby hospitals
   - `/api/hospitals/:id` - Get hospital details
   - Admin endpoints for hospital management

4. **Mobile Component** (`mobile/src/components/HospitalRecommendations.js`)
   - Displays recommendations with visual hierarchy
   - Shows course of action
   - Provides call and directions functionality

## How It Works

### 1. Symptom Extraction

The system analyzes the emergency situation text to identify symptoms:

```javascript
// Example: "I fell down and have severe chest pain"
// Extracted symptoms:
// - "fall" → [Emergency, Orthopedics]
// - "chest pain" → [Cardiology, Emergency]
```

### 2. Severity Determination

Severity is classified based on keywords:

- **CRITICAL**: dying, unconscious, not breathing, severe bleeding, heart attack, stroke
- **HIGH**: severe, urgent, emergency, accident, injury, bleeding, choking
- **MEDIUM**: pain, hurt, injured, fell, help
- **LOW**: general assistance

### 3. Hospital Scoring

Each hospital receives a composite score (0-100) based on:

| Factor | Weight | Calculation |
|--------|--------|-------------|
| Distance | 30 pts | Closer hospitals score higher |
| Specialization Match | 30 pts | % of required specializations available |
| Facilities | 20 pts | Emergency, ICU, bed availability |
| Rating | 10 pts | Hospital rating (0-5 stars) |
| Response Time | 10 pts | Average response time in minutes |

### 4. Course of Action

The system generates prioritized actions:

```
IMMEDIATE: Call 108 (Ambulance)
IMMEDIATE: Notify emergency contacts
NEXT: Head to [Hospital Name]
IMMEDIATE: First Aid - [Specific guidance]
```

## API Endpoints

### Get Hospital Recommendations

**POST** `/api/hospitals/recommend`

Request:
```json
{
  "situation": "I fell down and have severe chest pain",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "limit": 5
}
```

Response:
```json
{
  "success": true,
  "severity": "high",
  "symptoms": ["fall", "chest pain"],
  "recommendations": [
    {
      "id": "hospital_id",
      "name": "City General Hospital",
      "phone": "044-12345678",
      "address": "123 Main Street",
      "distance": "0.4",
      "rating": 4.5,
      "emergency": true,
      "icu": true,
      "availableBeds": 45,
      "availableICUBeds": 8,
      "specializations": ["Cardiology", "Emergency", "Orthopedics"],
      "facilities": ["ICU", "Emergency", "Surgery", "Lab"],
      "averageResponseTime": 8,
      "score": "92.5",
      "reason": "Has ICU for critical care • Specializes in Cardiology, Emergency • Highly rated facility"
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108 (Ambulance) immediately",
      "details": "High-priority emergency. Ambulance should be dispatched."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Chest Pain/Heart Attack",
      "details": "Sit down, loosen tight clothing, chew aspirin if available, stay calm and wait for ambulance."
    },
    {
      "priority": "NEXT",
      "action": "Head to City General Hospital",
      "details": "Distance: 0.4 km. Phone: 044-12345678"
    }
  ]
}
```

### Get Nearby Hospitals

**GET** `/api/hospitals/nearby?latitude=40.7128&longitude=-74.0060&radius=10`

Returns hospitals within specified radius without recommendation logic.

### Get Hospital Details

**GET** `/api/hospitals/:id`

Returns complete hospital information.

## Symptom to Specialization Mapping

The system maps symptoms to required hospital specializations:

### Cardiac
- chest pain → Cardiology, Emergency
- heart attack → Cardiology, Emergency
- palpitations → Cardiology

### Neurological
- stroke → Neurology, Emergency
- seizure → Neurology, Emergency
- unconscious → Neurology, Emergency

### Trauma/Orthopedic
- fracture → Orthopedics, Emergency
- broken bone → Orthopedics, Emergency
- accident → Emergency, Trauma
- bleeding → Emergency, Trauma

### Respiratory
- choking → Emergency, Pulmonology
- drowning → Emergency, Pulmonology
- difficulty breathing → Emergency, Pulmonology

### Gastrointestinal
- severe pain → Emergency, Gastroenterology
- abdominal pain → Gastroenterology, Emergency
- vomiting → Gastroenterology, Emergency

### Toxicology
- poisoning → Emergency, Toxicology
- overdose → Emergency, Toxicology
- snake bite → Emergency, Toxicology

## First Aid Guidance

The system provides context-specific first aid instructions:

### Chest Pain/Heart Attack
- Sit down
- Loosen tight clothing
- Chew aspirin if available
- Stay calm and wait for ambulance

### Stroke
- Note time of symptom onset
- Keep person calm
- Do not give food/water
- Position on side if unconscious

### Choking
- Perform Heimlich maneuver
- Stand behind person
- Place fist above navel
- Thrust upward

### Severe Bleeding
- Apply direct pressure with clean cloth
- Elevate injured area
- Do not remove embedded objects

### Fractures
- Immobilize the injured area
- Apply ice if available
- Elevate if possible
- Avoid movement

### Drowning
- Remove from water
- Clear airway
- Perform CPR if not breathing
- Keep warm

## Integration with Emergency Flow

### 1. Voice Emergency
When user activates voice emergency:
1. Speech is converted to text
2. Situation is extracted
3. Hospital recommendations are fetched
4. Recommendations are displayed to user
5. User can call or get directions to recommended hospital

### 2. Emergency Call Screen
When emergency is triggered:
1. Recommendations are shown alongside emergency contacts
2. User can view course of action
3. Quick call/directions buttons for top hospital
4. Ambulance is called simultaneously

### 3. Fall Detection
When fall is detected:
1. 10-second countdown to cancel
2. If not cancelled, emergency is triggered
3. Hospital recommendations are fetched
4. Ambulance is dispatched to nearest hospital

## Database Seeding

The system includes 5 sample hospitals with realistic data:

1. **City General Hospital** - Full-service with 250 beds, ICU, multiple specializations
2. **St. Mary Medical Center** - 180 beds, Cardiology, Pediatrics focus
3. **Apollo Clinic** - 120 beds, Orthopedics and Neurology focus
4. **Emergency Care Center** - 100 beds, Emergency and Trauma focus
5. **Heart Care Specialty Hospital** - 80 beds, Cardiology specialty

Run seeding:
```bash
cd backend
node seed.js
```

## Configuration

### Environment Variables

No additional environment variables required. Uses existing MongoDB connection.

### Hospital Data Requirements

For optimal recommendations, hospitals should have:
- Accurate location coordinates (longitude, latitude)
- Updated bed availability
- Correct specializations list
- Realistic response time metrics
- Current blood bank inventory

## Performance Considerations

1. **Geospatial Indexing** - Hospital locations use MongoDB 2dsphere index for fast queries
2. **Scoring Algorithm** - O(n) complexity where n = nearby hospitals (typically < 20)
3. **Caching** - Consider caching hospital data for frequently accessed areas
4. **Real-time Updates** - Bed availability should be updated in real-time from hospital systems

## Future Enhancements

1. **Real-time Bed Availability** - Integration with hospital management systems
2. **Traffic-aware Routing** - Consider traffic conditions in distance calculation
3. **Specialist Availability** - Check if required specialists are on duty
4. **Insurance Coverage** - Filter hospitals based on patient's insurance
5. **Patient Preferences** - Remember preferred hospitals
6. **Feedback Loop** - Learn from patient outcomes to improve recommendations
7. **Multi-language Support** - First aid guidance in regional languages
8. **Predictive Analytics** - Predict hospital capacity based on time of day

## Testing

### Test Recommendation Endpoint

```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "I fell down and have severe chest pain",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

### Test Nearby Hospitals

```bash
curl -X GET "http://localhost:3000/api/hospitals/nearby?latitude=40.7128&longitude=-74.0060&radius=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### No Hospitals Found
- Check if hospitals are seeded in database
- Verify location coordinates are correct
- Ensure `acceptingEmergencies` is true

### Incorrect Recommendations
- Verify hospital specializations are set correctly
- Check symptom mapping in `SYMPTOM_SPECIALIZATION_MAP`
- Review scoring algorithm weights

### Performance Issues
- Check MongoDB geospatial index is created
- Monitor query performance with large hospital datasets
- Consider pagination for large result sets

## Security

- Hospital recommendations require authentication
- Admin endpoints require superadmin role
- Location data is encrypted in transit
- Hospital contact information is validated

## Compliance

- HIPAA compliant (no patient data stored with recommendations)
- GDPR compliant (location data handled securely)
- Emergency services integration follows local regulations
