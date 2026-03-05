# Emergency Chatbot Integration Examples

## Quick Integration

### 1. Add Chatbot Button to Home Screen

**File**: `mobile/src/screens/HomeScreen.js`

```javascript
// Add this import at the top
import { MaterialCommunityIcons } from '@expo/vector-icons';

// In your render/return, add this button
<TouchableOpacity
  style={styles.chatbotButton}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <View style={styles.chatbotButtonContent}>
    <MaterialCommunityIcons name="robot" size={24} color="#fff" />
    <Text style={styles.chatbotButtonText}>Emergency Assistant</Text>
  </View>
</TouchableOpacity>

// Add these styles
const styles = StyleSheet.create({
  chatbotButton: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatbotButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatbotButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
```

### 2. Add Chatbot to Emergency Screen

**File**: `mobile/src/screens/EmergencyCallScreen.js`

```javascript
// Add button in the UI
<TouchableOpacity
  style={styles.guidanceButton}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <MaterialCommunityIcons name="robot" size={20} color="#fff" />
  <Text style={styles.guidanceButtonText}>Get Guidance</Text>
</TouchableOpacity>

// Add styles
const styles = StyleSheet.create({
  guidanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginVertical: 8,
  },
  guidanceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
```

### 3. Add Chatbot to Settings Screen

**File**: `mobile/src/screens/SettingsScreen.js`

```javascript
// Add this section in your settings
<TouchableOpacity
  style={styles.settingItem}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <View style={styles.settingIcon}>
    <MaterialCommunityIcons name="robot" size={24} color="#3b82f6" />
  </View>
  <View style={styles.settingContent}>
    <Text style={styles.settingTitle}>Emergency Assistant</Text>
    <Text style={styles.settingDescription}>
      Get guidance for emergency situations
    </Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
</TouchableOpacity>
```

### 4. Add Chatbot to Navigation Menu

**File**: `mobile/src/components/NavigationMenu.js` (or similar)

```javascript
<TouchableOpacity
  style={styles.menuItem}
  onPress={() => {
    navigation.navigate('EmergencyChatbot');
    closeMenu();
  }}
>
  <MaterialCommunityIcons name="robot" size={24} color="#3b82f6" />
  <Text style={styles.menuItemText}>Emergency Assistant</Text>
</TouchableOpacity>
```

## Advanced Integration

### 1. Conditional Chatbot Access

```javascript
// Only show if emergency contacts are set
const [hasEmergencyContacts, setHasEmergencyContacts] = useState(false);

useEffect(() => {
  checkEmergencyContacts();
}, []);

const checkEmergencyContacts = async () => {
  const contactsStr = await AsyncStorage.getItem('emergencyContacts');
  const contacts = contactsStr ? JSON.parse(contactsStr) : [];
  setHasEmergencyContacts(contacts.length > 0);
};

// In render
{hasEmergencyContacts && (
  <TouchableOpacity
    onPress={() => navigation.navigate('EmergencyChatbot')}
  >
    <Text>Emergency Assistant</Text>
  </TouchableOpacity>
)}
```

### 2. Chatbot with Pre-filled Symptoms

```javascript
// Pass initial symptoms to chatbot
<TouchableOpacity
  onPress={() => navigation.navigate('EmergencyChatbot', {
    initialSymptom: 'chest pain'
  })}
>
  <Text>Report Chest Pain</Text>
</TouchableOpacity>

// In EmergencyChatbotScreen
const { initialSymptom } = route.params || {};

useEffect(() => {
  if (initialSymptom) {
    // Auto-send initial symptom
    handleSendMessage(initialSymptom);
  }
}, [initialSymptom]);
```

### 3. Chatbot with Emergency Context

```javascript
// Pass emergency context
<TouchableOpacity
  onPress={() => navigation.navigate('EmergencyChatbot', {
    context: 'fall_detected',
    severity: 'high'
  })}
>
  <Text>Get Help</Text>
</TouchableOpacity>

// In EmergencyChatbotScreen
const { context, severity } = route.params || {};

useEffect(() => {
  if (context === 'fall_detected') {
    // Show fall-specific guidance
    const message = EmergencyChatbotService.initializeConversation();
    // Add context-specific message
  }
}, [context]);
```

