import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Dimensions, StatusBar } from "react-native";
import { auth, db } from "../config/FirebaseConfig";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const { width, height } = Dimensions.get("window");

function Snapsharescreen({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [privacy, setPrivacy] = useState("private");

  useEffect(() => {
    if (route.params?.imageUri) {
      setImageUri(route.params.imageUri);
    }
  }, [route.params?.imageUri]);

  const handleSnapPicture = () => navigation.navigate("CameraScreen");

  const convertImageToBase64 = async (uri) => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(`Image size after compression: ${base64.length} bytes`);

      if (base64.length > 800000) {
        const superCompressed = await ImageManipulator.manipulateAsync(
          compressedImage.uri,
          [{ resize: { width: 600 } }],
          { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
        );
        const finalBase64 = await FileSystem.readAsStringAsync(
          superCompressed.uri,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        console.log(`Final compressed size: ${finalBase64.length} bytes`);
        return `data:image/jpeg;base64,${finalBase64}`;
      }

      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Compression error:", error);
      throw new Error("Failed to process image");
    }
  };

  const handleUploadPost = async () => {
    if (!imageUri || !title.trim() || !caption.trim()) {
      Alert.alert("Error", "Please fill in all fields and take a picture!");
      return;
    }
    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const base64Image = await convertImageToBase64(imageUri);
      const postData = {
        ownerId: user.uid,
        privacy,
        title: title.trim(),
        caption: caption.trim(),
        imageData: base64Image,
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
      };
      await addDoc(collection(db, "posts"), postData);

      Alert.alert("Success!", "Your post has been uploaded!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setCaption("");
            setImageUri(null);
            navigation.navigate("Gallery");
          },
        },
      ]);
    } catch (err) {
      console.error("Upload Error:", err);
      Alert.alert("Upload Error", err.message || "Failed to upload post");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* make status bar pink with light text */}
      <StatusBar backgroundColor="#eb11ee" barStyle="light-content" />

      {/* pink header */}
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Snap & Share</Text>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={() => navigation.navigate("Gallery")}
        >
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          <View style={styles.secondContainer}>
            <View style={styles.titleBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Add title here"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.captionBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Add description here"
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>
            <Text style={styles.label}>Who can view this image?</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={privacy} onValueChange={setPrivacy}>
                <Picker.Item label="Only You" value="private" />
                <Picker.Item label="Public" value="public" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity onPress={handleSnapPicture} disabled={isUploading}>
            <View style={[styles.firstBox, isUploading && styles.disabledBox]}>
              <View style={styles.iconRow}>
                <Text style={styles.actionText}>Snap Picture</Text>
                <Image
                  source={require("../../assets/camera-icon.png")}
                  style={styles.iconImage}
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUploadPost}
            disabled={isUploading || !imageUri}
          >
            <View style={[styles.secondBox, (isUploading || !imageUri) && styles.disabledBox]}>
              <View style={styles.iconRow}>
                {isUploading ? (
                  <>
                    <ActivityIndicator size="small" color="#000" style={{ marginRight: 10 }} />
                    <Text style={styles.actionText}>Uploading...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.actionText}>Upload Post</Text>
                    <Image
                      source={require("../../assets/share-icon.png")}
                      style={styles.iconImage}
                    />
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eb11ee",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  topContainer: {
    width: "100%",
    paddingTop: height * 0.05,
    height: height * 0.1,
    justifyContent: "flex-end",
    backgroundColor: "#eb11ee",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  galleryButton: {
    position: "absolute",
    right: width * 0.04,
    bottom: height * 0.005,
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    elevation: 3,
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#eb11ee",
  },
  secondContainer: {
    marginTop: height * 0.025,
    alignItems: "center",
    width: "100%",
  },
  titleBox: {
    padding: width * 0.015,
    borderWidth: 1,
    borderColor: "#000",
    width: "90%",
    backgroundColor: "#fff",
  },
  captionBox: {
    marginTop: height * 0.025,
    paddingLeft: width * 0.015,
    borderWidth: 1,
    borderColor: "#000",
    width: "90%",
    height: height * 0.325,
    backgroundColor: "#fff",
  },
  textInput: {
    fontSize: 18,
    color: "#000",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    width: "90%",
    marginBottom: 24,
  },
  firstBox: {
    width: width * 0.9,
    padding: height * 0.0075,
    marginTop: height * 0.035,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#eb11ee",
  },
  secondBox: {
    width: width * 0.9,
    padding: height * 0.007,
    marginTop: height * 0.025,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#2fe6fc",
  },
  actionText: {
    fontSize: 22,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconImage: {
    width: width * 0.12,
    height: width * 0.1,
  },
  previewImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: height * 0.03,
    borderRadius: 10,
  },
  disabledBox: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },
});

export default Snapsharescreen;