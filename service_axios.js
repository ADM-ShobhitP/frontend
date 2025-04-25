import axios from "axios";
import store from './redux/Store';
import actions from './redux/AuthSlice';
import Store from "./redux/Store";

const { getState, subscribe, dispatch } = Store

let user = getState().authReducer
subscribe(() => {
    user = getState().authReducer.token
})

const service = axios.create({
    baseURL: "http://10.1.15.185:8000",
});

// service.interceptors.request.use(request => {
//     if (request.url != '/login') {
//         if (user) {
//             request.headers = {
//                 ...request.headers,
//                 Authorization: `Bearer ${user}`
//             }
//         }
//     }
//     return request
// })
// fejfjkejd

export default service;
