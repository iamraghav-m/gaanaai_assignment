import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, Chip, Grid } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface ProfileHeaderProps {
  name: string;
  location: string;
  description: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, location, description }) => {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ mr: 4, mb: { xs: 3, md: 0 } }}>
        <Avatar
          src="/lovable-uploads/e484d3a0-4214-49bc-9a23-70cee1d60ee5.png"
          sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
        />
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, 
                  flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">{name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">{location}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}>
              Edit Profile
            </Button>
            <Button variant="outlined" sx={{ borderRadius: 2 }}>
              Public View
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 1 }}>
          {showMore ? description : `${description.substring(0, 100)}...`}
          <Button 
            onClick={() => setShowMore(!showMore)} 
            sx={{ textTransform: 'uppercase', fontWeight: 'bold', p: 0, ml: 1, minWidth: 'auto' }}
          >
            {showMore ? 'Less' : 'More'}
          </Button>
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}>
                <Typography variant="subtitle2" color="text.secondary">🕒</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">3+ Years Job</Typography>
                <Typography variant="body2" fontWeight="medium">Experienced</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}>
                <Typography variant="subtitle2" color="text.secondary">🏆</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">5 Certificates</Typography>
                <Typography variant="body2" fontWeight="medium">Achieved</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}>
                <Typography variant="subtitle2" color="text.secondary">📋</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">2 Internship</Typography>
                <Typography variant="body2" fontWeight="medium">Completed</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfileHeader;