import React from 'react';
import { Box, IconButton, InputBase, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import { Search, Notifications, MoreVert } from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      p: 1,
      borderBottom: '1px solid #f0f0f0',
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%', 
        maxWidth: 600,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        p: '2px 8px',
        ml: 2,
        background: '#fff',
      }}>
        <Search sx={{ color: '#fff', mr: 1 }} />
        <InputBase
          placeholder="Search Anything"
          sx={{ flex: 1 }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton>
          <Notifications />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mr: 2 }}>
          <Avatar alt="Justin Mark" src="/lovable-uploads/e484d3a0-4214-49bc-9a23-70cee1d60ee5.png" />
          <Typography sx={{ ml: 1, fontWeight: 'medium' }}>Justin Mark</Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;