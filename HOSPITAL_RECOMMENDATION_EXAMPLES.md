# Hospital Recommendation System - Usage Examples

## API Examples

### Example 1: Cardiac Emergency

**Request:**
```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "I have severe chest pain and difficulty breathing. I think I am having a heart attack.",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "severity": "critical",
  "symptoms": ["chest pain", "difficulty breathing", "heart attack"],
  "recommendations": [
    {
      "id": "hospital_1",
      "name": "Heart Care Specialty Hospital",
      "phone": "044-22222222",
      "address": "654 Maple Drive, Westside",
      "distance": "0.8",
      "rating": 4.9,
      "emergency": true,
      "icu": true,
      "availableBeds": 15,
      "availableICUBeds": 6,
      "specializations": ["Cardiology", "Emergency", "Pulmonology"],
      "facilities": ["Emergency", "Cardiology", "ICU", "Cath Lab", "Surgery"],
      "averageResponseTime": 9,
      "score": "95.2",
      "reason": "Has ICU for critical care • Specializes in Cardiology, Emergency • Highly rated facility"
    },
    {
      "id": "hospital_2",
      "name": "City General Hospital",
      "phone": "044-12345678",
      "address": "123 Main Street, Downtown",
      "distance": "0.4",
      "rating": 4.5,
      "emergency": true,
      "icu": true,
      "availableBeds": 45,
      "availableICUBeds": 8,
      "specializations": ["Cardiology", "Neurology", "Orthopedics", "Emergency", "Trauma"],
      "facilities": ["ICU", "Emergency", "Surgery", "Lab", "Trauma Center", "Imaging"],
      "averageResponseTime": 8,
      "score": "94.8",
      "reason": "Closest hospital • Has ICU for critical care • Specializes in Cardiology"
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108 (Ambulance) immediately",
      "details": "Critical condition detected. Ambulance dispatch is urgent."
    },
    {
      "priority": "IMMEDIATE",
      "action": "Notify emergency contacts",
      "details": "Alert all emergency contacts about the critical situation."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Chest Pain/Heart Attack",
      "details": "Sit down, loosen tight clothing, chew aspirin if available, stay calm and wait for ambulance."
    },
    {
      "priority": "NEXT",
      "action": "Head to Heart Care Specialty Hospital",
      "details": "Distance: 0.8 km. Phone: 044-22222222"
    }
  ]
}
```

### Example 2: Trauma/Accident

**Request:**
```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "I was in a car accident. I have a broken leg and severe bleeding.",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "severity": "high",
  "symptoms": ["accident", "broken bone", "bleeding"],
  "recommendations": [
    {
      "id": "hospital_3",
      "name": "Emergency Care Center",
      "phone": "044-11111111",
      "address": "321 Elm Street, Eastside",
      "distance": "0.3",
      "rating": 4.3,
      "emergency": true,
      "icu": false,
      "availableBeds": 22,
      "availableICUBeds": 0,
      "specializations": ["Emergency", "Trauma", "Toxicology"],
      "facilities": ["Emergency", "Lab", "X-Ray", "Trauma"],
      "averageResponseTime": 5,
      "score": "88.5",
      "reason": "Closest hospital • Fast response time • Specializes in Trauma"
    },
    {
      "id": "hospital_4",
      "name": "Apollo Clinic",
      "phone": "044-55555555",
      "address": "789 Pine Road, Uptown",
      "distance": "0.6",
      "rating": 4.8,
      "emergency": true,
      "icu": true,
      "availableBeds": 28,
      "availableICUBeds": 4,
      "specializations": ["Orthopedics", "Neurology", "Emergency", "Trauma"],
      "facilities": ["Emergency", "Surgery", "Lab", "ICU", "Orthopedics"],
      "averageResponseTime": 7,
      "score": "87.2",
      "reason": "Specializes in Orthopedics, Emergency • Highly rated facility"
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108 (Ambulance)",
      "details": "High-priority emergency. Ambulance should be dispatched."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Severe Bleeding",
      "details": "Apply direct pressure with clean cloth, elevate injured area, do not remove embedded objects."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Fracture",
      "details": "Immobilize the injured area, apply ice if available, elevate if possible, avoid movement."
    },
    {
      "priority": "NEXT",
      "action": "Head to Emergency Care Center",
      "details": "Distance: 0.3 km. Phone: 044-11111111"
    }
  ]
}
```

### Example 3: Stroke

