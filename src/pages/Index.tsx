import { Box, Grid, Container } from '@mui/material';
import Header from '@/components/DashBoard/Header';
import Sidebar from '@/components/DashBoard/SideBar';
import ProfileHeader from '@/components/DashBoard/ProfileHeader';
import ProfileTabs from '@/components/DashBoard/ProfileTabs';
import JobExperience from '@/components/DashBoard/JobExperience';
import UpgradeSection from '@/components/DashBoard/UpgradeSection';

const Index = () => {
  const profileDescription = "I am a consultant for a small hotel business. I currently working them through a rebrand, and they are in need of a new company logo.";

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 2, flexWrap: 'nowrap !important' }}>
          <Grid container spacing={3} sx={{ flexWrap: 'nowrap !important' }}>
            <Grid xs={12} md={8}>
              <Box sx={{  mb: 3 }}>
                <ProfileHeader 
                  name="Cristiana Justin"
                  location="New York, USA"
                  description={profileDescription}
                />
                
                <ProfileTabs 
                  labels={["Experience", "Biography", "Skills", "Portfolio"]}
                >
                  <JobExperience />
                  <Box>Biography content here</Box>
                  <Box>Skills content here</Box>
                  <Box>Portfolio content here</Box>
                </ProfileTabs>
              </Box>
            </Grid>
            
            <Grid xs={12} md={4}>
              <UpgradeSection />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;