import React, { useState }  from "react";
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity } from "react-native";

function MyRecipeSearch (props) {

    const [name, setName] = useState('');

    return (
        <View style={styles.container}>
 
        <View style={styles.topContainer}>
            <Text style={styles.heading}>Recipe Search </Text>
         </View>

        <View style={styles.secondContainer}>

        <View style={styles.inputWithFilterRow}>

        <View style={styles.inputRow}>
        <TextInput
        style={styles.textInput}
        placeholder="Ingredients"
        placeholderTextColor="#999"
        value={name}
        onChangeText={text => setName(text)}
        />
        <TouchableOpacity style={styles.iconContainer}>
         <Image style={styles.image}
            source={require('../assets/search-icon.png')}/>
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.icon2Container}>
         <Image style={styles.image2}
            source={require('../assets/filter-icon.jpg')}/>
        </TouchableOpacity>

        </View>
        </View>

        <View style={styles.recipeContainer}>
        <Image style={styles.recipeImage} source={require('../assets/casserole.jpg')} />
        <View style={styles.recipeTextContainer}>
        <TouchableOpacity>
        <Text style={styles.recipeHeading}>Chicken, Broccoli & Mushroom Casserole</Text>
        </TouchableOpacity>
        <Text style={styles.recipeDescribe}>It is a comforting, hearty dish baked in a creamy, cheesy sauce. Casserole is a single baking dish, often topped with cheese at the top for a crispy finish.</Text>
        </View>
        </View>

        <View style={styles.recipeContainer}>
        <Image style={styles.recipeImage} source={require('../assets/ketochicken.jpg')} />
        <View style={styles.recipeTextContainer}>
        <TouchableOpacity>
        <Text style={styles.recipeHeading}>Keto Chicken, Mushroom & Broccoli Stir Fry</Text>
        </TouchableOpacity>
        <Text style={styles.recipeDescribe}>It is a low-carb, high-protein dish featuring tender chicken, savory mushrooms and crisp broccoli sautéed in a flavorful garlic and soy-based sauce. It's a quick, healthy meal perfect for keto and low-carb lifestyles.</Text>
        </View>
        </View>

        <View style={styles.recipeContainer}>
        <Image style={styles.recipeImage} source={require('../assets/cmbpasta.webp')} />
        <View style={styles.recipeTextContainer}>
        <TouchableOpacity>
        <Text style={styles.recipeHeading}>Chicken, Mushroom & Broccoli Pasta</Text>
        </TouchableOpacity>
        <Text style={styles.recipeDescribe}>A simple, homemade chicken mushroom broccoli pasta seasoned with thyme and tossed in a Parmesan cream sauce!</Text>
        </View>
        </View>

        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: "center",
    },
    topContainer:{
    backgroundColor: '#eb11ee',
    width: '100%',
    paddingHorizontal: 10,
    height: 80, 
    justifyContent: 'flex-end',
    },
    heading: {
    fontSize: 26,           
    fontWeight: 'bold',     
    color: '#fff',
    },
    secondContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    },
    inputWithFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    },
    inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    width: 330,
    height: 50,
    },
    textInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    },
    iconContainer: {
    paddingLeft: 10,
    },
    image:{
    width: 25,
    height: 25,
    },
    icon2Container: {
    marginLeft: 10,
    },
    image2:{
    width: 35,
    height: 35,
    },
    recipeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    top: 15,
    },
    recipeImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    },
    recipeTextContainer: {
    flex: 1,
    flexDirection: 'column',
    },
    recipeHeading: {
    fontSize: 24,           
    fontWeight: 'bold', 
    textDecorationLine: 'underline',    
    },
    recipeDescribe: {
    fontSize: 18,           
    fontStyle: 'italic',    
    },
    });

export default MyRecipeSearch;