**Request:**
```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "My face is drooping on one side and I cannot move my arm. I think I am having a stroke.",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "severity": "critical",
  "symptoms": ["stroke"],
  "recommendations": [
    {
      "id": "hospital_1",
      "name": "City General Hospital",
      "phone": "044-12345678",
      "address": "123 Main Street, Downtown",
      "distance": "0.4",
      "rating": 4.5,
      "emergency": true,
      "icu": true,
      "availableBeds": 45,
      "availableICUBeds": 8,
      "specializations": ["Cardiology", "Neurology", "Orthopedics", "Emergency", "Trauma"],
      "facilities": ["ICU", "Emergency", "Surgery", "Lab", "Trauma Center", "Imaging"],
      "averageResponseTime": 8,
      "score": "93.5",
      "reason": "Has ICU for critical care • Specializes in Neurology, Emergency • Highly rated facility"
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108 (Ambulance) immediately",
      "details": "Critical condition detected. Ambulance dispatch is urgent."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Stroke",
      "details": "Note time of symptom onset, keep person calm, do not give food/water, position on side if unconscious."
    },
    {
      "priority": "NEXT",
      "action": "Head to City General Hospital",
      "details": "Distance: 0.4 km. Phone: 044-12345678"
    }
  ]
}
```

### Example 4: Fall with Injuries

**Request:**
```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "I fell down the stairs and have severe pain in my leg. I cannot stand up.",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "severity": "high",
  "symptoms": ["fall", "severe pain"],
  "recommendations": [
    {
      "id": "hospital_4",
      "name": "Apollo Clinic",
      "phone": "044-55555555",
      "address": "789 Pine Road, Uptown",
      "distance": "0.6",
      "rating": 4.8,
      "emergency": true,
      "icu": true,
      "availableBeds": 28,
      "availableICUBeds": 4,
      "specializations": ["Orthopedics", "Neurology", "Emergency", "Trauma"],
      "facilities": ["Emergency", "Surgery", "Lab", "ICU", "Orthopedics"],
      "averageResponseTime": 7,
      "score": "89.3",
      "reason": "Specializes in Orthopedics, Emergency • Highly rated facility"
    }
  ],
  "courseOfAction": [
    {
      "priority": "URGENT",
      "action": "Call 108 (Ambulance)",
      "details": "High-priority emergency. Ambulance should be dispatched."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Fracture",
      "details": "Immobilize the injured area, apply ice if available, elevate if possible, avoid movement."
    },
    {
      "priority": "NEXT",
      "action": "Head to Apollo Clinic",
      "details": "Distance: 0.6 km. Phone: 044-55555555"
    }
  ]
}
```

### Example 5: Choking

**Request:**
```bash
curl -X POST http://localhost:3000/api/hospitals/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "situation": "Someone is choking and cannot breathe. They are turning blue.",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "severity": "critical",
  "symptoms": ["choking"],
  "recommendations": [
    {
      "id": "hospital_3",
      "name": "Emergency Care Center",
      "phone": "044-11111111",
      "address": "321 Elm Street, Eastside",
      "distance": "0.3",
      "rating": 4.3,
      "emergency": true,
      "icu": false,
      "availableBeds": 22,
      "availableICUBeds": 0,
      "specializations": ["Emergency", "Trauma", "Toxicology"],
      "facilities": ["Emergency", "Lab", "X-Ray", "Trauma"],
      "averageResponseTime": 5,
      "score": "91.2",
      "reason": "Closest hospital • Fast response time • Specializes in Emergency"
    }
  ],
  "courseOfAction": [
    {
      "priority": "IMMEDIATE",
      "action": "Call 108 (Ambulance) immediately",
      "details": "Critical condition detected. Ambulance dispatch is urgent."
    },
    {
      "priority": "IMMEDIATE",
      "action": "First Aid: Choking",
      "details": "Perform Heimlich maneuver: Stand behind person, place fist above navel, thrust upward."
    },
    {
      "priority": "NEXT",
      "action": "Head to Emergency Care Center",
      "details": "Distance: 0.3 km. Phone: 044-11111111"
    }
  ]
}
```

## Mobile Integration Examples

### Example 1: Using in Emergency Call Screen

