import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Dimensions } from "react-native";
import { db } from '../config/FirebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as ImageManipulator from 'expo-image-manipulator';


const { width, height } = Dimensions.get('window');

function Snapsharescreen({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (route.params?.imageUri) {
            setImageUri(route.params.imageUri);
        }
    }, [route.params?.imageUri]);

    const handleSnapPicture = () => {
        navigation.navigate('CameraScreen');
    };

    const compressImageCanvas = (imageUri, quality = 0.7, maxWidth = 800, maxHeight = 600) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;

                if (width > height && width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                } else if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', quality));
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUri;
        });
    };

    const handleUploadPost = async () => {
        if (!imageUri || !title.trim() || !caption.trim()) {
            console.log("[Upload] Missing fields — imageUri:", imageUri, "title:", title, "caption:", caption);
            Alert.alert('Error', 'Please fill in all fields and take a picture!');
            return;
        }

        console.log("[Upload] Starting upload...");
        setIsUploading(true);

        try {
            console.log('[Upload] Compressing image...');
            const compressed = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 800 } }],
                { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );
            console.log('[Upload] Compression done. URI:', compressed.uri);

            const response = await fetch(compressed.uri);
            console.log('[Upload] Fetching image URI:', compressed.uri);
            const blob = await response.blob();

            console.log('[Upload] Blob obtained. Size:', blob.size);

            if (blob.size > 1500000) {
                console.log("[Upload] Blob too large:", blob.size);
                Alert.alert('Image Too Large', 'Please take another image. The current image is too large to upload.');
                return;
            }

            console.log("[Upload] Converting blob to base64...");
            let base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log("[Upload] Base64 conversion success");
                    resolve(reader.result);
                };
                reader.onerror = (e) => {
                    console.error("[Upload] Base64 conversion failed:", e);
                    reject(e);
                };
                reader.readAsDataURL(blob);
            });

            let base64Size = base64.length * 0.75;
            console.log("[Upload] Base64 approx size:", base64Size);

            const postData = {
                title: title.trim(),
                caption: caption.trim(),
                imageBase64: base64,
                createdAt: serverTimestamp(),
                timestamp: Date.now(),
            };

            console.log("[Upload] Uploading to Firestore...");
            await addDoc(collection(db, 'posts'), postData);
            console.log("[Upload] Firestore upload successful");

            Alert.alert('Success!', 'Your post has been uploaded successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setTitle('');
                        setCaption('');
                        setImageUri(null);
                        console.log("[Upload] Form reset");
                    }
                }
            ]);
        } catch (error) {
            console.error("[Upload] Caught error during upload:", error);
            Alert.alert('Upload Error', 'Failed to upload post. Please try again.');
        } finally {
            setIsUploading(false);
            console.log("[Upload] Upload finished");
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.heading}>Snap & Share</Text>
            </View>

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
                        onChangeText={text => setTitle(text)}
                    />
                </View>

                <View style={styles.captionBox}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Add description here"
                        placeholderTextColor="#999"
                        value={caption}
                        onChangeText={text => setCaption(text)}
                        multiline
                    />
                </View>
            </View>

            <TouchableOpacity onPress={handleSnapPicture} disabled={isUploading}>
                <View style={[styles.firstBox, isUploading && styles.disabledBox]}>
                    <View style={styles.iconRow}>
                        <Text style={styles.actionText}>Snap Picture</Text>
                        <Image source={require('../../assets//camera-icon.png')} style={styles.iconImage} />
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUploadPost} disabled={isUploading || !imageUri}>
                <View style={[
                    styles.secondBox,
                    (isUploading || !imageUri) && styles.disabledBox
                ]}>
                    <View style={styles.iconRow}>
                        {isUploading ? (
                            <>
                                <ActivityIndicator size="small" color="#000" style={{ marginRight: 10 }} />
                                <Text style={styles.actionText}>Uploading...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.actionText}>Upload Post</Text>
                                <Image source={require('../../assets/share-icon.png')} style={styles.iconImage} />
                            </>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#fff',
    },
    topContainer: {
        width: '100%',
        paddingHorizontal: width * 0.02,
        paddingTop: height * 0.05,
        justifyContent: 'flex-end',
        backgroundColor: '#eb11ee',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    secondContainer: {
        marginTop: height * 0.025,
        alignItems: 'center',
        width: '100%',
    },
    titleBox: {
        padding: width * 0.015,
        borderWidth: 1,
        borderColor: '#000',
        width: '90%',
        backgroundColor: '#fff',
    },
    captionBox: {
        marginTop: height * 0.025,
        paddingLeft: width * 0.015,
        borderWidth: 1,
        borderColor: '#000',
        width: '90%',
        height: height * 0.325,
        backgroundColor: '#fff',
    },
    textInput: {
        fontSize: 18,
        color: '#000',
    },
    firstBox: {
        width: width * 0.9,
        padding: height * 0.0075,
        marginTop: height * 0.035,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: "#eb11ee",
    },
    secondBox: {
        width: width * 0.9,
        padding: height * 0.007,
        marginTop: height * 0.025,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: "#2fe6fc",
    },
    actionText: {
        fontSize: 22,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
});

export default Snapsharescreen;