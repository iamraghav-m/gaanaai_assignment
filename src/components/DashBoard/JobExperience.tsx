import { Box, Typography, Button, Grid } from '@mui/material';
import { Add, LocationOn, AccessTime } from '@mui/icons-material';

interface JobPosition {
  id: number;
  title: string;
  company: string;
  logo: string;
  period: string;
  location: string;
  description: string;
  mediaFiles?: { id: number; url: string }[];
}

const jobPositions: JobPosition[] = [
  {
    id: 1,
    title: 'Graphic Designer',
    company: 'Dribbble Inc',
    logo: '/public/lovable-uploads/e484d3a0-4214-49bc-9a23-70cee1d60ee5.png',
    period: 'Feb 2016 - Dec 2017',
    location: 'New York, USA',
    description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure.',
    mediaFiles: [
      { id: 1, url: 'https://source.unsplash.com/random/300x200?design,team' },
      { id: 2, url: 'https://source.unsplash.com/random/300x200?photography' },
    ]
  },
  {
    id: 2,
    title: 'Lead Designer',
    company: 'Sketch App',
    logo: '/public/lovable-uploads/e484d3a0-4214-49bc-9a23-70cee1d60ee5.png',
    period: 'Apr 2010 - Sept 2011',
    location: 'Kathmandu, Nepal',
    description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor.'
  }
];

const JobExperience = () => {
  return (
    <Box sx={{ p: 2, backgroundColor: "#fff" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">Job Experience</Typography>
          <Typography variant="body2" color="text.secondary">3 Job history</Typography>
        </Box>
        <Button variant="outlined" startIcon={<Add />} sx={{ borderRadius: 12 }}>
          Add More
        </Button>
      </Box>
      
      {jobPositions.map((job) => (
        <Box 
          key={job.id} 
          sx={{ 
            mb: 4, 
            pb: 4,
            borderBottom: job.id !== jobPositions.length ? '1px solid #f0f0f0' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: job.id === 1 ? '#f06292' : '#ffa726',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {job.title[0]}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="medium">{job.title}</Typography>
              <Typography variant="body2" color="text.secondary">{job.company}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, ml: 9, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">{job.period}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">{job.location}</Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ ml: 9 }}>{job.description}</Typography>
          
          {job.mediaFiles && (
            <Box sx={{ mt: 2, ml: 9 }}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Media Files ({job.mediaFiles.length})
              </Typography>
              <Grid container spacing={2}>
                {job.mediaFiles.map((file) => (
                  <Grid item key={file.id} xs={6} sm={3}>
                    <Box 
                      component="img"
                      src={file.url}
                      alt={`Media ${file.id}`}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default JobExperience;