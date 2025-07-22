import React, { useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground, Dimensions, SafeAreaView, TouchableWithoutFeedback, } from "react-native";

const { height, width } = Dimensions.get("window");

function MyViewImageScreen({ navigation, route }) {
  const { userName } = route.params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFeaturePress = (feature) => {
    switch (feature) {
      case "Recipe Search":
        navigation.navigate("RecipeSearch");
        break;
      case "Timer":
        navigation.navigate("Timer");
        break;
      case "Calorie Tracker":
        navigation.navigate("CT");
        break;
      case "Meal Planner":
        navigation.navigate("MP");
        break;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuPress = (screen) => {
    setIsMenuOpen(false);
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!isMenuOpen && (
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <View style={styles.menuButtonBackground}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        )}

        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {isMenuOpen && (
          <View style={styles.sideMenu}>
            <View style={styles.sideMenuHeader}>
              <Text style={styles.sideMenuTitle}>KitchenGPT</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.MenuContent}>
              <TouchableOpacity
                style={styles.MenuItem}
                onPress={closeMenu}
              >
                <Text style={styles.MenuText}>🏠 Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.MenuItem}
                onPress={() => handleMenuPress("Snapshare")}
              >
                <Text style={styles.MenuText}>📸 Snap & Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.MenuItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  navigation.navigate("Gallery", { viewMode: 'private' });
                }}
              >
                <Text style={styles.MenuText}>🖼️ My Posts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.MenuItem}
                onPress={() => {
                  setIsMenuOpen(false);
                  navigation.navigate("Gallery", { viewMode: 'public' });
                }}
              >
                <Text style={styles.MenuText}>👥 Community</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.topContainer}>
          <Image
            resizeMode="cover"
            style={styles.rackImage}
            source={require("../../assets/rack.webp")}
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
                {["Recipe Search", "Timer", "Calorie Tracker", "Meal Planner"].map(
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
    backgroundColor: "#eb11ee",
  },
  container: {
    flex: 1,
  },
  menuButton: {
    position: "absolute",
    top: height * 0.045,
    left: width * 0.01,
    zIndex: 1000,
  },
  menuButtonBackground: {
    width: width * 0.15,
    height: height * 0.065,
    backgroundColor: "#eb11ee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
  },
  menuLine: {
    width: width * 0.1,
    height: height * 0.0035,
    backgroundColor: "#fff",
    borderRadius: 2,
    marginVertical: height * 0.0025,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
    zIndex: 998,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 999,
  },
  sideMenuHeader: {
    height: height * 0.12,
    backgroundColor: "#eb11ee",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: height * 0.05,
  },
  sideMenuTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: width * 0.03,
    top: height * 0.06,
    width: width * 0.08,
    height: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  MenuContent: {
    flex: 1,
    paddingTop: height * 0.005,
  },
  MenuItem: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  MenuText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
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
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default MyViewImageScreen;
