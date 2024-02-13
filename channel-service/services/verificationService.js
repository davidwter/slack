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

  module.exports = {
    verifyWorkspaceExists,
    verifyUserIsMemberOfWorkspace
  };
  