### 4. Chatbot with Callback

```javascript
// Use chatbot and get result
const handleOpenChatbot = () => {
  navigation.navigate('EmergencyChatbot', {
    onAssessment: (assessment) => {
      // Handle assessment result
      console.log('Assessment:', assessment);
      // Update parent screen
    }
  });
};
```

## UI Variations

### Floating Action Button

```javascript
<TouchableOpacity
  style={styles.fab}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <MaterialCommunityIcons name="robot" size={28} color="#fff" />
</TouchableOpacity>

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
```

### Card Button

```javascript
<TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <View style={styles.cardIcon}>
    <MaterialCommunityIcons name="robot" size={32} color="#3b82f6" />
  </View>
  <Text style={styles.cardTitle}>Emergency Assistant</Text>
  <Text style={styles.cardDescription}>
    Get guidance for emergency situations
  </Text>
  <MaterialCommunityIcons name="arrow-right" size={20} color="#3b82f6" />
</TouchableOpacity>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748b',
  },
});
```

### List Item

```javascript
<TouchableOpacity
  style={styles.listItem}
  onPress={() => navigation.navigate('EmergencyChatbot')}
>
  <MaterialCommunityIcons name="robot" size={24} color="#3b82f6" />
  <View style={styles.listItemContent}>
    <Text style={styles.listItemTitle}>Emergency Assistant</Text>
    <Text style={styles.listItemSubtitle}>
      Get guidance for emergency situations
    </Text>
  </View>
  <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
</TouchableOpacity>

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
```

## Complete Example

### Full Home Screen Integration

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Existing content */}
      
      {/* Emergency Assistant Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Support</Text>
        
        <TouchableOpacity
          style={styles.assistantCard}
          onPress={() => navigation.navigate('EmergencyChatbot')}
        >
          <View style={styles.assistantIcon}>
            <MaterialCommunityIcons name="robot" size={32} color="#3b82f6" />
          </View>
          
          <View style={styles.assistantContent}>
            <Text style={styles.assistantTitle}>Emergency Assistant</Text>
            <Text style={styles.assistantDescription}>
              Get guidance for emergency situations
            </Text>
          </View>
          
          <MaterialCommunityIcons name="arrow-right" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  assistantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assistantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantContent: {
    flex: 1,
  },
  assistantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  assistantDescription: {
    fontSize: 12,
    color: '#64748b',
  },
});
```

## Testing Integration

### Test Checklist

- ✅ Button appears on screen
- ✅ Button is clickable
- ✅ Navigation works
- ✅ Chatbot opens correctly
- ✅ Chatbot closes properly
- ✅ Emergency activation works
- ✅ UI is responsive
- ✅ No console errors

## Best Practices

1. **Always check for emergency contacts** before allowing chatbot access
2. **Provide clear visual feedback** when button is pressed
3. **Use consistent styling** with your app theme
4. **Add helpful descriptions** so users know what the chatbot does
5. **Test on different devices** for responsive design
6. **Handle navigation errors** gracefully
7. **Provide alternative access** if chatbot is unavailable
8. **Log usage** for analytics and improvement

## Troubleshooting

### Button Not Appearing
- Check if component is in render
- Verify styles are correct
- Check navigation setup

### Navigation Not Working
- Verify screen name matches
- Check navigation stack
- Review error logs

### Chatbot Not Opening
- Check EmergencyChatbotScreen is registered
- Verify navigation parameters
- Review console errors

## Summary

The Emergency Chatbot can be easily integrated into any screen using:

```javascript
<TouchableOpacity onPress={() => navigation.navigate('EmergencyChatbot')}>
  <Text>Emergency Assistant</Text>
</TouchableOpacity>
```

Choose the UI style that best fits your app design and user experience goals.
