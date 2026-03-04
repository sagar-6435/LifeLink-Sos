import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [powerButtonTrigger, setPowerButtonTrigger] = useState(true);
  const [shakeDetection, setShakeDetection] = useState(false);
  const [alertSound, setAlertSound] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [testMode, setTestMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your SOS preferences</Text>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Trigger Options Section */}
        <Text style={styles.sectionTitle}>TRIGGER OPTIONS</Text>
        
        <View style={styles.settingCard}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialCommunityIcons name="cellphone" size={24} color="#ef4444" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Power Button Trigger</Text>
            <Text style={styles.settingDescription}>Press power button 5 times to trigger SOS</Text>
          </View>
          <Switch
            value={powerButtonTrigger}
            onValueChange={setPowerButtonTrigger}
            trackColor={{ false: '#e2e8f0', true: '#fca5a5' }}
            thumbColor={powerButtonTrigger ? '#ef4444' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingCard}>
          <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
            <MaterialCommunityIcons name="cellphone-wireless" size={24} color="#64748b" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Shake Detection</Text>
            <Text style={styles.settingDescription}>Shake phone vigorously to trigger SOS</Text>
          </View>
          <Switch
            value={shakeDetection}
            onValueChange={setShakeDetection}
            trackColor={{ false: '#e2e8f0', true: '#fca5a5' }}
            thumbColor={shakeDetection ? '#ef4444' : '#f1f5f9'}
          />
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        
        <View style={styles.settingCard}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialCommunityIcons name="volume-high" size={24} color="#ef4444" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Alert Sound</Text>
            <Text style={styles.settingDescription}>Play loud siren when SOS is activated</Text>
          </View>
          <Switch
            value={alertSound}
            onValueChange={setAlertSound}
            trackColor={{ false: '#e2e8f0', true: '#fca5a5' }}
            thumbColor={alertSound ? '#ef4444' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingCard}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialCommunityIcons name="bell" size={24} color="#ef4444" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Get notified about contact acknowledgements</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#e2e8f0', true: '#fca5a5' }}
            thumbColor={pushNotifications ? '#ef4444' : '#f1f5f9'}
          />
        </View>

        {/* Testing Section */}
        <Text style={styles.sectionTitle}>TESTING</Text>
        
        <View style={styles.settingCard}>
          <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
            <MaterialCommunityIcons name="test-tube" size={24} color="#64748b" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Test SOS Mode</Text>
            <Text style={styles.settingDescription}>SOS triggers won't send real alerts</Text>
          </View>
          <Switch
            value={testMode}
            onValueChange={setTestMode}
            trackColor={{ false: '#e2e8f0', true: '#fca5a5' }}
            thumbColor={testMode ? '#ef4444' : '#f1f5f9'}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>LifeLink v1.0.1</Text>
          <Text style={styles.appDescription}>Emergency SOS Application</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <MaterialCommunityIcons name="home-outline" size={24} color="#94a3b8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('EmergencyContactsSetup')}
        >
          <MaterialCommunityIcons name="account-group-outline" size={24} color="#94a3b8" />
          <Text style={styles.navText}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('TrackScreen')}
        >
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#94a3b8" />
          <Text style={styles.navText}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialCommunityIcons name="account-outline" size={24} color="#94a3b8" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="cog" size={24} color="#ef4444" />
          <Text style={styles.navTextActive}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: '600',
  },
});
