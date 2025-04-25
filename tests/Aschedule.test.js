global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import ASchedule from '../app/approver/schedule';
import service from '../service_axios';
import { useNavigation } from '@react-navigation/native';
import authReducer, { login } from '../redux/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import Store from '../redux/Store';
import Layout from '../app/_layout';
import { Provider } from 'react-redux';

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

jest.mock('../service_axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('Approver Schedule Page', () => {

    const mockSchedules = [
        {
            id: 1,
            approver: { username: 'mockaprvr1' },
            collectors: [{ username: 'mockclctr1' }, { username: 'mockclctr2' }],
            plant: { name: 'mockPlant' },
            visit_date: '2024-04-20'
        },
    ];

    const mockApprovers = [{ id: 10, username: 'aprvr1', role: 'Approver' }, { id: 11, username: 'aprvr2', role: 'Approver' }];
    const mockCollector = [{ id: 12, username: 'clctr1', role: 'Data Collector' }, { id: 13, username: 'clctr2', role: 'Data Collector' }];
    const mockPlants = [{ id: 1, name: 'Plant1'}, { id: 2, name: 'Plant2' }];
    const currentDate = '2025-04-23'

    // test('renders schedule data', async () => {

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/apprschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/approverlist')) {
    //             return Promise.resolve({ data: mockApprovers });
    //         }

    //         else if (url.startsWith('/collectorslist')) {
    //             return Promise.resolve({ data: mockCollector });
    //         }

    //         else if (url.startsWith('/plants')) {
    //             return Promise.resolve({ data: mockPlants });
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
    //                 <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Schedule Table')).toBeTruthy();
    //         expect(screen.getByTestId('addbutton')).toBeTruthy();
    //         expect(screen.getByText('1')).toBeTruthy();
    //         expect(screen.getByText('mockaprvr1')).toBeTruthy();
    //         expect(screen.getByText('mockclctr1, mockclctr2')).toBeTruthy();
    //         expect(screen.getByText('mockPlant')).toBeTruthy();
    //         expect(screen.getByText('2024-04-20')).toBeTruthy();
    //         expect(screen.getByTestId('actbutton')).toBeTruthy();
    //     })
    // });

    // test('renders actbutton navigation', async () => {

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/apprschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/approverlist')) {
    //             return Promise.resolve({ data: mockApprovers });
    //         }

    //         else if (url.startsWith('/collectorslist')) {
    //             return Promise.resolve({ data: mockCollector });
    //         }

    //         else if (url.startsWith('/plants')) {
    //             return Promise.resolve({ data: mockPlants });
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

    //                 <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Schedule Table')).toBeTruthy();
    //         expect(screen.getByTestId('actbutton')).toBeTruthy();
    //         fireEvent.press(screen.getByTestId('actbutton'));
    //         expect(mockNavigate).toHaveBeenCalledTimes(1);
    //     });
    // });

    // test('renders addbutton and renders insert schedule form', async () => {

    //     // service.post.mockResolvedValueOnce({ data: "Schedule Added Successfully" })

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/apprschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/approverlist')) {
    //             return Promise.resolve({ data: mockApprovers });
    //         }

    //         else if (url.startsWith('/collectorslist')) {
    //             return Promise.resolve({ data: mockCollector });
    //         }

    //         else if (url.startsWith('/plants')) {
    //             return Promise.resolve({ data: mockPlants });
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

    //                 <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Schedule Table')).toBeTruthy();
    //         expect(screen.getByTestId('addbutton')).toBeTruthy();
    //         fireEvent.press(screen.getByTestId('addbutton'));

    //         expect(screen.getByText('Insert New Schedule')).toBeTruthy();
    //         expect(screen.getByText('Select Approver')).toBeTruthy();
    //         expect(screen.getByText('Select Collectors')).toBeTruthy();
    //         expect(screen.getByText('Select Plant')).toBeTruthy();
    //         expect(screen.getByText('2025-04-23')).toBeTruthy();
    //         expect(screen.getByText('2025-04-23')).toBeTruthy();
    //         expect(screen.getByText('Submit')).toBeTruthy();
    //         expect(screen.getByText('Close')).toBeTruthy();
    //     })
    // });

    // test('inserting data in schedule form', async () => {

    //     service.post.mockResolvedValueOnce({ data: "Schedule Added Successfully" })

    //     service.get.mockImplementation((url) => {
            
    //         if (url.startsWith('/apprschedules/')) {
    //             return Promise.resolve({ data: mockSchedules });
    //         }

    //         else if (url.startsWith('/approverlist')) {
    //             return Promise.resolve({ data: mockApprovers });
    //         }

    //         else if (url.startsWith('/collectorslist')) {
    //             return Promise.resolve({ data: mockCollector });
    //         }

    //         else if (url.startsWith('/plants')) {
    //             return Promise.resolve({ data: mockPlants });
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

    //                 <ASchedule />
    //         </Provider>
    //     )
    //     expect(screen.getByTestId('loading')).toBeTruthy();

    //     await waitFor(() => {
    //         expect(screen.getByText('Schedule Table')).toBeTruthy();
    //         expect(screen.getByTestId('addbutton')).toBeTruthy();
    //     });

    //     fireEvent.press(screen.getByTestId('addbutton'));
    //     await waitFor(() => {
    //         expect(screen.getByText('Insert New Schedule')).toBeTruthy();
    //         expect(screen.getByText('Select Approver')).toBeTruthy();
    //         expect(screen.getByText('Select Collectors')).toBeTruthy();
    //         expect(screen.getByText('Select Plant')).toBeTruthy();
    //     });

    //     fireEvent.press(screen.getByText('Select Approver'));
    //     await waitFor(() => {
    //         expect(screen.getByText('aprvr1')).toBeTruthy();
    //         expect(screen.getByText('aprvr1')).toBeTruthy();
    //         fireEvent.press(screen.getByText('aprvr2'));
    //     });
        
    //     fireEvent.press(screen.getByText('Select Collectors'));
    //     await waitFor(() => {
    //         expect(screen.getByText('clctr1')).toBeTruthy();
    //         expect(screen.getByText('clctr2')).toBeTruthy();
    //         fireEvent.press(screen.getByText('clctr1'));
    //     });

    //     fireEvent.press(screen.getByText('clctr1'));
    //     await waitFor(() => {
    //         expect(screen.getByText('clctr2')).toBeTruthy();
    //         fireEvent.press(screen.getByText('clctr2'));
    //     });


    //     fireEvent.press(screen.getByText('Select Plant'));
    //     await waitFor(() => {
    //         expect(screen.getByText('Plant1')).toBeTruthy();
    //         expect(screen.getByText('Plant2')).toBeTruthy();
    //         fireEvent.press(screen.getByText('Plant2'));
    //     });
    //     expect(screen.getByText('2025-04-23')).toBeTruthy();

    //     fireEvent.press(screen.getByText('Submit'));
    //     await waitFor(() => {
    //         expect(service.post).toHaveBeenCalledTimes(1)
    //     });
    // });

    test('insert schedule data error', async () => {

        service.post.mockRejectedValueOnce(new Error('Data insert error'))

        service.get.mockImplementation((url) => {
            
            if (url.startsWith('/apprschedules/')) {
                return Promise.resolve({ data: mockSchedules });
            }

            else if (url.startsWith('/approverlist')) {
                return Promise.resolve({ data: mockApprovers });
            }

            else if (url.startsWith('/collectorslist')) {
                return Promise.resolve({ data: mockCollector });
            }

            else if (url.startsWith('/plants')) {
                return Promise.resolve({ data: mockPlants });
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
                <ASchedule />
            </Provider>
        )
        expect(screen.getByTestId('loading')).toBeTruthy();

        await waitFor(() => {
            expect(screen.getByText('Schedule Table')).toBeTruthy();
            expect(screen.getByTestId('addbutton')).toBeTruthy();
        });

        fireEvent.press(screen.getByTestId('addbutton'));
        await waitFor(() => {
            expect(screen.getByText('Insert New Schedule')).toBeTruthy();
            expect(screen.getByText('Select Approver')).toBeTruthy();
            expect(screen.getByText('Select Collectors')).toBeTruthy();
            expect(screen.getByText('Select Plant')).toBeTruthy();
        });

        fireEvent.press(screen.getByText('Select Approver'));
        await waitFor(() => {
            expect(screen.getByText('aprvr1')).toBeTruthy();
            expect(screen.getByText('aprvr1')).toBeTruthy();
            fireEvent.press(screen.getByText('aprvr2'));
        });
        
        fireEvent.press(screen.getByText('Select Collectors'));
        await waitFor(() => {
            expect(screen.getByText('clctr1')).toBeTruthy();
            expect(screen.getByText('clctr2')).toBeTruthy();
            fireEvent.press(screen.getByText('clctr1'));
        });

        fireEvent.press(screen.getByText('clctr1'));
        await waitFor(() => {
            expect(screen.getByText('clctr2')).toBeTruthy();
            fireEvent.press(screen.getByText('clctr2'));
        });


        fireEvent.press(screen.getByText('Select Plant'));
        await waitFor(() => {
            expect(screen.getByText('Plant1')).toBeTruthy();
            expect(screen.getByText('Plant2')).toBeTruthy();
            fireEvent.press(screen.getByText('Plant2'));
        });
        expect(screen.getByText('2025-04-23')).toBeTruthy();

        fireEvent.press(screen.getByText('Submit'));
        await waitFor(() => {
            expect(screen.getByText('Failed to Submit New Schedule. Try Again')).toBeTruthy();
        });
    });
});