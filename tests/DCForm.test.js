global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import DCForm from '../app/collector/dc_form';
import * as Location from 'expo-location';
import service from '../service_axios';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import authReducer, { login, setTime } from '../redux/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import Store from '../redux/Store';
import { Provider } from 'react-redux';

jest.mock('expo-location');

const mockBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        goBack: mockBack,
    }),
}));

jest.mock('../service_axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));



describe('DC Form Component', () => {
    const mockRoute = {
        params: {
            scheduleId: '1',
            plantData: { id: 1, name: 'mockPlant' },
        },
    };

    const mockEndTime = { data: { current_time: '16:40:00' } };

    // test('renders DC form correctly', () => {

    //     Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    //     Location.getCurrentPositionAsync.mockResolvedValueOnce({ coords: { latitude: 22.5600, longitude: 88.6797 } });
    

    //     const store = configureStore({
    //         reducer: { authReducer },
    //         preloadedState: {
    //             authReducer: {
    //                 start_times: { '1' : '16:40:00' }
    //             }
    //         }
    //     });

    //     store.dispatch(login({
    //         user: 'testuser',
    //         token: 'abc@123'
    //     }));
        
    //     render (
    //         <Provider store={store}>
    //             <DCForm route={mockRoute} />
    //         </Provider>
    //     )
    //     expect(screen.getByText('Visit Data Collection')).toBeTruthy();
    //     expect(screen.getByText('Plant Id:')).toBeTruthy();
    //     expect(screen.getByText('Plant Name:')).toBeTruthy();
    //     expect(screen.getByText('Start Time:')).toBeTruthy();
    //     expect(screen.getByText('Visit Date:')).toBeTruthy();
    //     expect(screen.getByText('Name of Person Met:')).toBeTruthy();
    //     expect(screen.getByText('Designation:')).toBeTruthy();
    //     expect(screen.getByText('Email:')).toBeTruthy();
    //     expect(screen.getByText('Contact:')).toBeTruthy();
    //     expect(screen.getByText('Location:Latitude')).toBeTruthy();
    //     expect(screen.getByText('Location:Longitude')).toBeTruthy();
    //     expect(screen.getByTestId('subbutton')).toBeTruthy();
    //     expect(screen.getByTestId('close')).toBeTruthy();
    // })

    test('insert data in DC form ', async () => {

        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
        Location.getCurrentPositionAsync.mockResolvedValueOnce({ coords: { latitude: 22.5600, longitude: 88.6797 } });
        
        service.get.mockResolvedValueOnce({ data: { current_time: '16:40:00' } });

        service.post.mockResolvedValueOnce({ data: 'Successful Data Insert' });

        const store = configureStore({
            reducer: { authReducer },
            preloadedState: {
                authReducer: {
                    start_times: { '1' : '16:40:00' }
                }
            }
        });

        store.dispatch(login({
            user: 'testuser',
            token: 'abc@123'
        }));
        
        render (
            <Provider store={store}>
                <DCForm route={mockRoute} />
            </Provider>
        )
        expect(screen.getByText('Visit Data Collection')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy();
        expect(screen.getByText('mockPlant')).toBeTruthy();
        expect(screen.getByText('16:40:00')).toBeTruthy();
        expect(screen.getByText('2025-04-29')).toBeTruthy();
        fireEvent.changeText(screen.getByText('Name of Person Met:'), 'mockPerson');
        fireEvent.changeText(screen.getByText('Designation:'), 'mockDesignation');
        fireEvent.changeText(screen.getByText('Email:'), 'mock@email.com');
        fireEvent.changeText(screen.getByText('Contact:'), '9876');
        await waitFor(() => {
            expect(screen.getByText('22.56')).toBeTruthy();
            expect(screen.getByText('88.6797')).toBeTruthy();    
        })
        expect(screen.getByTestId('subbutton')).toBeTruthy();
        fireEvent.press(screen.getByTestId('subbutton'));
        await waitFor(() => {
            expect(service.post).toHaveBeenCalledTimes(1);
        })
    });
})