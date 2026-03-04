import { DeviceMotion } from 'expo-sensors';
import { Vibration, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FallDetectionService {
  constructor() {
    this.subscription = null;
    this.isEnabled = false;
    this.sensitivity = 'medium';
    this.fallCallback = null;
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
    this.fallThresholds = {
      low: 2.5,
      medium: 2.0,
      high: 1.5,
    };
  }

  async loadSettings() {
    try {
      const enabled = await AsyncStorage.getItem('fallDetectionEnabled');
      const sensitivity = await AsyncStorage.getItem('fallDetectionSensitivity');
      
      this.isEnabled = enabled === 'true';
      this.sensitivity = sensitivity || 'medium';
      
      return { enabled: this.isEnabled, sensitivity: this.sensitivity };
    } catch (error) {
      console.error('Error loading fall detection settings:', error);
      return { enabled: false, sensitivity: 'medium' };
    }
  }

  async saveSettings(enabled, sensitivity) {
    try {
      await AsyncStorage.setItem('fallDetectionEnabled', enabled.toString());
      await AsyncStorage.setItem('fallDetectionSensitivity', sensitivity);
      
      this.isEnabled = enabled;
      this.sensitivity = sensitivity;
      
      if (enabled) {
        this.start();
      } else {
        this.stop();
      }
    } catch (error) {
      console.error('Error saving fall detection settings:', error);
    }
  }

  setFallCallback(callback) {
    this.fallCallback = callback;
  }

  calculateMagnitude(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  detectFall(acceleration) {
    const { x, y, z } = acceleration;
    const magnitude = this.calculateMagnitude(x, y, z);
    const threshold = this.fallThresholds[this.sensitivity];
    
    // Detect sudden acceleration change (fall)
    const deltaX = Math.abs(x - this.lastAcceleration.x);
    const deltaY = Math.abs(y - this.lastAcceleration.y);
    const deltaZ = Math.abs(z - this.lastAcceleration.z);
    const totalDelta = this.calculateMagnitude(deltaX, deltaY, deltaZ);
    
    this.lastAcceleration = { x, y, z };
    
    // Fall detected if sudden change exceeds threshold
    if (totalDelta > threshold) {
      return true;
    }
    
    return false;
  }

  async start() {
    if (this.subscription) {
      return;
    }

    try {
      const available = await DeviceMotion.isAvailableAsync();
      if (!available) {
        console.warn('Device motion not available');
        return;
      }

      DeviceMotion.setUpdateInterval(100); // Update every 100ms

      this.subscription = DeviceMotion.addListener((data) => {
        if (!this.isEnabled) return;

        const { acceleration } = data;
        if (acceleration) {
          const fallDetected = this.detectFall(acceleration);
          
          if (fallDetected && this.fallCallback) {
            // Vibrate to alert user
            Vibration.vibrate([0, 500, 200, 500]);
            this.fallCallback();
          }
        }
      });
    } catch (error) {
      console.error('Error starting fall detection:', error);
    }
  }

  stop() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async getEmergencyContacts() {
    try {
      const contacts = await AsyncStorage.getItem('emergencyContacts');
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
      return [];
    }
  }

  async saveEmergencyContacts(contacts) {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  }
}

export default new FallDetectionService();
