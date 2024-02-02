import axios from 'redaxios';

axios.defaults.baseURL = 'http://localhost:80/api';

function refreshHeader() {
    const isLoggedIn = localStorage.accessToken != null;

    if (isLoggedIn) {
        return `${localStorage.refreshToken?.toString().trim()}`;
    } else {
        return '';
    }
}

function authHeader() {
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
    baseURL: 'https://localhost:80/api',
});

export default instance;