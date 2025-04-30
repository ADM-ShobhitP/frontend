global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom'
import CProfile from '../app/collector/profile';
import service from '../service_axios';
import { useNavigation } from '@react-navigation/native';
import { LogBox } from 'react-native';
import authReducer, { login } from '../redux/AuthSlice';
import { configureStore } from '@reduxjs/toolkit';
import Store from '../redux/Store';
import Layout from '../app/_layout';
import { Provider } from 'react-redux';

jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
    __esModule: true,
    default: {
      ignoreLogs: jest.fn(),
    },
}));

jest.mock('../app/_layout', () => ({ children }) => <div testID='layout'>{children}</div> );

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate
    }),
}));

jest.mock('../service_axios', () => ({
    post: jest.fn()
}));

describe('CProfile Page', () => {

    const mockpassword = { username: 'testcollector', old_pwd: 'mockoldpwd', new_pwd: 'mocknewpwd' }

    // test('renders correctly with user data', () => {

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testcollector',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <CProfile />
    //             </Layout>
    //         </Provider>
    //     )
    //     expect(screen.getByText('UserName: testcollector')).toBeTruthy();
    //     expect(screen.getByTestId('pwdbutton'));
    //     expect(screen.getByTestId('logbutton'));
    // });

    // test('renders modal for change password button', () => {

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testcollector',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <CProfile />
    //             </Layout>
    //         </Provider>
    //     )
    //     fireEvent.press(screen.getByTestId('pwdbutton'));
    //     expect(screen.getByTestId('modaltitle').props.children).toBe('Change Password');
    //     expect(screen.getByTestId('testold-label-inactive').props.children).toBe('Old Password');
    //     expect(screen.getByTestId('testnew-label-inactive').props.children).toBe('New Password');
    //     expect(screen.getByTestId('testcnfnew-label-inactive').props.children).toBe('Confirm Password');
    //     expect(screen.getByTestId('subbutton-text').props.children).toBe('Change Password');
    //     expect(screen.getByTestId('canbutton-text').props.children).toBe('Cancel');
    // });

    // test('navigates back for logout button', () => {

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     })

    //     store.dispatch(login({
    //         user: 'testcollector',
    //     }))

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <CProfile />
    //             </Layout>
    //         </Provider>
    //     )
    //     fireEvent.press(screen.getByTestId('logbutton'));
    //     expect(mockNavigate).toHaveBeenCalledWith('Login');
    // });

    // test('renders new password after confirmation', async () => {

    //     service.post.mockResolvedValueOnce({ data: { message: "Old password changed" } });

    //     const store = configureStore({
    //         reducer: { authReducer },
    //     });

    //     store.dispatch(login({
    //         user: 'testcollector',
    //     }));

    //     render (
    //         <Provider store={store}>
    //             <Layout>
    //                 <CProfile />
    //             </Layout>
    //         </Provider>
    //     )
    //     fireEvent.press(screen.getByTestId('pwdbutton'));
    //     expect(screen.getByTestId('modaltitle').props.children).toBe('Change Password');
    //     fireEvent.changeText(screen.getByTestId('testold'), 'mockoldpwd');
    //     fireEvent.changeText(screen.getByTestId('testnew'), 'mocknewpwd');
    //     fireEvent.changeText(screen.getByTestId('testcnfnew'), 'mocknewpwd');
    //     fireEvent.press(screen.getByTestId('subbutton-text'));

    //     await waitFor(() => {
    //         expect(service.post).toHaveBeenCalledWith('/changepwd/', {
    //             username: 'testcollector',
    //             old_pwd: 'mockoldpwd',
    //             new_pwd: 'mocknewpwd',
    //         });
    //     });
    // });

    test('renders change password error', async () => {

        service.post.mockRejectedValueOnce(new Error('Change password error'));

        const store = configureStore({
            reducer: { authReducer },
        });

        store.dispatch(login({
            user: 'testcollector',
        }));

        render (
            <Provider store={store}>
                <Layout>
                    <CProfile />
                </Layout>
            </Provider>
        )
        fireEvent.press(screen.getByTestId('pwdbutton'));
        expect(screen.getByTestId('modaltitle').props.children).toBe('Change Password');
        fireEvent.changeText(screen.getByTestId('testold'), 'mockoldpwd');
        fireEvent.changeText(screen.getByTestId('testnew'), 'mocknewpwd');
        fireEvent.changeText(screen.getByTestId('testcnfnew'), 'mockwrong');
        fireEvent.press(screen.getByTestId('subbutton-text'));

        await waitFor(() => {
            expect(service.post).not.toHaveBeenCalled();
        });
    });
});