import { List, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useGetList } from 'react-admin';

export const Analytics = () => {
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
    <List title="Analytics">
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Platform Analytics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Total Users
                </Typography>
                <Typography variant="h3">
                  {usersTotal || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Total Jobs
                </Typography>
                <Typography variant="h3">
                  {jobsTotal || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  Total Applications
                </Typography>
                <Typography variant="h3">
                  {applicationsTotal || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="info.main">
                  Success Rate
                </Typography>
                <Typography variant="h3">
                  0%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </List>
  );
};
