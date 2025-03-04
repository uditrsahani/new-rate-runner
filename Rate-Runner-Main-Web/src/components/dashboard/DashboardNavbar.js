import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar, IconButton, Typography } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import AccountPopover from './AccountPopover';
import CalendarIcon from '../../icons/Calendar';
import MenuIcon from '../../icons/Menu';
import { format } from 'date-fns';

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }),
  zIndex: theme.zIndex.drawer + 100
}));

const showusertype = (type) => {
  let tempuser;
  if (type === 'salesManager') {
    tempuser = 'Sales Manager';
  } else if (type === 'marketing') {
    tempuser = 'Marketing officer';
  } else if (type === 'marketingManager') {
    tempuser = 'Marketing manager';
  } else if (type === 'management') {
    tempuser = 'Management';
  } else if (type === 'seniorManager') {
    tempuser = 'Senior Manager';
  } else if (type === 'systemAdmin') {
    tempuser = 'System Admin';
  } else if (type === 'dataAdmin') {
    tempuser = 'Data Admin';
  } else {
    tempuser = 'Sales';
  }
  return tempuser;
};

const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;
  const user = JSON.parse(window.localStorage.getItem('user'));
  const usertype = showusertype(user.user_role);
  const userfullname = user.user_fullname;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none'
            }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <RouterLink to="/">
          <Box
            sx={{
              '& img': {
                display: {
                  lg: 'inline',
                  xs: 'none'
                },
                height: 40,
                width: 40
              }
            }}
          >
            <img
              alt="Rate Runner"
              src="/static/rate_runner_logo.png"
            />
          </Box>
        </RouterLink>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h5">
            RATE RUNNER
          </Typography>
        </Box>
        <Box sx={{ ml: 5 }}>
          <CalendarIcon fontSize="small" />
        </Box>
        <Box sx={{ ml: 1 }}>
          <Typography variant="body1">
            {format(new Date(), 'd MMM yyyy')}
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2
          }}
        />
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1">
            {userfullname}
            <br />
            {usertype}
          </Typography>
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};

export default DashboardNavbar;
