import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';
import LinearGradient from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Timerscreen = () => {
  const [duration, setDuration] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null); 

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1); 
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (duration > 0 && !isRunning) {
      setTimeLeft(duration);
      setIsRunning(true); 
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false); 
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60); 
    const sec = seconds % 60; 
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Timer</Text>
      </View>

      <View style={styles.timecontainer}>
        <TimerPicker
          padWithNItems={3}
          hideHours
          minuteLabel="min"
          secondLabel="sec"
          onDurationChange={(value) => {
            const totalSeconds = (value.minutes || 0) * 60 + (value.seconds || 0);
            setDuration(totalSeconds); 
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

        <View style={styles.timerBox}>
        <Text style={styles.timerText}>
          {formatTime(timeLeft || duration)} 
        </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={handleStart} disabled={isRunning || duration === 0} />
          <Button title="Stop" onPress={handleStop} disabled={!isRunning} />
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  timecontainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.02,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerBox: {
    marginVertical: height * 0.04,
    padding: height * 0.015,
    borderWidth: 3,
    borderColor: '#000', 
    borderRadius: 30, 
    backgroundColor: '#fff', 
  },
  timerText: {
    fontSize: 110,
    marginVertical: height * 0.05,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: width * 0.08,
  },
});

export default Timerscreen;
