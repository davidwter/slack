// src/api.js
import axios from 'axios';

const API_BASE_URL_USER = 'http://localhost:3000'; // Adjust according to your setup
const API_BASE_URL_CHANNEL = 'http://channel_service:3000'; // Adjust according to your setup
const API_BASE_URL_MESSAGE = 'http://message_service:3000'; // Adjust according to your setup
const API_BASE_URL_WORKSPACE = 'http://workspace_service:3000'; // Adjust according to your setup


export const register = (userData) => axios.post(`${API_BASE_URL_USER}/register`, userData);
export const login = (credentials) => axios.post(`${API_BASE_URL_USER}/login`, credentials);
export const fetchUser = (userId) => axios.get(`${API_BASE_URL_USER}/users/${userId}`);
export const createWorkspace = (workspaceData) => axios.post(`${API_BASE_URL_WORKSPACE}/workspaces`, workspaceData);
export const fetchWorkspaces = () => axios.get(`${API_BASE_URL_WORKSPACE}/workspaces`);
export const fetchOneWorkspace = (workspaceId) => axios.get(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`);
export const checkIfMemberOfWorkspace = (userId, workspaceId) => axios.get(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}/members/${userId}`);
export const modifyWorkspace = (workspaceId, workspaceData) => axios.put(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`, workspaceData);
export const deleteWorkspace = (workspaceId) => axios.delete(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}`);
export const createChannel = (workspaceId, channelData) => axios.post(`${API_BASE_URL_WORKSPACE}/workspaces/${workspaceId}/channels`, channelData);
export const fetchChannels = (workspaceId) => axios.get(`${API_BASE_URL_CHANNEL}/workspaces/${workspaceId}/channels`);
export const fetchOneChannel = (channelId) => axios.get(`${API_BASE_URL_CHANNEL}/channels/${channelId}`);
export const checkIfMemberOfChannel = (userId, channelId) => axios.get(`${API_BASE_URL_CHANNEL}/channels/${channelId}/members/${userId}`);
export const addMemberToChannel = (channelId, userId) => axios.post(`${API_BASE_URL_CHANNEL}/channels/${channelId}/members`, {userId});
export const postAMessage = (channelId, messageData) => axios.post(`${API_BASE_URL_MESSAGE}/channels/${channelId}/messages`, messageData);
export const fetchMessages = (channelId) => axios.get(`${API_BASE_URL_MESSAGE}/channels/${channelId}/messages`);

// Add more API functions here following the pattern above
