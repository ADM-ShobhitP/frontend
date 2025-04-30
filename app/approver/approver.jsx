import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Provider, } from "react-native-paper";

export default function Approver() {

    return(
        <Provider>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={require("../../assets/coming.jpeg")} style={styles.profileImage} />
                </View>
                <Text style={styles.text}>Approver Data Coming Soon...</Text>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 100
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },    
    profileImage: {
        width: 500,
        height: 500,
        borderRadius: 20,
    },
    text: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#555",
    },
});