import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import FallDetectionService from '../services/FallDetectionService';
import { useNavigation } from '@react-navigation/native';

const FallDetectionContext = createContext();

export const useFallDetection = () => {
  const context = useContext(FallDetectionContext);
  if (!context) {
    throw new Error('useFallDetection must be used within FallDetectionProvider');
  }
  return context;
};

export const FallDetectionProvider = ({ children }) => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [sensitivity, setSensitivity] = useState('medium');

  useEffect(() => {
    // Load settings and start service if enabled
    const initializeFallDetection = async () => {
      const settings = await FallDetectionService.loadSettings();
      setIsEnabled(settings.enabled);
      setSensitivity(settings.sensitivity);

      if (settings.enabled) {
        FallDetectionService.start();
      }
    };

    initializeFallDetection();

    // Set up fall callback
    FallDetectionService.setFallCallback(() => {
      // Navigate to fall detected screen
      navigation.navigate('FallDetected');
    });

    // Handle app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isEnabled) {
        FallDetectionService.start();
      } else if (nextAppState === 'background') {
        // Keep running in background for fall detection
        // Note: This requires background permissions
      }
    });

    return () => {
      subscription.remove();
      FallDetectionService.stop();
    };
  }, []);

  const updateSettings = async (enabled, newSensitivity) => {
    await FallDetectionService.saveSettings(enabled, newSensitivity);
    setIsEnabled(enabled);
    setSensitivity(newSensitivity);
  };

  return (
    <FallDetectionContext.Provider
      value={{
        isEnabled,
        sensitivity,
        updateSettings,
      }}
    >
      {children}
    </FallDetectionContext.Provider>
  );
};
