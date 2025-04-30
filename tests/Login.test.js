global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import Login from '../app/login';
import service from '../service_axios';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polygon } from "react-native-maps";
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
    post: jest.fn(),
}));

describe('Login Page', () => {

    const mockLogin = { username: 'testuseraprvr',  role: 'Approver', access_token: 'abc@123' }

    // test('renders login page form', async () => {

    //     service.post.mockResolvedValueOnce({ data:   mockLogin })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testuseraprvr',
    //         role: 'Approver',
    //         token: 'abc@123'
    //     }));
        
    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeTruthy();
    //     expect(screen.getByTestId('username')).toBeTruthy();
    //     expect(screen.getByTestId('password')).toBeTruthy();
    //     expect(screen.getByText('Login')).toBeTruthy();
    // });

    // test('logs in successfully', async () => {

    //     service.post.mockResolvedValueOnce({ data:   mockLogin })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });
        
    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeTruthy();
    //     fireEvent.changeText(screen.getByTestId('username'), 'testuseraprvr');
    //     fireEvent.changeText(screen.getByTestId('password'), 'testpwd');
    //     fireEvent.press(screen.getByText('Login'));

    //     await waitFor(() => {
    //         expect(service.post).toHaveBeenCalledTimes(1)
    //         expect(service.post).toHaveBeenCalledWith('/login/', {
    //             username: 'testuseraprvr',
    //             password: 'testpwd',
    //         });
    //         expect(screen.getByText('Login')).toBeTruthy();
    //     });
    // });

    // test('access_token missing error', async () => {

    //     service.post.mockResolvedValueOnce({ data: {} })

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });
        
    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <Login />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('Login Page')).toBeTruthy();
    //     fireEvent.changeText(screen.getByTestId('username'), 'testuseraprvr');
    //     fireEvent.changeText(screen.getByTestId('password'), 'testpwd');
    //     fireEvent.press(screen.getByText('Login'));

    //     await waitFor(() => {
    //         expect(service.post).toHaveBeenCalledTimes(1)
    //         expect(screen.getByText('Login')).toBeTruthy();
    //         expect(screen.getByText('Invalid username or password'));
    //     });
    // });


    test('service axios error', async () => {

        service.post.mockRejectedValueOnce(new Error('Network error'))

        const store = configureStore({
            reducer: { authReducer },
        });
        
        render (
            <Provider store={store}>
                <Layout>
                    <Login />
                </Layout>
            </Provider>
        )
        expect(screen.getByText('Login Page')).toBeTruthy();
        fireEvent.changeText(screen.getByTestId('username'), 'testuseraprvr');
        fireEvent.changeText(screen.getByTestId('password'), 'testpwd');
        fireEvent.press(screen.getByText('Login'));

        await waitFor(() => {
            expect(service.post).toHaveBeenCalledTimes(1)
            expect(screen.getByText('Login')).toBeTruthy();
            expect(screen.getByText('Failed authentication'));
        });
    });

});
