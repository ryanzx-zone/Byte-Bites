import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text, TextInput, Button } from "react-native";

function Mywelcomescreen(props) {
    return (
        <View style={styles.container}>
 
        <View style={styles.logoContainer}>
            <Image style={styles.logo}
                source={require('../assets/Byte-bites-logo.jpg')}/>
            <Text style={styles.heading}>Welcome to KitchenGPT! </Text>
         </View>

        <View style={styles.centeredTextContainer}>
        <Text style={styles.italicText}>Enter Your Name</Text>

        <View style={styles.inputRow}>
        <TextInput
        style={styles.textInput}
        placeholder="Name"
        placeholderTextColor="#999"
        />
        <View style={styles.buttonContainer}>
         <Button 
              color="#2fe6fc" 
              title="Login ->"  
              onPress={() => alert("Button tapped")}
              />
        </View>
        </View>

        </View>

        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#8000ff',
        //backgroundColor: '#2fe6fc',
        //backgroundColor: '#fff',
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    heading: {
    fontSize: 28,           
    fontWeight: 'bold',     
    //color: '#fff'
    },
    italicText: {
    fontSize: 24,
    fontStyle: 'italic',    
    },
    logo:{
    width: 150,
    height: 150,
    },
    logoContainer:{
    position: 'absolute',
    top: 120,
    alignItems: "center",
    },
    centeredTextContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: 50,
    },
    inputRow: {
    flexDirection: 'column',
    alignItems: 'center',
    //marginTop: 10,
    paddingHorizontal: 10,
    },
    textInput: {
    width: 300,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginTop: 20,
    marginRight: 10,
    },
    buttonContainer: {
    justifyContent: 'center',  
    height: 50,               
    marginTop: 5,
    },
   
    });

export default Mywelcomescreen;