```javascript
import HospitalRecommendations from '../components/HospitalRecommendations';

export default function EmergencyCallScreen({ navigation, route }) {
  const { situation, location } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      {/* Emergency call UI */}
      <View style={styles.emergencyHeader}>
        <Text style={styles.title}>Emergency Response Active</Text>
      </View>
      
      {/* Hospital Recommendations */}
      <View style={styles.recommendationsSection}>
        <HospitalRecommendations 
          situation={situation}
          location={location}
          onHospitalSelect={(hospital) => {
            // Handle hospital selection
            Alert.alert(
              'Hospital Selected',
              `${hospital.name}\n${hospital.phone}`,
              [
                { text: 'Call', onPress: () => Linking.openURL(`tel:${hospital.phone}`) },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        />
      </View>
    </ScrollView>
  );
}
```

### Example 2: Using in Voice Emergency Screen

```javascript
const processEmergencyAudio = async (audioUri) => {
  try {
    // ... existing code to process audio ...
    
    const data = await response.json();
    
    // Navigate with hospital recommendations
    navigation.replace('EmergencyCall', {
      situation: data.situation,
      voiceActivated: true,
      contacts: contacts,
      location: location,
      showHospitalRecommendations: true
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Example 3: Conditional Display Based on Severity

```javascript
import HospitalRecommendations from '../components/HospitalRecommendations';

export default function EmergencyScreen({ navigation, route }) {
  const { situation, location } = route.params;
  const [severity, setSeverity] = useState(null);
  
  useEffect(() => {
    // Fetch recommendations to get severity
    fetchRecommendations();
  }, []);
  
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hospitals/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ situation, location })
      });
      
      const data = await response.json();
      setSeverity(data.severity);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {severity === 'critical' && (
        <View style={styles.criticalAlert}>
          <Text style={styles.criticalText}>CRITICAL - Ambulance Dispatched</Text>
        </View>
      )}
      
      <HospitalRecommendations 
        situation={situation}
        location={location}
      />
    </View>
  );
}
```

## Testing Scenarios

### Scenario 1: Test Cardiac Emergency
1. Trigger emergency with text: "I have severe chest pain"
2. Verify Heart Care Specialty Hospital is recommended
3. Check that Cardiology specialization is highlighted
4. Verify course of action includes first aid for chest pain

### Scenario 2: Test Trauma
1. Trigger emergency with text: "I was in a car accident"
2. Verify Emergency Care Center or Apollo Clinic is recommended
3. Check that Trauma specialization is highlighted
4. Verify first aid includes fracture and bleeding guidance

### Scenario 3: Test Stroke
1. Trigger emergency with text: "I think I'm having a stroke"
2. Verify City General Hospital is recommended
3. Check that Neurology specialization is highlighted
4. Verify course of action includes stroke first aid

### Scenario 4: Test Distance Calculation
1. Use different coordinates
2. Verify hospitals are sorted by distance
3. Check that closest hospital is recommended first

### Scenario 5: Test Capacity Consideration
1. Manually update hospital bed availability
2. Trigger emergency
3. Verify hospitals with available beds are prioritized

## Debugging Tips

### Check Recommendation Scoring
```javascript
// Add logging to HospitalRecommendationService.js
console.log('Hospital:', hospital.name);
console.log('Distance Score:', distanceScore);
console.log('Specialization Score:', specializationMatch);
console.log('Total Score:', score);
```

### Verify Symptom Extraction
```javascript
// Check extracted symptoms
const symptoms = extractSymptoms(situation);
console.log('Extracted symptoms:', symptoms);
```

### Monitor API Response
```javascript
// In mobile component
const response = await fetch(`${API_URL}/api/hospitals/recommend`, ...);
const data = await response.json();
console.log('API Response:', data);
console.log('Recommendations:', data.recommendations);
console.log('Course of Action:', data.courseOfAction);
```

## Performance Testing

### Test with Multiple Hospitals
```bash
# Add more hospitals to database
# Then test recommendation response time
time curl -X POST http://localhost:3000/api/hospitals/recommend ...
```

### Test with Different Locations
```bash
# Test with various coordinates
# Verify geospatial queries are efficient
```

### Load Testing
```bash
# Use Apache Bench or similar tool
ab -n 100 -c 10 -p data.json http://localhost:3000/api/hospitals/recommend
```

## Success Criteria

✅ Recommendations are returned within 500ms
✅ Top recommendation has highest score
✅ Specializations match symptoms
✅ Distance is calculated correctly
✅ Course of action is appropriate
✅ First aid guidance is relevant
✅ Mobile component displays correctly
✅ Call and directions buttons work
✅ Error handling is graceful
✅ Authentication is enforced
