// src/api.js
import axios from 'axios';

const API_BASE_URL_USER = 'http://localhost:3000'; // Adjust according to your setup
const API_BASE_URL_CHANNEL = 'http://localhost:3002'; // Adjust according to your setup
const API_BASE_URL_MESSAGE = 'http://localhost:3003'; // Adjust according to your setup
const API_BASE_URL_WORKSPACE = 'http://localhost:3001'; // Adjust according to your setup

const getToken = () => localStorage.getItem('token');
const axiosWithToken = axios.create();

axiosWithToken.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {    
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('Error in request interceptor:', error);
        return Promise.reject(error);
    }
    );



export const register = (userData) => axios.post(`${API_BASE_URL_USER}/register`, userData);
export const login = (credentials) => axios.post(`${API_BASE_URL_USER}/login`, credentials);


export const fetchUser = (userId) => axiosWithToken.get(`${API_BASE_URL_USER}/users/${userId}`);
export const createWorkspace = (workspaceData) => axiosWithToken.post(`${API_BASE_URL_WORKSPACE}/workspaces`, workspaceData);
export const fetchWorkspaces = () => axiosWithToken.get(`${API_BASE_URL_WORKSPACE}/workspaces`);
export const fetchOneWorkspace = (workspaceId) => axiosWithToken.get(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`);
export const checkIfMemberOfWorkspace = (userId, workspaceId) => axiosWithToken.get(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}/members/${userId}`);
export const modifyWorkspace = (workspaceId, workspaceData) => axiosWithToken.put(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`, workspaceData);
export const deleteWorkspace = (workspaceId) => axiosWithToken.delete(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`);
export const createChannel = (workspaceId, channelData) => axiosWithToken.post(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}/channels`, channelData);
export const fetchChannels = (workspaceId) => axiosWithToken.get(`${API_BASE_URL_CHANNEL}/workspaces/${workspaceId}/channels`);
export const fetchOneChannel = (channelId) => axiosWithToken.get(`${API_BASE_URL_CHANNEL}/channels/${channelId}`);
export const checkIfMemberOfChannel = (userId, channelId) => axiosWithToken.get(`${API_BASE_URL_CHANNEL}/channels/${channelId}/members/${userId}`);
export const addMemberToChannel = (channelId, userId) => axiosWithToken.post(`${API_BASE_URL_CHANNEL}/channels/${channelId}/members`, {userId});
export const postAMessage = (channelId, messageData) => axiosWithToken.post(`${API_BASE_URL_MESSAGE}/channels/${channelId}/messages`, messageData);
export const fetchMessages = (channelId) => axiosWithToken.get(`${API_BASE_URL_MESSAGE}/channels/${channelId}/messages`);

// Add more API functions here following the pattern above
