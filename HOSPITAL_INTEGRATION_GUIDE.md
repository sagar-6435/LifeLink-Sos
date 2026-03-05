# Hospital Recommendation Integration Guide

## Quick Start

### 1. Backend Setup

The hospital recommendation system is already implemented. To start using it:

```bash
cd backend
npm install  # If not already done
node seed.js # Seed sample hospitals
npm start    # Start server
```

### 2. Mobile Integration

The `HospitalRecommendations` component is ready to use. Import it in your emergency screens:

```javascript
import HospitalRecommendations from '../components/HospitalRecommendations';

// In your emergency screen
<HospitalRecommendations 
  situation="I fell down and have severe chest pain"
  location={{ latitude: 40.7128, longitude: -74.0060 }}
  onHospitalSelect={(hospital) => {
    // Handle hospital selection
    console.log('Selected:', hospital.name);
  }}
/>
```

### 3. Integration Points

#### In EmergencyCallScreen

Add hospital recommendations to show alongside emergency contacts:

```javascript
import HospitalRecommendations from '../components/HospitalRecommendations';

export default function EmergencyCallScreen({ navigation, route }) {
  const { situation, location } = route.params;
  
  return (
    <View style={styles.container}>
      {/* Existing emergency call UI */}
      
      {/* Add hospital recommendations */}
      <HospitalRecommendations 
        situation={situation}
        location={location}
        onHospitalSelect={(hospital) => {
          // Navigate to hospital details or call
          Linking.openURL(`tel:${hospital.phone}`);
        }}
      />
    </View>
  );
}
```

#### In VoiceEmergencyScreen

After processing voice input, show recommendations:

```javascript
const processEmergencyAudio = async (audioUri) => {
  // ... existing code ...
  
  const data = await response.json();
  
  // Navigate to emergency screen with situation
  navigation.replace('EmergencyCall', {
    situation: data.situation,
    voiceActivated: true,
    contacts: contacts,
    location: location,
    showHospitalRecommendations: true  // Add this flag
  });
};
```

#### In FallDetectedScreen

When fall is detected and emergency is triggered:

```javascript
const handleEmergency = () => {
  navigation.replace('Emergency', { 
    autoTriggered: true, 
    reason: 'fall_detected',
    showHospitalRecommendations: true
  });
};
```

### 4. API Usage

The recommendation endpoint is available at:

```
POST /api/hospitals/recommend
```

**Required Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "situation": "Emergency description",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "limit": 5
}
```

**Response:**
```json
{
  "success": true,
  "severity": "high",
  "symptoms": ["chest pain", "fall"],
  "recommendations": [
    {
      "id": "hospital_id",
      "name": "Hospital Name",
      "phone": "044-12345678",
      "distance": "0.4",
      "score": "92.5",
      "reason": "Specializes in Cardiology..."
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108",
      "details": "..."
    }
  ]
}
```

## Features

### 1. Intelligent Scoring

Hospitals are scored based on:
- Distance (30%)
- Specialization match (30%)
- Facilities & capacity (20%)
- Rating (10%)
- Response time (10%)

### 2. Course of Action

Provides step-by-step guidance:
- Immediate actions (call ambulance, notify contacts)
- First aid instructions
- Hospital navigation

### 3. Hospital Details

Each recommendation includes:
- Distance from patient
- Available beds and ICU capacity
- Specializations
- Facilities
- Contact information
- Match score and reason

### 4. Quick Actions

- **Call** - Direct phone call to hospital
- **Directions** - Open Google Maps with hospital location

## Customization

### Adjust Scoring Weights

Edit `backend/services/HospitalRecommendationService.js`:

```javascript
function scoreHospital(hospital, symptoms, severity, userLocation) {
  let score = 0;
  
  // Adjust these weights (currently 30, 30, 20, 10, 10)
  const distanceScore = Math.max(0, 30 - (distance * 2));
  const specializationMatch = (matchedSpecs / requiredSpecs.size) * 30;
  // ... etc
}
```

### Add New Symptoms

Edit `SYMPTOM_SPECIALIZATION_MAP`:

```javascript
const SYMPTOM_SPECIALIZATION_MAP = {
  'your_symptom': ['Specialization1', 'Specialization2'],
  // ... existing symptoms
};
```

### Add New Specializations

Update hospital data in seed.js:

```javascript
specializations: ['Cardiology', 'YourNewSpecialization', 'Emergency']
```

## Testing

### 1. Test with Sample Data

The system comes with 5 pre-seeded hospitals. Test with:

```javascript
const testSituation = "I fell down and have severe chest pain";
const testLocation = {
  latitude: 40.7128,
  longitude: -74.0060
};
```

### 2. Test Different Scenarios

```javascript
// Cardiac emergency
"I have severe chest pain and difficulty breathing"

// Trauma
"I was in a car accident and have a broken leg"

// Neurological
"I think I'm having a stroke, my face is drooping"

// General emergency
"I fell down and need help"
```

### 3. Verify Recommendations

Check that:
- Top recommendation has highest score
- Specializations match symptoms
- Distance is calculated correctly
- Course of action is appropriate for severity

## Troubleshooting

### No Recommendations Returned

1. Check if hospitals are seeded:
   ```bash
   cd backend
   node seed.js
   ```

2. Verify location coordinates are valid

3. Check MongoDB connection

### Incorrect Hospital Order

1. Verify hospital specializations are set
2. Check scoring algorithm in HospitalRecommendationService.js
3. Ensure hospital locations are accurate

### API Errors

1. Verify authentication token is valid
2. Check request body format
3. Review server logs for detailed errors

## Performance Tips

1. **Cache Results** - Cache recommendations for 5 minutes
2. **Limit Results** - Use `limit: 3` for faster response
3. **Batch Updates** - Update hospital data during off-peak hours
4. **Monitor Queries** - Track slow queries in MongoDB

## Next Steps

1. **Connect Real Hospital Data** - Replace seed data with actual hospitals
2. **Real-time Updates** - Integrate with hospital management systems
3. **User Feedback** - Collect feedback on recommendations
4. **Analytics** - Track which hospitals are selected
5. **Optimization** - Refine scoring based on outcomes

## Support

For issues or questions:
1. Check HOSPITAL_RECOMMENDATION_SYSTEM.md for detailed documentation
2. Review error logs in backend console
3. Test with sample data first
4. Verify all environment variables are set

## API Reference

### POST /api/hospitals/recommend
Get hospital recommendations based on emergency situation

### GET /api/hospitals/nearby
Get nearby hospitals without recommendations

### GET /api/hospitals/:id
Get detailed hospital information

### POST /api/hospitals (Admin)
Create new hospital

### PUT /api/hospitals/:id (Admin)
Update hospital information
