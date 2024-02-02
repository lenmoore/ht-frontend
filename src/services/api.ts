import axios from 'redaxios';


function refreshHeader() {
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return `${localStorage.refreshToken?.toString().trim()}`;
    } else {
        return '';
    }
}

function authHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return `Bearer ${localStorage.accessToken?.toString().trim()}`;
    } else {
        return '';
    }
}


const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader().toString(),
        'X-Refresh': refreshHeader().toString(),
        'X-Forwarded-For': '',
    },
    baseURL: 'http://localhost/api',
});

export default instance;