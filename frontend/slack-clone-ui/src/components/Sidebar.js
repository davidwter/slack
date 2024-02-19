import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';

const Sidebar = () => {
  // Placeholder data for workspaces and channels
  const workspaces = [
    { id: 1, name: 'Workspace 1', channels: ['Channel 1', 'Channel 2'] },
    // Add more workspaces as needed
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
      <Toolbar /> {/* Offset for AppBar */}
      <List>
        {workspaces.map((workspace) => (
          <React.Fragment key={workspace.id}>
            <ListItem button>
              <ListItemText primary={workspace.name} />
            </ListItem>
            {workspace.channels.map((channel, index) => (
              <ListItem button key={index} sx={{ pl: 4 }}>
                <ListItemText primary={channel} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
