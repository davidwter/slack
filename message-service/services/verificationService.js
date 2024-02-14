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

  module.exports = {
    verifyChannelExists,
    verifyUserIsMemberOfChannel
  };
  