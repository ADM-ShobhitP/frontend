import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, ImageBackground, } from "react-native";
import { Text, TextInput, Portal, Provider, Card, Button, ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import service from "../service_axios";
import { login } from "../redux/AuthSlice";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleLogin = () => {
        setLoading(true);
        setError(null);

        console.log("TEST");

        service.post("/login/", { username, password })
            .then(response => {
                console.log("TEST 2");

                if (response.data && response.data.access_token) {
                    setSubmitted(true);
                    Alert.alert("Welcome Back", response.data.username)
                    dispatch(login({
                        user: response.data.username,
                        role: response.data.role,
                        token: response.data.access_token
                    }));
                    setUsername("");
                    setPassword("");
                    navigation.navigate('Home')
                }
                else {
                    setError("Invalid username or password");
                    Alert.alert("Login Failed");
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("AXIOS ERROR:");
                Alert.alert("Login Failed");
                setError('Failed authentication');
            })
            .finally(() => setLoading(false));
        setSubmitted(false);

    };

    return (
        <Provider>
            <Portal>
                <View style={styles.backgroundWrapper}>
                    <ImageBackground
                        source={require("../assets/back.jpeg")} style={styles.background} resizeMode="cover"
                    />
                </View>

                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.imageContainer}>
                                <Image source={require("../assets/login.png")} style={styles.image} />
                            </View>

                            <Text variant='headlineLarge' style={styles.title}>Login Page</Text>
                            <TextInput
                                label='Username' mode="flat" value={username} onChangeText={setUsername}
                                left={<TextInput.Icon icon="account" />} style={styles.input}
                            />

                            <TextInput
                                label='Password' secureTextEntry mode="flat" value={password} onChangeText={setPassword}
                                left={<TextInput.Icon icon="lock" />} style={styles.input}
                            />

                            <View style={styles.buttonRow}>
                                <Button mode="contained" onPress={handleLogin} disabled={loading} style={styles.button}>
                                    {loading ? <ActivityIndicator animating={true} color="white" /> : "Login"}
                                </Button>
                            </View>
                            {submitted}
                            <Text variant="bodyMedium" style={{ fontSize: 15, paddingLeft: 5, marginTop: 5 }}>
                                If you are a new user, {" "}
                                <Text onPress={() => navigation.navigate('SignUp')}
                                    style={{ fontWeight: 'bold', color: '#1E90FF', textDecorationLine: 'underline' }}> Sign Up </Text>
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
            </Portal>
        </Provider>
    );
}

const styles = StyleSheet.create({
    backgroundWrapper: {
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        zIndex: -1,
    },
    background: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '90%',
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        maxWidth: 400,
        padding: 20,
        elevation: 5,
        borderRadius: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 60,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: "100%",
        marginBottom: 10,
        backgroundColor: 'white',
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: 'blue',
    },
});
