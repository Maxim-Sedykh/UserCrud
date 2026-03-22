import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const userService = {
    getAllUsers: (page = 0, limit = 10) => {
        return axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    },

    getUserById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    createUser: (userData) => {
        return axios.post(API_URL, userData);
    },

    updateUser: (id, userData) => {
        return axios.put(`${API_URL}/${id}`, userData);
    },

    deleteUser: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    activateUser: (id) => {
        return axios.patch(`${API_URL}/${id}/activate`);
    },

    deactivateUser: (id) => {
        return axios.patch(`${API_URL}/${id}/deactivate`);
    },
};

export default userService;