import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import Login from "./login";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";

// Dummy Role-Based Screens
import AProfile from "./approver/profile";
import ASchedule from "./approver/schedule";
import ADetails from "./approver/details";
import Approver from "./approver/approver";

import CProfile from "./collector/profile";
import CSchedule from "./collector/schedule";
import DCForm from "./collector/dc_form";
import Collector from "./collector/collector";
// const DataCollectorScreen = () => <View><Text>Data Collector Page</Text></View>;
const SuperAdminScreen = () => <View><Text> SuperAdmin Page</Text></View>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Layout() {
    const { isAuthenticated } = useSelector((state) => state.authReducer);

    return (
            <PaperProvider>
                <View style={{ flex: 1 }}>
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            {isAuthenticated ? (
                                <Stack.Screen name="Home" component={AuthTabs} />
                            ) : (
                                <Stack.Screen name="Login" options={{ headerBackTestID: 'login-front' }} component={Login} />
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </PaperProvider>
    );
}

function DCTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{
            headerStyle: { backgroundColor: 'white', height: 90 },
            headerTintColor: 'black',
            tabBarStyle: { backgroundColor: 'blue' },
            tabBarActiveTintColor: "gold",
            tabBarInactiveTintColor: "white",
        }}>
            <Tab.Screen name="Profile" component={CProfile}
                options={{
                    tabBarButtonTestID: 'tab-dcprofile',
                    tabBarIcon: ({ color }) => <MaterialIcons name="account-box" size={28} color={color} />,
                }} />
            <Tab.Screen name="DataCollector" component={Collector}
                options={{
                    tabBarButtonTestID: 'tab-data-collector',
                    tabBarIcon: ({ color }) => <MaterialIcons name="assignment" size={28} color={color} />,
                }} />
            <Tab.Screen name="Schedules" component={CSchedule}
                options={{
                    tabBarButtonTestID: 'tab-dcschedules',
                    unMountOnBlur: true,
                    tabBarIcon: ({ color }) => <MaterialIcons name="schedule" size={28} color={color} />
                }} />
        </Tab.Navigator>
    );
}

function CollectorPage() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={DCTabNavigator} />
            <Stack.Screen name="Form" component={DCForm} options={{ headerShown: true, title: "Data Collection Form" }} />
        </Stack.Navigator>
    );
}

function APTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{
            headerStyle: { backgroundColor: 'white', height: 90 },
            headerTintColor: 'black',
            tabBarStyle: { backgroundColor: 'blue' },
            tabBarActiveTintColor: "gold",
            tabBarInactiveTintColor: "white",
        }}>
            <Tab.Screen name="Profile" component={AProfile}
                options={{
                    tabBarButtonTestID: 'tab-profile',
                    tabBarIcon: ({ color }) => <MaterialIcons name="account-box" size={28} color={color} />,
                }} />
            <Tab.Screen name="Approver" component={Approver}
                options={{
                    tabBarButtonTestID: 'tab-approver',
                    tabBarIcon: ({ color }) => <MaterialIcons name="check-circle" size={28} color={color} />,
                }} />
            <Tab.Screen name="Schedules" component={ASchedule}
                options={{
                    tabBarButtonTestID: 'tab-schedules',
                    unMountOnBlur: true,
                    tabBarIcon: ({ color }) => <MaterialIcons name="schedule" size={28} color={color} />,
                }} />
        </Tab.Navigator>
    );
}

function ApproverPage() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={APTabNavigator} />
            <Stack.Screen name="Details" component={ADetails} options={{ headerShown: true, title: "Approver Details" }} />
        </Stack.Navigator>
    );
}

function SuperAdminPage() {
    return (
        <Tab.Navigator screenOptions={{
            headerStyle: { backgroundColor: 'white', height: 90 },
            headerTintColor: 'black',
            tabBarStyle: { backgroundColor: 'blue' },
            tabBarActiveTintColor: "gold",
            tabBarInactiveTintColor: "white",
        }}>
            <Tab.Screen name="SuperAdmin" component={SuperAdminScreen}
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="admin-panel-settings" size={28} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}


function AuthTabs() {
    const { role } = useSelector((state) => state.authReducer);

    if (role === "Data Collector") {
        return <CollectorPage />;
    }
    else if (role === "Approver") {
        return <ApproverPage />;
    }
    else if (role === "SuperAdmin") {
        return <SuperAdminPage />;
    }
    else {
        return <View><Text>Inavlid Role</Text></View>
    }
}

