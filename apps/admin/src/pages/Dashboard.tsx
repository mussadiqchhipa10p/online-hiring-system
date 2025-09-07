import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid, Box } from '@mui/material';
import { useGetList } from 'react-admin';

export const Dashboard = () => {
  const { total: usersTotal } = useGetList('users', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { total: jobsTotal } = useGetList('jobs', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { total: applicationsTotal } = useGetList('applications', {
    pagination: { page: 1, perPage: 1 },
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Total Users" />
            <CardContent>
              <Typography variant="h3" color="primary">
                {usersTotal || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Total Jobs" />
            <CardContent>
              <Typography variant="h3" color="secondary">
                {jobsTotal || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Total Applications" />
            <CardContent>
              <Typography variant="h3" color="success.main">
                {applicationsTotal || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader title="Active Employers" />
            <CardContent>
              <Typography variant="h3" color="info.main">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
