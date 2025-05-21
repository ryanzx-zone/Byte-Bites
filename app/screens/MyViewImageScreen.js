import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import colors from '../config/colors';

function MyViewImageScreen(props) {
    return (
        <View style={styles.container}>

            <View style={styles.topContainer}>
                <Image
                    resizeMode="contain"
                    style={styles.rackImage}
                    source={require('../assets/rack.webp')}
                />
            </View>

            <View style={styles.middleContainer}>
                <Text style={styles.Text0}>Hello User!</Text>
                <Text style={styles.Text1}>I am Kitchen AI, your helpful assistant! What would you like to do today?</Text>
                
                <View style={styles.featureRow}>
                    <View style={styles.featureBox4}>
                        <Text style={styles.featureText}>Recipe Search</Text>
                    </View>
                    <View style={styles.featureBox4}>
                        <Text style={styles.featureText}>Calorie Tracker</Text>
                    </View>
                    <View style={styles.featureBox4}>
                        <Text style={styles.featureText}>Timer</Text>
                    </View>
                    <View style={styles.featureBox4}>
                        <Text style={styles.featureText}>Snap & Share</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <Image
                    style={styles.tableImage}
                    resizeMode="contain"
                    source={require('../assets/table1.png')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: 10,
    },
    middleContainer: {
        flex: 2,
        padding: 20,
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '100%',
    },
    rackImage: {
        width: '100%',
        height: '100%',
    },
    tableImage: {
        width: '100%',
        height: 300,
        //alignSelf: 'stretch',
    },
    Text0: {
        fontSize: 24,
        fontStyle: 'italic',
        //marginBottom: 10,
        top: 10,
    },
    Text1: {
        fontSize: 24,
        fontStyle: 'italic',
        marginBottom: 30,
        top: 10,
    },
    Text2: {
        fontSize: 24,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'column',
        //flexWrap: 'wrap',
        //justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    featureBox1: {
        backgroundColor: '#11ee1b',
        width: '100%',
        height: 50,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    featureBox2: {
        backgroundColor: "#112fee",
        width: '100%',
        height: 50,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    featureBox3: {
        backgroundColor: colors.primary,
        width: '100%',
        height: 50,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    featureBox4: {
        backgroundColor: '#eb11ee',
        width: '100%',
        height: 50,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    featureText: {
        fontSize: 20,
        fontStyle: 'italic',
        color: '#fff',
    },
});

export default MyViewImageScreen;
