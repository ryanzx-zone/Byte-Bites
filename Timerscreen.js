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

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    clearInterval(reminderRef.current);

    if (isRunning && reminderType && reminderInterval) {
      reminderRef.current = setInterval(() => {
        Vibration.vibrate(500);
        Alert.alert('Reminder', `Time to ${reminderType}!`);
      }, reminderInterval * 1000);
    }

    return () => clearInterval(reminderRef.current);
  }, [isRunning, reminderType, reminderInterval]);

  const handleStart = () => {
    if (duration > 0 && !isRunning) {
      setTimeLeft(duration);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    clearInterval(reminderRef.current);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ⬇️ Toggle logic
  const handleReminderSelect = (type, interval) => {
    if (reminderType === type && reminderInterval === interval) {
      setReminderType(null);
      setReminderInterval(null);
    } else {
      setReminderType(type);
      setReminderInterval(interval);
    }
  };

  const isActive = (type, interval) => {
    return reminderType === type && reminderInterval === interval;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Timer</Text>
      </View>

      <View style={styles.timecontainer}>
        {/* Reminders */}
        <View style={styles.reminderWrapper}>
          <View style={styles.reminderLabelContainer}>
            <Text style={styles.label}>Reminders:</Text>
          </View>
          <View style={styles.reminderOptionsContainer}>
            {/* Stir Options */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                onPress={() => handleReminderSelect('stir', 15)}
                style={[styles.optionBtn, isActive('stir', 15) && styles.activeBtn]}
              >
                <Text>Stir (15s)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReminderSelect('stir', 30)}
                style={[styles.optionBtn, isActive('stir', 30) && styles.activeBtn]}
              >
                <Text>Stir (30s)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReminderSelect('stir', 60)}
                style={[styles.optionBtn, isActive('stir', 60) && styles.activeBtn]}
              >
                <Text>Stir (60s)</Text>
              </TouchableOpacity>
            </View>

            {/* Flip Options */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                onPress={() => handleReminderSelect('flip', 15)}
                style={[styles.optionBtn, isActive('flip', 15) && styles.activeBtn]}
              >
                <Text>Flip (15s)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReminderSelect('flip', 30)}
                style={[styles.optionBtn, isActive('flip', 30) && styles.activeBtn]}
              >
                <Text>Flip (30s)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReminderSelect('flip', 60)}
                style={[styles.optionBtn, isActive('flip', 60) && styles.activeBtn]}
              >
                <Text>Flip (60s)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Timer Picker */}
        <TimerPicker
          padWithNItems={3}
          hideHours
          minuteLabel="min"
          secondLabel="sec"
          onDurationChange={(value) => {
            const totalSeconds = (value.minutes || 0) * 60 + (value.seconds || 0);
            setDuration(totalSeconds);
            if (!isRunning) setTimeLeft(totalSeconds);
          }}
          LinearGradient={LinearGradient}
          styles={{
            theme: 'light',
            pickerItem: { fontSize: 34 },
            pickerLabel: { fontSize: 30, right: -20 },
            pickerLabelContainer: { width: 60 },
            pickerItemContainer: { width: 150 },
          }}
        />

        {/* Timer Display */}
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={handleStart} disabled={isRunning || duration === 0} />
          <Button title="Stop" onPress={handleStop} disabled={!isRunning} />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  topContainer: {
    width: '100%',
    paddingHorizontal: width * 0.04,
    height: height * 0.1,
    justifyContent: 'flex-end',
    backgroundColor: '#eb11ee',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  timecontainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.02,
  },
  reminderWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
    width: '100%',
  },
  reminderLabelContainer: {
    width: width * 0.25,
    justifyContent: 'flex-start',
  },
  reminderOptionsContainer: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.025,
    marginBottom: height * 0.01,
  },
  optionBtn: {
    backgroundColor: '#ccc',
    paddingVertical: height * 0.0075,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
  },
  activeBtn: {
    backgroundColor: '#91e091',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerBox: {
    marginVertical: height * 0.03,
    padding: height * 0.015,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 110,
    marginVertical: height * 0.05,
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 40 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: width * 0.08,
  },
});

export default Timerscreen;
