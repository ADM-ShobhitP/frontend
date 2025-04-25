import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, } from "react-native";
import { DataTable } from "react-native-paper";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import service from "../../service_axios";
import { setTime } from "../../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import DCForm from "./dc_form";

export default function CSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [polygonBoundary, setPolygonBoundary] = useState([]);
    const [insideBoundary, setInsideBoundary] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const map = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const {start_times, token } = useSelector((state) => state.authReducer);
    const numberOfItemsPerPageList = [20, 50, 75];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const navigation = useNavigation();


    const fetchSchedules = () => {
        setLoading(true);
        service.get("/userschedules/", {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token
            },
        })
        .then((response) => {
            setSchedules(response.data);
        })
        .catch((error) => console.error("Error fetching schedules:", error))
        .finally(() => setLoading(false));
    };

    const handleTime = (scheduleId, plant) => {
        
        console.log("Navigating with:", { scheduleId, plant });
        navigation.navigate("Form", {scheduleId, plantData: plant});
    
        if (!start_times?.[scheduleId]) {
            service.get("/currenttime/")
            .then(response => {
                dispatch(setTime({ ...start_times, [scheduleId]: response.data.current_time,}));
                console.log(`Schedule  ${scheduleId} Start Time:`, response.data.current_time);
            })
            .catch(error => console.error("Error fetching time:", error));
        } else {
            console.log(`Schedule ${scheduleId} Start Time:`, start_times[scheduleId]);
        }
    };

    const handleShowBoundary = (boundary, plant) => {
        if (!boundary || boundary.length === 0) {
            Alert.alert("No Boundary Data", "No boundary data available for this plant.");
            return;
        }
    
        const polygonBoundary = boundary.map(point => ({
            latitude: point.lat,
            longitude: point.lng
        }));
        setSelectedPlant(plant);
        setPolygonBoundary(polygonBoundary);
        setIsVisible(true);
    };

    function isPointInPolygon(point, polygon) {
        let x = point.latitude, y = point.longitude;
        let inside = false;
      
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          let xi = polygon[i].latitude, yi = polygon[i].longitude;
          let xj = polygon[j].latitude, yj = polygon[j].longitude;
      
          let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          if (intersect) inside = !inside;
        }
        return inside;
    }
    

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log("Loc Perm", status);
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Please enable location permissions in settings.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 0,
                timeout: 10000,
            });
            console.log("Raw location latitude:", location.coords.latitude + " Raw location longitude:", location.coords.longitude);
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude });
            const isInside = isPointInPolygon(location.coords, polygonBoundary);
            setInsideBoundary(isInside);
            console.log("inside:", isInside)
            let address = await Location.reverseGeocodeAsync(location.coords);
            console.log("address:",address)
            setAddress(address[0]);
        })
        ();
    }, [polygonBoundary]);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const paginatedSchedules = schedules.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setPage(0);
    }


    if (loading) {
        return <ActivityIndicator testID="loading" animating={true} size="large" style={styles.loader} />;
    }

    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Scheduled Visits</Text>

            <DataTable style={styles.table}>
                <DataTable.Header style={styles.headerRow}>
                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>ID</Text></DataTable.Title>
                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Plant</Text></DataTable.Title>
                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Visit Date</Text></DataTable.Title>
                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Location</Text></DataTable.Title>
                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Action</Text></DataTable.Title>
                </DataTable.Header>

                {schedules.length > 0 ? (
                    paginatedSchedules.map(schedule => (
                        <DataTable.Row key={schedule.id}>
                            <DataTable.Cell>{schedule.id}</DataTable.Cell>
                            <DataTable.Cell>{schedule.plant.name}</DataTable.Cell>
                            <DataTable.Cell>{schedule.visit_date}</DataTable.Cell>
                            
                            {/* Location Button */}
                            <DataTable.Cell>
                                <TouchableOpacity 
                                    style={schedule.boundary.length > 0 ? styles.locationButton : styles.disabledButton} 
                                    onPress={() => handleShowBoundary(schedule.boundary, schedule.plant)} disabled={!schedule.boundary}
                                >
                                    <Text style={styles.buttonText}>
                                        {schedule.boundary ? "View" : "No Location"}
                                    </Text>
                                </TouchableOpacity>
                            </DataTable.Cell>

                            {/* Start Time Button */}
                            <DataTable.Cell>
                                <TouchableOpacity style={styles.button} onPress={() => handleTime(schedule.id, schedule.plant)}>
                                    <Text style={styles.buttonText}>Start Time: {start_times?.[schedule.id] || "Not Started"}</Text>
                                </TouchableOpacity>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))
                ) : (
                    <Text style={styles.noData}>No Scheduled Visits.</Text>
                )}
                { schedules.length > itemsPerPage && (
                    <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(schedules.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                    label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, schedules.length)} of ${schedules.length}`}
                    showFastPaginationControls
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    selectPageDropdownLabel={'Rows per page'}
                />
            )}
            </DataTable>

            
            {/* Map View */}
            {isVisible && (
                <View style={styles.card}>
                    <Text style={styles.subheader}>{insideBoundary ? "📍The Point is inside the Polygon boundary" : "Outside the boundary"} </Text>
                    <Text style={styles.subheader}>Plant Name: {selectedPlant.name}</Text>
                    <Text style={styles.subheader}>Address: {address ? `${address.formattedAddress}` : "Fetching..."}</Text>
            
                <MapView
                    ref={map}
                    style={styles.map}
                    initialRegion={{
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                        latitudeDelta: 0.0013,
                        longitudeDelta: 0.0013,
                    }}
                    
                >
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title="Plant Location To Visit"
                        />
                    )}
                    {polygonBoundary.length > 0 && (
                        <Polygon coordinates={polygonBoundary} strokeColor="red" fillColor="rgba(255,0,0,0.3)" strokeWidth={2} tappable={true}
                            onPress={() => Alert.alert("The Boundary Is Made Up Of These Points")} />
                    )}
                </MapView>
            
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
                    <Text style={styles.buttonText}>Close Map</Text>
                </TouchableOpacity>
            </View>
            )}
        </ScrollView>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    table: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
    },
    headerRow: {
        backgroundColor: "#f2f2f2",
        height: 50,
        alignItems: "center",
    },
    column: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "left",
    },
    boldText: {
        fontWeight: "bold",
        textAlign: "left",
        color: "black",
    },
    button: {
        backgroundColor: "blue",
        padding: 6,
        borderRadius: 5,
    },
    locationButton: {
        backgroundColor: "green",
        padding: 6,
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: "gray",
        padding: 6,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
    card: {
        width: "100%",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 10,
        alignItems: "center",
    },
    subheader: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    map: {
        width: "100%",
        height: 300,
        marginVertical: 20,
    },
    closeButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    formContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "90%",
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
});