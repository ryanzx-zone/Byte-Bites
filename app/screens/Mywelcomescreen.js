import React, { useState }  from "react";
import { StyleSheet, View, Image, Text, TextInput, Button, Dimensions, SafeAreaView } from "react-native";

const { height, width } = Dimensions.get("window");

function Mywelcomescreen({ navigation }) {

    const [name, setName] = useState('');

    const handleLogin = () => {
      if (name.trim()) {
        navigation.navigate('Welcome', { userName: name });  
      } else {
        alert("Please enter your name.");
      }
    };

    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo}
                source={require('../assets/Byte-bites-logo.jpg')}/>
          <Text style={styles.heading}>Welcome to KitchenGPT! </Text>
        </View>

        <View style={styles.centeredTextContainer}>
          <Text style={styles.italicText}>Enter Your Username</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor="#999"
                value={name}
                onChangeText={text => setName(text)}
              />
            <View style={styles.buttonContainer}>
              <Button
                color="#2fe6fc"
                title="Login ->"  
                onPress={handleLogin}
              />
            </View>
            </View>            
        </View>

      </View>
    </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#8000ff',
    },
    container: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    heading: {
      fontSize: 28,          
      fontWeight: 'bold',    
    },
    italicText: {
      fontSize: 24,
      fontStyle: 'italic',    
    },
    logo:{
      width: width * 0.5,
      height: width * 0.5,
    },
    logoContainer:{
      position: 'absolute',
      top: height * 0.1,
      alignItems: "center",
    },
    centeredTextContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      top: height * 0.05,
    },
    inputRow: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: width * 0.03,
    },
    textInput: {
      fontSize: 18,
      width: width * 0.8,
      height: height * 0.065,
      borderRadius: 10,
      paddingHorizontal: width * 0.04,
      marginTop: height * 0.02,
      backgroundColor: 'white',
    },
    buttonContainer: {
      justifyContent: 'center',  
      height: height * 0.065,              
      marginTop: height * 0.01,
    },
});

export default Mywelcomescreen;
