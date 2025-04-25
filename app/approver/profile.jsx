import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Card, Text, Button, TextInput, Divider, Provider, Portal, Modal } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/AuthSlice";
import { useNavigation } from "@react-navigation/native";
import service from "../../service_axios";


export default function AProfile() {
    const [oldPwd, setOldPWd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [loading, setLoading] = useState(false);   
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.authReducer);


    const handleChange = () => {
        if (newPwd !== confirmPwd) {
            alert("New Password Does Not Match");
            return;
        }
        setLoading(true);

        service.post("/changepwd/", {
            username: user,
            old_pwd: oldPwd,
            new_pwd: newPwd
        })
        .then(response => {
            console.log("Password Changed Successfully:", response.data);
            setOldPWd("");
            setNewPwd("");
            setConfirmPwd("");
            Alert.alert("Success, Password changed successfully!");
            setVisible(false);
        })
        .catch(error => {
            console.error(error); 
            alert("Password change failed");
        })
        .finally(() => setLoading(false));
    };


    const handleLogOut = () => {
        dispatch(logout());
        navigation.navigate("Login")
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        {/* Profile Image  */}
                        <View style={styles.imageContainer}>
                            <Image source={require("../../assets/approver.png")} style={styles.profileImage} />
                        </View>

                        <Divider style={styles.divider} />
                        <Text variant="headlineMedium" style={styles.username}>UserName: {user}</Text>

                        <Divider style={styles.divider} />
                        <View style={styles.buttonContainer}>
                            <Button testID='pwdbutton' mode="contained" style={styles.button} onPress={() => setVisible(true)}>
                                Change Password
                            </Button>
                            <Button testID="logbutton" mode="contained" style={[styles.button, styles.logoutButton]} onPress={handleLogOut}>
                                LogOut
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                {/* Change Password Modal */}
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <Card style={[styles.card, {width: 400}]}>
                            <Card.Content>
                                {/* Profile Image */}
                                <View style={styles.imageContainer}>
                                    <Image source={require("../../assets/approver.png")} style={styles.profileImage} />
                                </View>

                                <Divider style={styles.divider} />
                                <Text testID="modaltitle" variant="headlineMedium" style={styles.headerText}>Change Password</Text>

                                <Divider style={styles.divider} />

                                <TextInput testID="testold" activeOutlineColor="blue" mode="outlined" label="Old Password" secureTextEntry value={oldPwd} onChangeText={setOldPWd} style={styles.input} />
                                <TextInput testID="testnew" activeOutlineColor="blue" mode="outlined" label="New Password" secureTextEntry value={newPwd} onChangeText={setNewPwd} style={styles.input} />
                                <TextInput testID="testcnfnew" activeOutlineColor="blue" mode="outlined" label="Confirm Password" secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd} style={styles.input} />

                                <View style={styles.buttonContainer}>
                                    <Button testID="subbutton" mode="contained" style={styles.button} onPress={handleChange}>Change Password</Button>
                                    <Button testID="canbutton" mode="contained" style={styles.cancelButton} onPress={() => setVisible(false)}>Cancel</Button>
                                </View>
                            </Card.Content>
                        </Card>                    
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    modalContainer: {
        borderRadius: 10,
        alignSelf: 'center',   // Ensures modal is centered
        justifyContent: 'center',  // Centers content inside modal
        alignItems: 'center',  // Centers content inside modal
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 160,
        height: 160,
        borderRadius: 50,
    },
    divider: {
        marginVertical: 10,
        backgroundColor: "#ddd",
        height: 1,
    },
    username: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        marginVertical: 10,
        backgroundColor: 'blue',
    },
    logoutButton: {
        backgroundColor: "red",
    },
    input: {
        marginVertical: 10,
        width: "100%",  // Ensure input fields take full width inside modal
    },
    cancelButton: {
        backgroundColor: "red",
        marginVertical: 10,
    },
});
