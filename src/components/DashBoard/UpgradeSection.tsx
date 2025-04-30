import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const benefits = [
  "Unlimited Job Post",
  "Multiple job communication.",
  "Unlimited calling access from different city.",
  "Hire 10+ freelancers for one project.",
  "Filter, block, search talent freelancers."
];

const UpgradeSection = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box 
          component="img" 
          src="https://cdn-icons-png.flaticon.com/512/4391/4391482.png"
          alt="Trophy"
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
        />
        
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Upgrade to <span style={{ color: '#1976d2' }}>Pro</span>
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          I am a consultant for a small hotel business. I am currently with them through a rebrand, and they are in need of a new company logo.
        </Typography>
        
        <List sx={{ mb: 2 }}>
          {benefits.map((benefit, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: '1.2rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary={benefit} 
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }} 
              />
            </ListItem>
          ))}
        </List>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ 
            borderRadius: 6, 
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Upgrade Plan
        </Button>
      </Box>
    </Box>
  );
};

export default UpgradeSection;