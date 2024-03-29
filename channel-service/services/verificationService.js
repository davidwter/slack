const axios = require('axios');



async function verifyWorkspaceExists(workspaceId,token) {
    try {
      const response = await axios.get(`http://workspace_service:3000/workspaces/${workspaceId}`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );

      return response.status === 200;
    } catch (error) {
       
      if (error.response && error.response.status === 404) {
        return false; // Workspace does not exist
      }
      throw error; // Re-throw error for any other issue
    }
  }
  
  async function verifyUserIsMemberOfWorkspace(userId, workspaceId,token) {
    try {
      const response = await axios.get(`http://workspace_service:3000/workspaces/${workspaceId}/members/${userId}`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
        );
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false; // User is not a member of the workspace
      }
      throw error; // Re-throw error for any other issue
    }
  }

  async function userDetails(userId) {
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
    verifyWorkspaceExists,
    verifyUserIsMemberOfWorkspace,
    userDetails
  };
  