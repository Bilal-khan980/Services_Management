import {
  SwapHoriz as ChangeIcon,
  Book as KnowledgeIcon,
  Engineering as SolutionIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { hasPermission } from '../utils/permissions';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');

  // Check for access denied message from navigation state
  useEffect(() => {
    if (location.state?.accessDenied) {
      setAccessDeniedMessage(location.state.message || 'Access denied');
      setAccessDeniedOpen(true);

      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Log user information for debugging
  useEffect(() => {
    console.log('Dashboard component - Current user:', user);
  }, [user]);

  const [stats, setStats] = useState({
    tickets: {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
    },
    changes: {
      total: 0,
      pending: 0,
      approved: 0,
      implemented: 0,
    },
    knowledge: {
      total: 0,
    },
    solutions: {
      total: 0,
    },
  });

  // Function to test direct database counts
  const testDirectCounts = async () => {
    try {
      console.log('Testing direct database counts...');
      const res = await api.get('/dashboard/test-counts');
      console.log('Direct count test response:', res.data);
    } catch (error) {
      console.error('Error testing direct counts:', error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard stats...');

        // First test direct counts to see if there's a database issue
        await testDirectCounts();

        // Then fetch the regular stats
        const res = await api.get('/dashboard/stats');
        console.log('Dashboard stats response:', res.data);

        if (res.data.success) {
          setStats(res.data.data);
          console.log('Stats set to:', res.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Function to manually refresh stats
  const refreshStats = async () => {
    try {
      setLoading(true);
      console.log('Manually refreshing stats...');

      // Test direct counts first
      await testDirectCounts();

      // Then fetch regular stats
      const res = await api.get('/dashboard/stats');
      console.log('Refreshed stats response:', res.data);

      if (res.data.success) {
        setStats(res.data.data);
        console.log('Stats refreshed to:', res.data.data);
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={refreshStats}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Refresh Stats
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Tickets Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <TicketIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Tickets</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {stats.tickets.total}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  New: {stats.tickets.new}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress: {stats.tickets.inProgress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved: {stats.tickets.resolved}
                </Typography>
              </Box>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                component={RouterLink}
                to="/dashboard/tickets"
                variant="outlined"
                size="small"
                fullWidth
              >
                View All
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Changes Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <ChangeIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Changes</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {stats.changes.total}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Pending: {stats.changes.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved: {stats.changes.approved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Implemented: {stats.changes.implemented}
                </Typography>
              </Box>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                component={RouterLink}
                to="/dashboard/changes"
                variant="outlined"
                size="small"
                fullWidth
              >
                View All
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Knowledge Base Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <KnowledgeIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Knowledge</Typography>
              </Box>
              <Typography variant="h3" component="div">
                {stats.knowledge.total}
              </Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total articles in knowledge base
                </Typography>
              </Box>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                component={RouterLink}
                to="/dashboard/knowledge"
                variant="outlined"
                size="small"
                fullWidth
              >
                View All
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Solutions Card - Only show to users with view_solutions permission */}
        {/* {hasPermission(user, 'view_solutions') && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        )} */}

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Only show Create Ticket button if user has create_tickets permission */}
              {hasPermission(user, 'create_tickets') && (
                <Grid item xs={12} sm={6}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/tickets/create"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<TicketIcon />}
                  >
                    Create Ticket
                  </Button>
                </Grid>
              )}

              {/* Only show Submit Change button if user has create_changes permission */}
              {hasPermission(user, 'create_changes') && (
                <Grid item xs={12} sm={6}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/changes/create"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<ChangeIcon />}
                  >
                    Submit Change
                  </Button>
                </Grid>
              )}

              {/* Only show Create Article button if user has create_knowledge permission */}
              {hasPermission(user, 'create_knowledge') && (
                <Grid item xs={12} sm={6}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/knowledge/create"
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={<KnowledgeIcon />}
                  >
                    Create Article
                  </Button>
                </Grid>
              )}

              {/* Only show Create Solution button if user has create_solutions permission */}
              {hasPermission(user, 'create_solutions') && (
                <Grid item xs={12} sm={6}>
                  <Button
                    component={RouterLink}
                    to="/dashboard/solutions/create"
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<SolutionIcon />}
                  >
                    Create Solution
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {stats.recentActivity.map((activity) => {
                  // Determine icon and color based on activity type
                  let Icon = TicketIcon;
                  let color = 'primary';
                  let path = '/dashboard/tickets';

                  if (activity.type === 'change') {
                    Icon = ChangeIcon;
                    color = 'secondary';
                    path = '/dashboard/changes';
                  } else if (activity.type === 'knowledge') {
                    Icon = KnowledgeIcon;
                    color = 'info';
                    path = '/dashboard/knowledge';
                  } else if (activity.type === 'solution') {
                    Icon = SolutionIcon;
                    color = 'success';
                    path = '/dashboard/solutions';
                  }

                  // Format date
                  const formattedDate = new Date(activity.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <Box
                      key={`${activity.type}-${activity.id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      component={RouterLink}
                      to={`${path}/${activity.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: `${color}.lighter`,
                          color: `${color}.main`
                        }}
                      >
                        <Icon />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 'medium' }}>
                          {activity.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.status}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formattedDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      )}
      {/* Access Denied Snackbar */}
      <Snackbar
        open={accessDeniedOpen}
        autoHideDuration={6000}
        onClose={() => setAccessDeniedOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAccessDeniedOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {accessDeniedMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
