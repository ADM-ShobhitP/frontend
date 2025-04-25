global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import ADetails from '../app/approver/details';
import MapView, { Marker, Polygon } from "react-native-maps";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';
import service from '../service_axios';
import authReducer, { login } from '../redux/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import Store from '../redux/Store';
import Layout from '../app/_layout';
import { Provider } from 'react-redux';

const mockBack = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: mockBack,
        }),
        useRoute: jest.fn(),
    };
});

jest.mock('../service_axios', () => ({
    get: jest.fn()
}));

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    const MockMap = (props) => <View testID='MapView'>{props.children}</View>
    return {
        __esModule: true,
        default: MockMap,
        Marker: (props) => <View testID='Marker'>{props.children}</View>,
        Polygon: (props) => <View testID='Polygon'>{props.children}</View>,
    };
});

describe('ADetails Page', () => {
    
    const mockApproverScheduleData = [
        {
            schedule: { id: 1 },
            Name_client: 'mockname',
            Designation_client: 'mockdesignation',
            Email_client: 'mock@email.com',
            Contact_client: '1233',
            visit_date: '2024-04-20',
            start_time: '09:45',
            end_time: '17:45',
            plant: { name: 'mockPlant' },
            dc_location_lat: 22.5778,
            dc_location_long: 88.4617,
        },
    ];

    // test('renders loading then shows approver data', async () => {

    //     service.get.mockResolvedValue({ data: mockApproverScheduleData });

    //     useRoute.mockReturnValue({
    //         params: {
    //             id: 1, 
    //             plant: { 
    //                 name: 'mockPlant',
    //                 boundaries: [
    //                     { latitude: 22.5808, longitude: 88.4591 },
    //                     { latitude: 22.5764, longitude: 88.4621 },
    //                     { latitude: 22.5802, longitude: 88.4629 },
    //                 ],
    //             },
    //         },
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testuser',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <NavigationContainer>
    //                 <ADetails />
    //             </NavigationContainer>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Approver Details')).toBeTruthy();
    //         expect(screen.getByText('Inside Boundary')).toBeTruthy();    
    //         expect(screen.getByText('mockname')).toBeTruthy();    
    //         expect(screen.getByText('mockdesignation')).toBeTruthy();
    //         expect(screen.getByText('mock@email.com')).toBeTruthy();    
    //         expect(screen.getByText('1233')).toBeTruthy();    
    //         expect(screen.getByText('2024-04-20')).toBeTruthy();    
    //         expect(screen.getByText('09:45 - 17:45')).toBeTruthy();    
    //         expect(screen.getByText('Close')).toBeTruthy();    
    //     });
    // });

    // test('renders loading then shows plant data', async () => {

    //     service.get.mockResolvedValue({ data: mockApproverScheduleData });

    //     useRoute.mockReturnValue({
    //         params: {
    //             id: 1, 
    //             plant: { 
    //                 name: 'mockPlant',
    //                 boundaries: [
    //                     { latitude: 22.5808, longitude: 88.4591 },
    //                     { latitude: 22.5764, longitude: 88.4621 },
    //                     { latitude: 22.5802, longitude: 88.4629 },
    //                 ],
    //             },
    //         },
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testuser',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <NavigationContainer>
    //                 <ADetails />
    //             </NavigationContainer>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Approver Details')).toBeTruthy();
    //         expect(screen.getByText('Plant: mockPlant')).toBeTruthy();
    //         expect(screen.getByTestId('MapView')).toBeTruthy();
    //         expect(screen.getByTestId('Marker')).toBeTruthy();
    //         expect(screen.getByTestId('Polygon')).toBeTruthy();
    //     });
    // });

    // test('navigates go back button ', async () => {

    //     service.get.mockResolvedValue({ data: mockApproverScheduleData });

    //     useRoute.mockReturnValue({
    //         params: {
    //             id: 1, 
    //             plant: { 
    //                 name: 'mockPlant',
    //                 boundaries: [
    //                     { latitude: 22.5808, longitude: 88.4591 },
    //                     { latitude: 22.5764, longitude: 88.4621 },
    //                     { latitude: 22.5802, longitude: 88.4629 },
    //                 ],
    //             },
    //         },
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testuser',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <NavigationContainer>
    //                 <ADetails />
    //             </NavigationContainer>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Loading Approver Details...')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Approver Details')).toBeTruthy();
    //         expect(screen.getByText('Close')).toBeTruthy();
    //         fireEvent.press(screen.getByText('Close'));
    //         expect(mockBack).toHaveBeenCalledTimes(1);
    //     });
    // });

    test('renders error message when no collected data available', async () => {

        service.get.mockResolvedValue({ data: [] });

        useRoute.mockReturnValue({
            params: {
                id: 1, 
                plant: { 
                    name: 'mockPlant',
                    boundaries: [
                        { latitude: 22.5808, longitude: 88.4591 },
                        { latitude: 22.5764, longitude: 88.4621 },
                        { latitude: 22.5802, longitude: 88.4629 },
                    ],
                },
            },
        });

        const store = configureStore({
            reducer: { authReducer },
        })

        store.dispatch(login({
            user: 'testuser',
        }))

        render (
            <Provider store={store}>
                <NavigationContainer>
                    <ADetails />
                </NavigationContainer>
            </Provider>
        )
        expect(screen.getByText('Loading Approver Details...')).toBeTruthy();

        await waitFor(() => {
            expect(screen.getByText('No data available for this Approver')).toBeTruthy();
        });
    });

})
