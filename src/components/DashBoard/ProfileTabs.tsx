import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

interface ProfileTabsProps {
  children: React.ReactNode[];
  labels: string[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ children, labels }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="profile tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
            }
          }}
        >
          {labels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>
      {children.map((child, index) => (
        <TabPanel key={index} value={value} index={index}>
          {child}
        </TabPanel>
      ))}
    </Box>
  );
};

export default ProfileTabs;