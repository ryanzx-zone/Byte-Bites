import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Alert, Dimensions, } from 'react-native';
import { auth } from '../config/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function PLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      navigation.navigate('Hello', {
        userName: user.email,
        uid: user.uid,
      });
    } catch (error) {
      Alert.alert('Sign in failed', error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      navigation.navigate('Hello', {
        userName: user.email,
        uid: user.uid,
      });
    } catch (error) {
      Alert.alert('Sign up failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Login to KitchenGPT</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Login →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  heading: {
    fontSize: 24,
    marginBottom: height * 0.025,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: width * 0.025,
    width: '100%',
    marginBottom: height * 0.02,
    borderRadius: 5,
    color: '#000',
  },
  button: {
    padding: height * 0.015,
    borderRadius: 5,
    marginTop: height * 0.01,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});
