import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { DataTable, ActivityIndicator, Text, Provider, Portal, Modal, Button, Menu, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import service from "../../service_axios";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment/moment";

export default function ASchedule() {
    const { token } = useSelector((state) => state.authReducer);
    const [schedules, setSchedules] = useState([]);
    const [newSchedule, setNewSchedule] = useState({ approver: '', collectors: [], plant: '', visit_date: new Date(), });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [mode, setMode] = useState('date');
    const [approvers, setApprovers] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [plants, setPlants] = useState([]);
    const [approverMenu, setApproverMenu] = useState(false);
    const [collectorMenu, setCollectorMenu] = useState(false);
    const [plantMenu, setPlantMenu] = useState(false);
    const numberOfItemsPerPageList = [25, 50, 75];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
    const navigation = useNavigation();


    const fetchSchedules = () => {
        setLoading(true);
        service.get("/apprschedules/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setSchedules(response.data);
            })
            .catch((error) => console.error("Error fetching schedules:", error))
            .finally(() => setLoading(false));


        service.get("/approverlist")
            .then(response => { setApprovers(response.data) })
            .catch(error => { console.error("Error fetching users", error); })

        service.get("/collectorslist")
            .then(response => { setCollectors(response.data) })
            .catch(error => { console.error("Error fetching users", error); })

        service.get("/plants")
            .then(response => { setPlants(response.data) })
            .catch(error => { console.error("Error fetching users", error); })
    };

    useEffect(() => {
        fetchSchedules();
    }, []);


    const handleChange = (field, value) => {
        setNewSchedule({ ...newSchedule, [field]: value });
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDatePickerVisible(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setDatePickerVisible(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        setDatePickerVisible('date');
    };

    const details = (schedule) => {
        navigation.navigate("Details", schedule)
    }

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

    const handleSubmit = () => {
        console.log(newSchedule)
        service.post("/insertschedules/", { ...newSchedule, visit_date: moment(newSchedule.visit_date).format('YYYY-MM-DD') })

            .then(() => {
                setError(null);
                setNewSchedule({ approver: '', collectors: [], plant: '', visit_date: new Date() });
                setModalVisible(false);
                fetchSchedules();
            })
            .catch(() => setError("Failed to Submit New Schedule. Try Again"))
    };


    return (
        <Provider>
            <View style={styles.container}>
                <ScrollView>

                    <Text style={styles.header}>Schedule Table</Text>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%", marginBottom: 10 }}>
                        <Button testID="addbutton" mode="contained" style={styles.topbutton} labelStyle={{ fontSize: 12 }} onPress={() => setModalVisible(true)}>
                            Add Schedule
                        </Button>
                    </View>

                    {loading ? (
                        <ActivityIndicator animating={true} size="large" style={styles.loader} />
                    ) : (
                        <ScrollView horizontal>
                            <DataTable style={styles.tableWrapper}>
                                <DataTable.Header style={styles.headerRow}>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>ID</Text></DataTable.Title>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Approver</Text></DataTable.Title>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Collectors</Text></DataTable.Title>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Plant</Text></DataTable.Title>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Visit Date</Text></DataTable.Title>
                                    <DataTable.Title style={styles.column}><Text style={styles.boldText}>Action</Text></DataTable.Title>
                                </DataTable.Header>

                                {paginatedSchedules.map((schedule) => (
                                    <DataTable.Row key={schedule.id} style={styles.row}>
                                        <DataTable.Cell style={styles.cell}>{schedule.id}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{schedule.approver.username}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{schedule.collectors.length === 0 ? "Empty" : schedule.collectors.map(col => col.username).join(", ")}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{schedule.plant.name}</DataTable.Cell>
                                        <DataTable.Cell style={styles.cell}>{schedule.visit_date}</DataTable.Cell>
                                        <DataTable.Cell>
                                            <TouchableOpacity testID="actbutton" style={styles.locationButton} onPress={() => details(schedule)}>
                                                <Text style={styles.buttonText}>Details</Text>
                                            </TouchableOpacity>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                                { paginatedSchedules.length > itemsPerPage && (<DataTable.Pagination
                                    page={page}
                                    numberOfPages={Math.ceil(schedules.length / itemsPerPage)}
                                    onPageChange={handlePageChange}
                                    label={`${page * itemsPerPage + 1}-${Math.min((page + 1) * itemsPerPage, schedules.length)} of ${schedules.length}`}
                                    showFastPaginationControls
                                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                                    numberOfItemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                    selectPageDropdownLabel={'Rows per page'}
                                />)}

                            </DataTable>
                        </ScrollView>
                    )}

                    {/* Insert New Schedule */}
                    <Portal>
                        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>Insert New Schedule</Text>

                            <Menu contentStyle={{ backgroundColor: 'white' }} visible={approverMenu} onDismiss={() => setApproverMenu(false)}
                                anchorPosition="top" anchor={
                                    <Button mode="contained" style={styles.menubutton} labelStyle={styles.menubuttonLabel} onPress={() => setApproverMenu(true)}>
                                        {newSchedule.approver ? approvers.find(approver => approver.id === newSchedule.approver)?.username : "Select Approver"}
                                    </Button>}>
                                <ScrollView style={{ maxHeight: 400 }}>
                                    {approvers.map(approver => (
                                        <Menu.Item key={approver.id} onPress={() => { setNewSchedule({ ...newSchedule, approver: approver.id }); setApproverMenu(false); }}
                                            title={approver.username} />
                                    ))}
                                </ScrollView>
                            </Menu>

                            <Menu contentStyle={{ backgroundColor: 'white' }} visible={collectorMenu} onDismiss={() => setCollectorMenu(false)}
                                anchorPosition="top" anchor={
                                    <Button mode="contained" style={styles.menubutton} labelStyle={styles.menubuttonLabel} onPress={() => setCollectorMenu(true)}>
                                        {newSchedule.collectors.length > 0 ? newSchedule.collectors.map(id => collectors.find(collector => collector.id === id)?.username).join(", ") : "Select Collectors"}
                                    </Button>}>
                                <ScrollView style={{ maxHeight: 400 }}>
                                    {collectors.map(collector => (
                                        <Menu.Item key={collector.id} onPress={() => { setNewSchedule({ ...newSchedule, collectors: [...newSchedule.collectors, collector.id] }); setCollectorMenu(false) }}
                                            title={collector.username} />
                                    ))}
                                </ScrollView>
                            </Menu>

                            <Menu contentStyle={{ backgroundColor: 'white' }} visible={plantMenu} onDismiss={() => setPlantMenu(false)}
                                anchorPosition="top" anchor={
                                    <Button mode="contained" style={styles.menubutton} labelStyle={styles.menubuttonLabel} onPress={() => setPlantMenu(true)}>
                                        {newSchedule.plant ? plants.find(plant => plant.id === newSchedule.plant)?.name : "Select Plant"}
                                    </Button>}>
                                <ScrollView style={{ maxHeight: 400 }}>
                                    {plants.map(plant => (
                                        <Menu.Item key={plant.id} onPress={() => { setNewSchedule({ ...newSchedule, plant: plant.id }); setPlantMenu(false); }}
                                            title={plant.name} />
                                    ))}
                                </ScrollView>
                            </Menu>

                            <SafeAreaView>
                                <Button mode="contained" style={styles.menubutton} onPress={showDatepicker}>
                                    {newSchedule.visit_date ? new Date(newSchedule.visit_date).toISOString().split('T')[0] : "Pick a Date"}
                                </Button>

                                {datePickerVisible && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={newSchedule.visit_date}
                                        mode={mode}
                                        is24Hour={true}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setNewSchedule({ ...newSchedule, visit_date: selectedDate });
                                            }
                                            setDatePickerVisible(false);
                                        }}
                                    />
                                )}
                            </SafeAreaView>

                            <View style={styles.buttonRow}>
                                <Button testID="subbutton" mode="contained" onPress={handleSubmit} style={styles.button}>Submit</Button>
                                <Button testID="close" mode="contained" onPress={() => { setModalVisible(false); setNewSchedule({ approver: '', collectors: [], plant: '', visit_date: new Date() }); }} style={styles.button}>Close</Button>
                            </View>
                            {error && <Text style={styles.error}>{error}</Text>}

                        </Modal>
                    </Portal>
                </ScrollView>

            </View>
        </Provider>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    topbutton: {
        backgroundColor: 'blue',
        marginHorizontal: 1,
        paddingVertical: 1,
        borderRadius: 5,
    },
    loader: {
        marginTop: 50,
        alignSelf: "center",
    },
    tableWrapper: {
        flexWrap: 1,
        width: "100%",
        minWidth: 1000,
        paddingBottom: 100
    },
    headerRow: {
        backgroundColor: "#f2f2f2",
        height: 50,
        alignItems: "center",
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        height: 50,
    },
    column: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "left",
    },
    cell: {
        flex: 1,
        textAlign: "left",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingRight: 10,
        flexWrap: "wrap",
    },
    boldText: {
        fontWeight: "bold",
        textAlign: "left",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 10,
        alignSelf: "center",
        width: "60%",
        alignSelf: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        width: "100%",
        marginBottom: 10,
        backgroundColor: "white",
    },
    buttonRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: "blue",
    },
    locationButton: {
        backgroundColor: "blue",
        padding: 6,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    error: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },

    menubutton: {
        backgroundColor: "blue",
        marginVertical: 10,
        paddingVertical: 8,
        borderRadius: 5,
    },
    menubuttonLabel: {
        color: "white",
        fontSize: 16,
    },
});
