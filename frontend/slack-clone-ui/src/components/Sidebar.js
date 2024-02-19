import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Toolbar} from '@mui/material';

const workspaces = [
  // Placeholder data
  { id: 1, name: 'Workspace 1', channels: ['Channel 1', 'Channel 2'] },
  // Add more workspaces
];

const Sidebar = () => {
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}>
      <Toolbar /> {/* Offset for the app bar */}
      <List>
        {workspaces.map((workspace) => (
          <React.Fragment key={workspace.id}>
            <ListItem>
              <ListItemText primary={workspace.name} />
            </ListItem>
            {workspace.channels.map((channel, index) => (
              <ListItem button key={index}>
                <ListItemText primary={channel} inset />
              </ListItem>
            ))}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
