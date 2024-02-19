// services/userService.js
const axios = require('axios');

const userExists = async (userId) => {
  try {
    // Adjust the URL based on your User Service's actual endpoint for fetching user details
    const response = await axios.get(`http://user_service:3000/users/${userId}`);
    return response.status === 200;
  } catch (error) {
    console.error('Error checking user existence:', error);
    // Handle specific errors (e.g., user not found, service unavailable) as needed
    return false;
  }
};

const userDetails = async (userId) => {
  try {
    // Adjust the URL based on your User Service's actual endpoint for fetching user details
    const response = await axios.get(`http://user_service:3000/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    // Handle specific errors (e.g., user not found, service unavailable) as needed
    return null;
  }
}

module.exports = {
  userExists,userDetails
};
