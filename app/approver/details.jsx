import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import service from "../../service_axios";

export default function ADetails() {
    const route = useRoute();
    const schedule = route.params;
    console.log('schedule check', schedule)
    const navigation = useNavigation();
    const mapRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [approverData, setApproverData] = useState(null);
    const [polygonBoundary, setPolygonBoundary] = useState([]);
    const [insideBoundary, setInsideBoundary] = useState(false);


    useFocusEffect(
        React.useCallback(()=>{
            fetchApproverData();
            return () => {
            };
        
        },[schedule])
    );


    const fetchApproverData = async () => {
        service.get('/collectedata/')
            .then(response => {
                const filteredData = response.data.filter(item => item.schedule.id === schedule.id);
                console.log(filteredData);
                
                if (filteredData) {
                    console.log("Fetched plant data:",filteredData);
                    setApproverData(filteredData);
        
                    if (schedule.plant.boundaries && schedule.plant.boundaries.length > 0) {
                        const formattedBoundary = schedule.plant.boundaries.map(point => ({
                            latitude: point.latitude,
                            longitude: point.longitude,
                        }));
                        console.log("Polygon Boundary:", formattedBoundary)
                        setPolygonBoundary(formattedBoundary);
                        pointInPolygon(
                            { latitude: filteredData[0].dc_location_lat, longitude: filteredData[0].dc_location_long },
                            formattedBoundary
                        );
                    }
                }
        
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                Alert.alert("Error", "failed to fetch data");
            })
            .finally(() => setLoading(false));
    };


    const pointInPolygon = (point, polygon) => {
        let x = point.latitude, y = point.longitude;
        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i].latitude, yi = polygon[i].longitude;
            let xj = polygon[j].latitude, yj = polygon[j].longitude;

            let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        setInsideBoundary(inside);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading Approver Details...</Text>
            </View>
        );
    }

    if (approverData.length == 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No data available for this Approver</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            {/* Header With Status */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Approver Details</Text>
                <View style={[styles.status, insideBoundary ? styles.inside : styles.outside]}>
                    <Text style={styles.statusText}>{insideBoundary ? "Inside Boundary" : "Outside Boundary"}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Client Details */}
            <View style={styles.section}>
                <View style={styles.leftColumn}>
                    <Text style={styles.label}>Client Name:</Text>
                    <Text style={styles.value}>{approverData[0].Name_client}</Text>
                    <Text style={styles.label}>Designation:</Text>
                    <Text style={styles.value}>{approverData[0].Designation_client}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{approverData[0].Email_client}</Text>
                    <Text style={styles.label}>Contact:</Text>
                    <Text style={styles.value}>{approverData[0].Contact_client}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Visit Details */}
            <View style={styles.section}>
                <View style={styles.leftColumn}>
                    <Text style={styles.label}>Visit Date:</Text>
                    <Text style={styles.value}>{approverData[0].visit_date}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.label}>Working Hours:</Text>
                    <Text style={styles.value}>{approverData[0].start_time} - {approverData[0].end_time}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Plant: {approverData[0].plant.name}</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: approverData[0].dc_location_lat,
                            longitude: approverData[0].dc_location_long,
                            latitudeDelta: 0.002,
                            longitudeDelta: 0.002,
                        }}
                    >
                        {approverData[0].dc_location_lat && approverData[0].dc_location_long && (
                            <Marker
                                coordinate={{
                                    latitude: approverData[0].dc_location_lat,
                                    longitude: approverData[0].dc_location_long,
                                }}
                                title="Collector's Location"
                                description="Submitted data location"
                                pinColor="blue"
                            />
                        )}

                        {polygonBoundary.length > 0 && (
                            <Polygon coordinates={polygonBoundary} strokeColor="red" fillColor="rgba(255,0,0,0.3)" strokeWidth={2} />
                        )}
                    </MapView>
                </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    info: {
        fontSize: 16,
        marginBottom: 5,
    },
    status: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    inside: {
        backgroundColor: 'green',
    },
    outside: {
        backgroundColor: 'red',
    },
    statusText: {
        color: '#fff',
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    leftColumn: {
        flex: 1,
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 16,
        color: "black",
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    mapContainer: {
        borderRadius: 10,
        overflow: "hidden",
    },
    map: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
    closeButton: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        fontWeight: "bold",
    },
});
