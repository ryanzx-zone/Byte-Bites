import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, Platform} from 'react-native';
import Mywelcomescreen from './app/screens/Mywelcomescreen';
//import MyViewImageScreen from './app/screens/MyViewImageScreen';

export default function App() {
  return (
    <Mywelcomescreen />
    //<MyViewImageScreen />
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    //paddingTop: Platform.OS === "web" ? StatusBar.currentheight : 0,
  },
});
