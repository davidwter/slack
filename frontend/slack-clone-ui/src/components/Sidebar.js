import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { fetchWorkspaces,fetchChannels } from '../api';

const Sidebar = () => {
  // State to store workspaces
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    // Define an async function to fetch workspaces
    const getWorkspaces = async () => {
      try {
        // Make the API call and await the response
        const response = await fetchWorkspaces();
        const workspacesData = response.data.workspaces;
        // Once the data is retrieved, update the state
        const workspacesWithChannels = [];

        for (const workspace of workspacesData) {
          try {
            // Fetch channels for each workspace
            const channelsResponse = await fetchChannels(workspace._id);
            workspace.channels = channelsResponse.data.channels; // Assuming the response directly contains the array of channels
          } catch (error) {
            console.error(`Failed to fetch channels for workspace ${workspace._id}:`, error);
            workspace.channels = []; // Default to an empty array if there's an error
          }
          workspacesWithChannels.push(workspace);
        }
        console.log('Workspaces with channels:', workspacesWithChannels);
        setWorkspaces(workspacesWithChannels); 
        // Assuming the response has a data property
      } catch (error) {
        // Handle any errors here
        console.error('Failed to fetch workspaces:', error);
      }
    };

    // Call the async function
    getWorkspaces();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
      <Toolbar /> {/* Offset for AppBar */}
      <List>
        {Array.isArray(workspaces) && workspaces.map((workspace) => (
          <React.Fragment key={workspace._id}>
            <ListItem button>
              <ListItemText primary={workspace.name} />
            </ListItem>
            {/* Assuming workspace.channels is an array of channel names */}
            {Array.isArray(workspace.channels) && workspace.channels.map((channel) => (
              <ListItem button key={channel._id} sx={{ pl: 4 }}>
                <ListItemText primary={channel.name} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
