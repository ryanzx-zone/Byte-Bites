import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Vibration,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';
import LinearGradient from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Timerscreen = () => {
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [reminderType, setReminderType] = useState(null);
  const [reminderInterval, setReminderInterval] = useState(null);

  const intervalRef = useRef(null);
  const reminderRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      clearInterval(reminderRef.current);
      setIsRunning(false);
      Vibration.vibrate(2000);
      Alert.alert("Time's up!", "Your timer has finished.", [{ text: 'OK' }]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (reminderRef.current) {
      clearInterval(reminderRef.current);
    }

    if (isRunning && reminderType && reminderInterval) {
      reminderRef.current = setInterval(() => {
        Vibration.vibrate(500);
        Alert.alert('Reminder', `Time to ${reminderType}!`);
      }, reminderInterval * 1000);
    }

    return () => {
      if (reminderRef.current) {
        clearInterval(reminderRef.current);
      }
    };
  }, [isRunning, reminderType, reminderInterval]);

  const handleStart = () => {
    if (duration > 0 && !isRunning) {
      setTimeLeft(duration);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (reminderRef.current) {
      clearInterval(reminderRef.current);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    handleStop();
    setTimeLeft(duration);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleReminderSelect = (type, interval) => {
    if (reminderType === type && reminderInterval === interval) {
      setReminderType(null);
      setReminderInterval(null);
    } else {
      setReminderType(type);
      setReminderInterval(interval);
    }
  };

  const isReminderActive = (type, interval) => {
    return reminderType === type && reminderInterval === interval;
  };

  const handleTimerChange = (value) => {
    const totalSeconds = (value.minutes || 0) * 60 + (value.seconds || 0);
    setDuration(totalSeconds);
    if (!isRunning) {
      setTimeLeft(totalSeconds);
    }
  };

  const renderReminderButton = (type, interval, label) => (
    <TouchableOpacity
      onPress={() => handleReminderSelect(type, interval)}
      style={[
        styles.reminderButton,
        isReminderActive(type, interval) && styles.activeReminderButton
      ]}
    >
      <Text style={[
        styles.reminderButtonText,
        isReminderActive(type, interval) && styles.activeReminderButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Timer</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Reminders Section */}
          <View style={styles.remindersContainer}>
            <Text style={styles.sectionTitle}>Reminders</Text>

            <View style={styles.reminderTypeContainer}>
              <Text style={styles.reminderTypeLabel}>Stir:</Text>
              <View style={styles.reminderButtonsRow}>
                {renderReminderButton('stir', 15, '15s')}
                {renderReminderButton('stir', 30, '30s')}
                {renderReminderButton('stir', 60, '60s')}
              </View>
            </View>

            <View style={styles.reminderTypeContainer}>
              <Text style={styles.reminderTypeLabel}>Flip:</Text>
              <View style={styles.reminderButtonsRow}>
                {renderReminderButton('flip', 15, '15s')}
                {renderReminderButton('flip', 30, '30s')}
                {renderReminderButton('flip', 60, '60s')}
              </View>
            </View>
          </View>

          {/* Timer Picker */}
          <View style={styles.timerPickerContainer}>
            <TimerPicker
              padWithNItems={3}
              hideHours
              minuteLabel="min"
              secondLabel="sec"
              onDurationChange={handleTimerChange}
              LinearGradient={LinearGradient}
              styles={{
                theme: 'light',
                pickerItem: { fontSize: 34 },
                pickerLabel: { fontSize: 30, right: -20 },
                pickerLabelContainer: { width: 60 },
                pickerItemContainer: { width: 150 },
              }}
            />
          </View>
        </View>

        {/* Timer Display */}
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton, (isRunning || duration === 0) && styles.disabledButton]}
            onPress={handleStart}
            disabled={isRunning || duration === 0}
          >
            <Text style={[styles.controlButtonText, (isRunning || duration === 0) && styles.disabledButtonText]}>
              Start
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton, !isRunning && styles.disabledButton]}
            onPress={handleStop}
            disabled={!isRunning}
          >
            <Text style={[styles.controlButtonText, !isRunning && styles.disabledButtonText]}>
              Stop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#eb11ee',
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
  },
  remindersContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reminderTypeContainer: {
    marginBottom: 15,
  },
  reminderTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  reminderButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  reminderButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  activeReminderButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#45A049',
  },
  reminderButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeReminderButtonText: {
    color: '#FFFFFF',
  },
  timerPickerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    lineHeight: 70,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 20,
  },
  controlButton: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 70,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 30,
  },
  stopButton: {
    backgroundColor: '#F44336',
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#999999',
  },
});

export default Timerscreen;