import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';

const { height, width } = Dimensions.get('window');

function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8, 
        base64: false,
        exif: false
      });
      setImageUri(photo.uri);
      setCameraActive(false);
    }
  };

  const handleRetakePicture = () => {
    setImageUri(null);
    setCameraActive(true);
  };

  const handleConfirmPicture = () => {
    navigation.navigate('Snapshare', { imageUri: imageUri });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need permission to access your camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.takePicContainer}>
            <TouchableOpacity
              style={styles.takePicButton}
              onPress={handleTakePicture}
            >
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetakePicture}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmPicture}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  takePicContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  takePicButton: {
    padding: height * 0.018,
    borderRadius: 8,
    backgroundColor: '#00e676',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width * 0.9,
    height: width * 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: height * 0.025,
    gap: width * 0.1,
  },
  retakeButton: {
    padding: height * 0.02,
    borderRadius: 8,
    backgroundColor: '#ff1744',
  },
  confirmButton: {
    padding: height * 0.02,
    borderRadius: 8,
    backgroundColor: '#00e676',
  },
});

export default CameraScreen;