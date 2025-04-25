import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, } from "react-native";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { setTime } from "../../redux/AuthSlice";
import { useNavigation } from "@react-navigation/native";
import service from "../../service_axios";
import moment from "moment/moment";

const DCForm = ({ route }) => {
    const { start_times } = useSelector((state) => state.authReducer);
    const {scheduleId, plantData} = route.params;
    const navigation = useNavigation();
    const [personMet, setPersonMet] = useState({
        name: "",
        designation: "",
        email: "",
        contact: "",
        end_time: "",
    });
    const [location, setLocation] = useState({ lat: 0.0, long: 0.0 });
    const startTime = start_times?.[scheduleId];
    const visitDate = moment().format("YYYY-MM-DD");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location access is required to submit data.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 0,
                timeout: 10000,
            });
            setLocation({
                lat: location.coords.latitude,
                long: location.coords.longitude,
            });
        })();
    }, []);

    const handleSubmit = () => {

        service.get("/currenttime/")
        .then(response => {
            const serverEndTime = response.data.current_time;
            console.log("Fetched End Time:", serverEndTime);

            const formData = {
                plant_id: plantData.id,
                schedule_id: scheduleId,
                Name_client: personMet.name,
                Designation_client: personMet.designation,
                Email_client: personMet.email,
                Contact_client: personMet.contact,
                start_time: startTime,
                end_time: serverEndTime,
                visit_date: visitDate,
                dc_location_lat: location.lat,
                dc_location_long: location.long,
            };

            service.post("/checkdc/", formData)
                .then(response => {
                    Alert.alert("Success", "Visit Data Submitted Successfully!");
                })
                .catch(error => console.error("Error submitting visit data:", error));
        })
        .catch(error => {
            console.error("Error fetching end time:", error);
            Alert.alert("Error", "Could not fetch end time.");
        });
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Visit Data Collection</Text>

            <Text>Plant Id:</Text>
            <Text style={styles.readOnly}>{plantData?.id}</Text>

            <Text>Plant Name:</Text>
            <Text style={styles.readOnly}>{plantData?.name}</Text>

            <Text>Start Time:</Text>
            <Text style={styles.readOnly}>{startTime}</Text>

            <Text>Visit Date:</Text>
            <Text style={styles.readOnly}>{visitDate}</Text>

            <Text>Name of Person Met:</Text>
            <TextInput style={styles.input} placeholder="Enter Name" value={personMet.name} onChangeText={(text) => setPersonMet({ ...personMet, name: text })} />

            <Text>Designation:</Text>
            <TextInput style={styles.input} placeholder="Enter Designation" value={personMet.designation} onChangeText={(text) => setPersonMet({ ...personMet, designation: text })} />

            <Text>Email:</Text>
            <TextInput style={styles.input} placeholder="Enter Email" value={personMet.email} onChangeText={(text) => setPersonMet({ ...personMet, email: text })} keyboardType="email-address" />

            <Text>Contact:</Text>
            <TextInput style={styles.input} placeholder="Enter Contact" value={personMet.contact} onChangeText={(text) => setPersonMet({ ...personMet, contact: text })} keyboardType="phone-pad" />

            <Text>Location:Latitude</Text>
            <Text style={styles.readOnly}>{location.lat}</Text>

            <Text>Location:Longitude</Text>
            <Text style={styles.readOnly}>{location.long}</Text>

            <View style={styles.buttonRow}>
                <Button testID="subbutton" title="Submit" onPress={handleSubmit} />
                <Button testID="close" title="Close" onPress={() => navigation.goBack()} color="red" />
            </View>
        </ScrollView>
    );
};

// Styles
const styles = {
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "white",
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 8,
        marginVertical: 5,
        borderRadius: 5,
    },
    readOnly: {
        backgroundColor: "#f2f2f2",
        padding: 8,
        marginVertical: 5,
        borderRadius: 5,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
};

export default DCForm;
