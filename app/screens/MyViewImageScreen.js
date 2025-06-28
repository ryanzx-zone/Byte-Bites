import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground, Dimensions, SafeAreaView } from "react-native";

const { height, width } = Dimensions.get("window");

function MyViewImageScreen({ navigation, route }) {

  const { userName } = route.params;

  const handleFeaturePress = (feature) => {
      switch (feature) {
      case "Recipe Search":
        navigation.navigate("RecipeSearch");
      break;
      case "Timer":
        navigation.navigate("Timer");
      break;
      case "Snap & Share":
        navigation.navigate("Snapshare");
      break;
      case "Gallery":
        navigation.navigate("Gallery");
      break;
      }
  };
   
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Image
                resizeMode="cover"
                style={styles.rackImage}
                source={require('../../assets//rack.webp')}
              />
            </View>
   
            <View style={styles.middleContainer}>
              <ImageBackground
                style={styles.background}
                source={require("../../assets/plaintabletop.jpg")}
                resizeMode="cover"
              >
                <View style={styles.content}>
                  <Text style={styles.Text0}>Hello {userName}!</Text>
                  <Text style={styles.Text1}>
                    I am Kitchen AI, your helpful assistant! What would you like to do today?
                  </Text>
   
                  <View style={styles.featureRow}>
                    {["Recipe Search", "Timer", "Snap & Share", "Gallery"].map(
                      (item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.featureBox}
                          onPress={() => handleFeaturePress(item)}
                        >
                          <Text style={styles.featureText}>{item}</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        </SafeAreaView>
      );
    }
   
    const styles = StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: "#fff",
      },
      container: {
        flex: 1,
      },
      topContainer: {
        height: height * 0.4,
        backgroundColor: "#eee",
      },
      rackImage: {
        width: "100%",
        height: "100%",
      },
      middleContainer: {
        flex: 1,
      },
      background: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      },
      content: {
        flex: 1,
        width: "100%",
        paddingHorizontal: width * 0.05, 
        alignItems: "center",
      },
      Text0: {
        fontSize: 26,
        fontStyle: "italic",
        marginTop: height * 0.01,
        marginBottom: height * 0.01,
        textAlign: "center",
        color: "#000",
      },
      Text1: {
        fontSize: 24,
        marginBottom: height * 0.02,
        color: "#000",
      },
      featureRow: {
        flexDirection: "column",
        alignItems: "stretch",
        flexWrap: "wrap",
        width: "100%",
      },
      featureBox: {
        width: "100%",
        height: height * 0.065,
        marginVertical: height * 0.015,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#eb11ee",
      },
      featureText: {
        fontSize: 22,
        fontStyle: "italic",
        fontWeight: 'bold',
        textAlign: "center",
        color: "#fff",
      },
    });

export default MyViewImageScreen;
