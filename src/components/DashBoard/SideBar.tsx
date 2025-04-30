import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Badge } from '@mui/material';
import { Mail, Bookmark, Description, Person, PriceChange, Assessment } from '@mui/icons-material';

const navItems = [
  { text: 'My Job Feed', icon: <Description />, path: '/' },
  { text: 'Discover Jobs', icon: <Assessment />, path: '/discover' },
  { text: 'Saved Jobs', icon: <Bookmark />, badge: '26+', path: '/saved' },
  { text: 'Proposal', icon: <Mail />, path: '/proposal' },
  { text: 'All contracts', icon: <Description />, badge: '4+', path: '/contracts' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
  { text: 'Transaction', icon: <PriceChange />, path: '/transaction' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const Sidebar = () => {
  return (
    <Box sx={{ 
      width: 230, 
      p: 2, 
      borderRight: '1px solid #f0f0f0', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box sx={{ 
          width: 30, 
          height: 30, 
          borderRadius: '50%', 
          background: 'linear-gradient(to right, #e83e8c, #6f42c1)', 
          mr: 1 
        }} />
        <Typography variant="h6" fontWeight="bold">Jobong</Typography>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            sx={{ 
              borderRadius: 1, 
              mb: 1, 
              ':hover': { 
                backgroundColor: '#f5f5f5',
              },
              ...(item.text === 'Profile' && {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold'
              })
            }}
            button
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.badge && (
              <Badge 
                badgeContent={item.badge} 
                color="primary" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    borderRadius: '10px', 
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;