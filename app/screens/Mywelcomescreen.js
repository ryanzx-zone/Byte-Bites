import React, { useState }  from "react";
import { StyleSheet, View, Image, Text, TextInput, Button, Dimensions, SafeAreaView } from "react-native";

const { height, width } = Dimensions.get("window");

function Mywelcomescreen({ navigation }) {

    const [name, setName] = useState('');

    const handleLogin = () => {
      if (name.trim()) {
        navigation.navigate('Welcome', { userName: name });  
      } else {
        alert("Please enter your username.");
      }
    };

    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo}
                source={require('../assets/bytebitesclearlogo.png')}/>
          <Text style={styles.heading}>Welcome to KitchenGPT! </Text>
        </View>

        <View style={styles.centeredTextContainer}>
          
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
                color="#ba64f9"
                title="Get Started -->"  
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
      backgroundColor: '#cc0fb5',
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
      width: width * 0.75,
      height: width * 0.75,
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