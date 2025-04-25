global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/AuthSlice';
import Layout from '../app/_layout';

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
      ...jest.requireActual('react-native-gesture-handler'),
      PanGestureHandler: View,
      GestureHandlerRootView: View,
      State: {},
      Directions: {},
    };
});  
  
describe('Layout component', () => {

    // test('renders login when user is not authenticated', async () => {
    //     const store = configureStore({
    //         reducer: { authReducer },
    //         preloadedState: {
    //             authReducer: {
    //                 isAuthenticated: false,
    //                 role: null,
    //             },
    //         },
    //     });

    //     render(
    //         <Provider store={store}>
    //             <Layout />
    //         </Provider>
    //     );
    //     expect(screen.getByText('Login Page')).toBeTruthy();
    // });

    // test('renders Approver pages when user is authenticated', async () => {
    //     const store = configureStore({
    //         reducer: { authReducer },
    //         preloadedState: {
    //             authReducer: {
    //                 isAuthenticated: true,
    //                 role: 'Approver',
    //             },
    //         },
    //     });

    //     render(
    //         <Provider store={store}>
    //             <Layout />
    //         </Provider>
    //     );
    //     expect(screen.getByTestId('tab-profile')).toBeTruthy();
    //     expect(screen.getByTestId('tab-approver')).toBeTruthy();
    //     expect(screen.getByTestId('tab-schedules')).toBeTruthy();
    // });

    test('renders Data Collector pages when user is authenticated', async () => {
        const store = configureStore({
            reducer: { authReducer },
            preloadedState: {
                authReducer: {
                    isAuthenticated: true,
                    role: 'Data Collector',
                },
            },
        });

        render(
            <Provider store={store}>
                <Layout />
            </Provider>
        );
        expect(screen.getByTestId('tab-dcprofile')).toBeTruthy();
        expect(screen.getByTestId('tab-data-collector')).toBeTruthy();
        expect(screen.getByTestId('tab-dcschedules')).toBeTruthy();
    });
});
