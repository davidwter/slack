// src/contexts/SelectedChannelContext.js
import React, { createContext, useContext, useState } from 'react';

const SelectedChannelContext = createContext();

export const useSelectedChannel = () => useContext(SelectedChannelContext);

export const SelectedChannelProvider = ({ children }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <SelectedChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
      {children}
    </SelectedChannelContext.Provider>
  );
};
