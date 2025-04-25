global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import * as Location from 'expo-location';
import CSchedule from '../app/collector/schedule';
import service from '../service_axios';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polygon } from "react-native-maps";
import authReducer, { login, setTime } from '../redux/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import Store from '../redux/Store';
import Layout from '../app/_layout';
import { Provider } from 'react-redux';

jest.mock('expo-location');

jest.mock('../app/_layout', () => ({ children }) => <div testID='layout'>{children}</div> );

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
            
        }),
    };
});

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: (props) => <View testID='MapView'>{props.children}</View>,
        Marker: (props) => <View testID='Marker'>{props.children}</View>,
        Polygon: (props) => <View testID='Polygon'>{props.children}</View>,
    };
});

jest.mock('../service_axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('Data Collector Schedule Page', () => {

    const mockSchedules = [
        {
            id: 1,
            plant: { name: 'mockPlant' },
            visit_date: '2024-04-20',
            boundary: [ {lat: 22.5808, lng: 88.4591 }, {lat: 22.5764, lng: 88.4621 }, {lat: 22.5802, lng: 88.4629 }]
        },
    ];

    // test('renders schedule data', async () => {

    //     Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    //     Location.getCurrentPositionAsync.mockResolvedValueOnce({ coords: { latitude: 22.5600, longitude: 88.6797 } });
    //     Location.reverseGeocodeAsync.mockResolvedValueOnce([ { formattedAddress: 'Mock Address Kolkata, New Town' } ])

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/userschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/currenttime')) {
    //             return Promise.resolve({ data: { current_time: '10:40:00' } });
    //         }
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         token: 'abc@123'
    //     }));
        
    //     render (
    //         <Provider store={store}>
    //             <CSchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Your Scheduled Visits')).toBeTruthy();
    //         expect(screen.getByText('1')).toBeTruthy();
    //         expect(screen.getByText('mockPlant')).toBeTruthy();
    //         expect(screen.getByText('2024-04-20')).toBeTruthy();
    //         expect(screen.getByText('View')).toBeTruthy();
    //         expect(screen.getByText('Start Time: Not Started')).toBeTruthy();
    //     });
    // });

    // test('renders start time logic', async () => {

    //     Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    //     Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 22.5600, longitude: 88.6797 } });
    //     Location.reverseGeocodeAsync.mockResolvedValue([ { formattedAddress: 'Mock Address Kolkata, New Town' } ])

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/userschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/currenttime/')) {
    //             return Promise.resolve({ data: { current_time: '10:40:00' } });
    //         }
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         token: 'abc@123'
    //     }));
        
    //     render (
    //         <Provider store={store}>
    //             <CSchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Your Scheduled Visits')).toBeTruthy();
    //         expect(screen.getByText('View')).toBeTruthy();
    //         expect(screen.getByText('Start Time: Not Started')).toBeTruthy();
    //     });

    //     fireEvent.press(screen.getByText('Start Time: Not Started'));
    //     await waitFor(() => {
    //         expect(service.get).toHaveBeenCalledWith('/currenttime/');
    //         expect(screen.getByText('Start Time: 10:40:00')).toBeTruthy();
    //     });
    // });

    // test('renders map view logic', async () => {

    //     Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    //     Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 22.5600, longitude: 88.6797 } });
    //     Location.reverseGeocodeAsync.mockResolvedValue([ { formattedAddress: 'Mock Address Kolkata, New Town' } ])

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/userschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/currenttime/')) {
    //             return Promise.resolve({ data: { current_time: '10:40:00' } });
    //         }
    //     });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         token: 'abc@123'
    //     }));
        
    //     render (
    //         <Provider store={store}>
    //             <CSchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Your Scheduled Visits')).toBeTruthy();
    //         expect(screen.getByText('View')).toBeTruthy();
    //     });

    //     fireEvent.press(screen.getByText('View'));
    //     await waitFor(() => {
    //         expect(screen.getByText('Outside the boundary')).toBeTruthy();
    //         expect(screen.getByText('Plant Name: mockPlant')).toBeTruthy();
    //         expect(screen.getByText('Address: Mock Address Kolkata, New Town')).toBeTruthy();
    //         expect(screen.getByTestId('MapView')).toBeTruthy();
    //         expect(screen.getByTestId('Marker')).toBeTruthy();
    //         expect(screen.getByTestId('Polygon')).toBeTruthy();
    //         expect(screen.getByText('Close Map')).toBeTruthy();

    //     });
    // });

    test('schedule data render error', async () => {

        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        Location.getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: 22.5600, longitude: 88.6797 } });
        Location.reverseGeocodeAsync.mockResolvedValue([ { formattedAddress: 'Mock Address Kolkata, New Town' } ])

        service.get.mockImplementation((url) => {
            
            if (url.startsWith('/userschedules/')) {
                return Promise.resolve({ data: [] });
            }

            else if (url.startsWith('/currenttime/')) {
                return Promise.resolve({ data: { current_time: '10:40:00' } });
            }
        });

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'testuser',
            token: 'abc@123'
        }));
        
        render (
            <Provider store={store}>
                <CSchedule />
            </Provider>
        )
        expect(screen.getByTestId('loading')).toBeTruthy();

        await waitFor(() => {
            expect(screen.getByText('Your Scheduled Visits')).toBeTruthy();
            expect(screen.getByText('No Scheduled Visits.')).toBeTruthy();
        });
    });


})
