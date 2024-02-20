const axios = require('axios');



async function verifyChannelExists(channelId,token) {
    try {
      const response = await axios.get(`http://channel_service:3000/channels/${channelId}`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );

      return response.status === 200;
    } catch (error) {
       
      if (error.response && error.response.status === 404) {
        return false; // Channel does not exist
      }
      throw error; // Re-throw error for any other issue
    }
  }
  
  async function verifyUserIsMemberOfChannel(userId, channelId,token) {
    try {
      const response = await axios.get(`http://channel_service:3000/channels/${channelId}/members/${userId}`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
        );
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false; // User is not a member of the channel
      }
      throw error; // Re-throw error for any other issue
    }
  }

  async function userDetails(userId) {
    try {
      // Adjust the URL based on your User Service's actual endpoint for fetching user details
      const response = await axios.get(`http://user_service:3000/users/${userId}`);
      console.log("User details : "+response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle specific errors (e.g., user not found, service unavailable) as needed
      return null;
    }
  }

  module.exports = {
    verifyChannelExists,
    verifyUserIsMemberOfChannel,
    userDetails
  };
  