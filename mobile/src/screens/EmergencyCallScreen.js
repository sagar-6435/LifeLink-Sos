import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export default function EmergencyCallScreen({ navigation }) {
  const [callStatus, setCallStatus] = useState('initiating'); // initiating, recording, completed
  const [timer, setTimer] = useState(0);
  const [emergencyId, setEmergencyId] = useState(null);
  const [emergencyNumbers, setEmergencyNumbers] = useState([]);
  const [callSequence, setCallSequence] = useState([
    { name: 'Emergency Services', status: 'pending', icon: 'phone-alert' },
    { name: 'Emergency Contacts', status: 'pending', icon: 'account-multiple' },
    { name: 'Bot Recording', status: 'active', icon: 'record-circle' }
  ]);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Initialize emergency call
    initiateEmergencyCall();

    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const initiateEmergencyCall = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // Load emergency numbers configured by admin
      const storedNumbers = await AsyncStorage.getItem('emergencyNumbers');
      let numbersToCall = [];
      
      if (storedNumbers) {
        const allNumbers = JSON.parse(storedNumbers);
        // Only use enabled numbers
        numbersToCall = allNumbers.filter(num => num.enabled);
        setEmergencyNumbers(numbersToCall);
        console.log('Loaded emergency numbers:', numbersToCall.length);
      } else {
        // Fallback to default numbers if admin hasn't configured any
        numbersToCall = [
          { name: 'Ambulance', number: '108', icon: 'ambulance' },
          { name: 'Police', number: '100', icon: 'police-badge' }
        ];
        console.log('Using default emergency numbers');
      }

      // Get user location
      const location = { latitude: 0, longitude: 0 }; // TODO: Get actual location

      // Try to create emergency record, but continue even if it fails
      let emergencyIdValue = `emergency_${Date.now()}`;
      try {
        const response = await fetch(`${API_URL}/api/emergency/initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user?._id,
            location,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          emergencyIdValue = data.emergencyId;
        }
      } catch (apiError) {
        console.log('API not available, continuing with local emergency call');
      }

      setEmergencyId(emergencyIdValue);

      // Call emergency services configured by admin
      updateCallSequenceStatus('Emergency Services', 'calling');
      
      // Call each emergency service number with delays
      numbersToCall.forEach((service, index) => {
        setTimeout(() => {
          console.log(`Calling ${service.name}: ${service.number}`);
          Linking.openURL(`tel:${service.number}`).catch(err => {
            console.error(`Failed to call ${service.name}:`, err);
          });
        }, index * 2000); // 2 seconds between each call
      });

      // After all emergency services are called, call emergency contacts
      const totalDelay = numbersToCall.length * 2000 + 2000;
      setTimeout(() => {
        updateCallSequenceStatus('Emergency Services', 'completed');
        updateCallSequenceStatus('Emergency Contacts', 'calling');
        callEmergencyContacts(user);
      }, totalDelay);

      // Start bot recording
      setCallStatus('recording');

      // Try to notify emergency contacts
      try {
        await notifyEmergencyContacts(emergencyIdValue);
      } catch (notifyError) {
        console.log('Could not notify contacts via API');
      }

    } catch (error) {
      console.error('Emergency initiation error:', error);
      // Don't show alert, just continue with local functionality
      setCallStatus('recording');
    }
  };

  const updateCallSequenceStatus = (name, status) => {
    setCallSequence(prev => 
      prev.map(call => 
        call.name === name ? { ...call, status } : call
      )
    );
  };

  const callEmergencyContacts = async (user) => {
    try {
      // Load emergency contacts from local storage first
      let contacts = [];
      const localContacts = await AsyncStorage.getItem('emergencyContacts');
      if (localContacts) {
        contacts = JSON.parse(localContacts);
        console.log('Loaded emergency contacts from local storage:', contacts.length);
      }

      // Try to fetch from API as backup
      if (contacts.length === 0) {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/users/emergency-contacts`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            contacts = data.emergencyContacts || [];
          }
        } catch (apiError) {
          console.log('Could not fetch contacts from API');
        }
      }

      if (contacts.length === 0) {
        updateCallSequenceStatus('Emergency Contacts', 'completed');
        return;
      }

      // Call each emergency contact with a delay between calls
      contacts.forEach((contact, index) => {
        setTimeout(() => {
          console.log(`Calling emergency contact: ${contact.name} - ${contact.phone}`);
          Linking.openURL(`tel:${contact.phone}`).catch(err => {
            console.error(`Failed to call ${contact.name}:`, err);
          });
        }, index * 2000); // 2 seconds between each call
      });

      // Mark as completed after all calls initiated
      setTimeout(() => {
        updateCallSequenceStatus('Emergency Contacts', 'completed');
      }, contacts.length * 2000);

    } catch (error) {
      console.error('Failed to call emergency contacts:', error);
      updateCallSequenceStatus('Emergency Contacts', 'completed');
    }
  };

  const notifyEmergencyContacts = async (emergencyId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/emergency/notify-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emergencyId })
      });
      
      if (!response.ok) {
        throw new Error('API not available');
      }
    } catch (error) {
      console.log('Could not notify contacts via API, continuing locally');
    }
  };

  const endCall = async () => {
    Alert.alert(
      'End Emergency Call?',
      'Are you sure you want to end the emergency call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              
              // Try to end call via API
              try {
                await fetch(`${API_URL}/api/emergency/end`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    emergencyId,
                    duration: timer
                  })
                });
              } catch (apiError) {
                console.log('Could not end call via API');
              }

              setCallStatus('completed');
              setTimeout(() => {
                navigation.goBack();
              }, 2000);
            } catch (error) {
              console.log('Error ending call:', error);
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>EMERGENCY CALL</Text>
          <View style={styles.recordingBadge}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>RECORDING</Text>
          </View>
        </View>

        <Animated.View style={[styles.emergencyIcon, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons name="phone-alert" size={80} color="#0f172a" />
        </Animated.View>

        <Text style={styles.statusText}>
          {callStatus === 'initiating' && 'Initiating emergency calls...'}
          {callStatus === 'recording' && 'Emergency calls in progress'}
          {callStatus === 'completed' && 'Emergency session ended'}
        </Text>

        <Text style={styles.timer}>{formatTime(timer)}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Emergency Call Sequence</Text>
          
          {/* Show emergency service numbers being called */}
          {emergencyNumbers.length > 0 && (
            <View style={styles.emergencyNumbersSection}>
              <Text style={styles.sectionLabel}>Emergency Services:</Text>
              {emergencyNumbers.map((service, index) => (
                <View key={index} style={styles.serviceRow}>
                  <MaterialCommunityIcons name={service.icon} size={16} color={service.color} />
                  <Text style={styles.serviceText}>{service.name} - {service.number}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Call sequence status */}
          {callSequence.map((call, index) => (
            <View key={index} style={styles.infoRow}>
              <MaterialCommunityIcons 
                name={
                  call.status === 'pending' ? 'clock-outline' :
                  call.status === 'calling' ? 'phone-in-talk' :
                  call.status === 'active' ? 'record-circle' :
                  call.status === 'completed' ? 'check-circle' :
                  'alert-circle'
                }
                size={20} 
                color={
                  call.status === 'pending' ? '#64748b' :
                  call.status === 'calling' ? '#fbbf24' :
                  call.status === 'active' ? '#ef4444' :
                  call.status === 'completed' ? '#10b981' :
                  '#ef4444'
                }
              />
              <Text style={[
                styles.infoText,
                call.status === 'calling' && styles.infoTextActive,
                call.status === 'completed' && styles.infoTextCompleted
              ]}>
                {call.name}
                {call.status === 'calling' && ' - Calling...'}
                {call.status === 'active' && ' - Active'}
                {call.status === 'completed' && ' - Connected'}
                {call.status === 'failed' && ' - Failed'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="microphone-off" size={28} color="#0f172a" />
            <Text style={styles.actionText}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="volume-high" size={28} color="#0f172a" />
            <Text style={styles.actionText}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="map-marker" size={28} color="#0f172a" />
            <Text style={styles.actionText}>Location</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <MaterialCommunityIcons name="phone-hangup" size={32} color="#0f172a" />
          <Text style={styles.endCallText}>End Call</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Call recording will be sent to your emergency contacts
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 2,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  emergencyIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0f172a',
    fontVariant: ['tabular-nums'],
  },
  infoCard: {
    width: '100%',
    backgroundcolor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoTextActive: {
    color: '#fbbf24',
    fontWeight: '600',
  },
  infoTextCompleted: {
    color: '#10b981',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  endCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
    width: '100%',
  },
  endCallText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyNumbersSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  serviceText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
});
