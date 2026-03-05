# Emergency Chatbot Intelligent Triage System

## Overview
The emergency chatbot now implements an intelligent severity-based triage system that prevents immediate emergency calls for non-critical situations and instead recommends nearby hospitals based on the user's symptoms and severity level.

## How It Works

### Stage 1: Symptom Collection
- User describes their emergency (e.g., "I have heart pain")
- Chatbot detects symptoms from the message
- If symptoms detected, moves to severity assessment

### Stage 2: Severity Assessment
- Chatbot asks user to rate severity (1-10 scale or mild/moderate/severe)
- System assesses severity based on:
  - Keywords in user response (critical, severe, high, moderate, mild)
  - Numeric ratings (9-10 = high, 5-8 = medium, 1-4 = low)
  - Symptom type (some symptoms are inherently critical)

### Stage 3: Hospital Recommendations
Based on severity level:

#### Low Severity (Mild discomfort)
- Recommends nearby hospitals with appropriate departments
- No emergency contact call
- User can visit hospital at their convenience

#### Medium Severity (Moderate pain/discomfort)
- Recommends nearby hospitals with relevant specializations
- Provides hospital details (distance, rating, specializations)
- No automatic emergency contact call

#### High Severity (Severe symptoms)
- Recommends nearby hospitals with emergency departments
- Asks user: "Would you like me to call your emergency contacts?"
- Only calls if user confirms

#### Critical Severity (Life-threatening)
- Immediately finds nearby hospitals
- Automatically asks to call emergency contacts
- Prepares for emergency call activation

### Stage 4: Emergency Contact Confirmation
For high and critical severity:
- Chatbot asks: "Would you like me to call your emergency contacts?"
- User responds with yes/no
- Only if user confirms → triggers emergency call flow

## Key Features

### 1. Intelligent Symptom Detection
```javascript
// Detects symptoms from natural language
"I have heart pain" → detects "heart pain"
"I fell down" → detects "fall", "injury"
"I can't breathe" → detects "difficulty breathing"
```

### 2. Severity Assessment
```javascript
// Assesses severity from user response
"It's a 9/10" → HIGH severity
"Severe pain" → HIGH severity
"Mild discomfort" → LOW severity
"Moderate pain" → MEDIUM severity
```

### 3. Hospital Recommendations
- Fetches nearby hospitals from backend
- Filters by specialization based on symptoms
- Shows:
  - Hospital name
  - Distance from user
  - Specializations
  - Rating

### 4. Conditional Emergency Calls
- Only calls emergency contacts if:
  - Severity is HIGH or CRITICAL
  - User explicitly confirms
  - Not for LOW or MEDIUM severity

## Conversation Flow Example

### Low Severity Example
```
User: "I have a mild headache"
Bot: "I understand. This appears to be a low-severity situation. 
     Let me find nearby hospitals that can help you.
     
     🏥 NEARBY HOSPITALS:
     1. City Medical Center
        📍 2.5 km away
        🏷️ General Medicine, Neurology
        ⭐ Rating: 4.5/5"
```

### High Severity Example
```
User: "I have severe chest pain"
Bot: "On a scale of 1-10, how severe is your pain?"

User: "9 out of 10"
Bot: "This is a high-severity situation. I'm finding nearby hospitals...
     
     🏥 NEARBY HOSPITALS:
     1. Emergency Care Hospital
        📍 1.2 km away
        🏷️ Cardiology, Emergency Medicine
        ⭐ Rating: 4.8/5
     
     Would you like me to call your emergency contacts?"

User: "Yes, please"
Bot: "Perfect! I'm preparing to call your emergency contacts now."
     [Triggers emergency call flow]
```

## Implementation Details

### Files Modified
1. **mobile/src/services/EmergencyChatbotService.js**
   - Added severity assessment logic
   - Added hospital recommendation fetching
   - Implemented multi-stage conversation flow
   - Added yes/no response parsing

2. **mobile/src/components/EmergencyChatbot.js**
   - Updated to handle new conversation stages
   - Only triggers emergency call on confirmation

3. **mobile/src/screens/EmergencyChatbotScreen.js**
   - Updated to only proceed with emergency call when confirmed

### New Methods in EmergencyChatbotService

```javascript
// Assess severity from user response
assessSeverityFromResponse(response)

// Parse yes/no responses
parseYesNoResponse(response)

// Get user location for hospital recommendations
getUserLocation()

// Generate severity-based response with hospitals
generateSeverityBasedResponse()

// Fetch hospital recommendations from backend
getHospitalRecommendationsText()
```

### Conversation Stages
- `initial` - Collecting symptoms
- `severity_assessment` - Asking about severity
- `hospital_recommended` - Showing hospitals and asking about emergency contacts
- `emergency_contact_confirmed` - User confirmed emergency call
- `completed` - Conversation finished

## Backend Integration

### Hospital Recommendation Endpoint
```
POST /api/hospitals/recommend
Headers: Authorization: Bearer {token}
Body: {
  situation: "chest pain",
  location: { latitude: 28.7041, longitude: 77.1025 },
  severity: "high"
}
```

Returns:
```json
{
  "hospitals": [
    {
      "name": "Hospital Name",
      "distance": 2.5,
      "specializations": ["Cardiology", "Emergency"],
      "rating": 4.5
    }
  ]
}
```

## Benefits

1. **Reduces False Alarms** - Not every symptom requires emergency calls
2. **Faster Hospital Access** - Recommends appropriate hospitals immediately
3. **User Control** - Users decide whether to call emergency contacts
4. **Better Triage** - Severity-based routing ensures appropriate care level
5. **Improved UX** - Conversational flow feels natural and helpful

## Future Enhancements

1. Add first aid guidance for each severity level
2. Integrate with hospital availability/bed status
3. Add follow-up questions based on symptoms
4. Implement symptom history tracking
5. Add medication/allergy considerations
6. Integration with insurance providers
