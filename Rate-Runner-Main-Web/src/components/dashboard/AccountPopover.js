import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import CogIcon from '../../icons/Cog';
import UserIcon from '../../icons/User';

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
  } else {
    tempuser = 'Sales';
  }
  return tempuser;
};

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const { logout } = useAuth();
  const navigate = useNavigate();
  const usertype = showusertype(user.user_role);
  const userfullname = user.user_fullname;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 40,
            width: 40
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {userfullname}
          </Typography>
          <Typography
            color="textSecondary"
            variant="subtitle2"
          >
            {usertype}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <MenuItem
            component={RouterLink}
            to="/setup-data/profile"
          >
            <ListItemIcon>
              <UserIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/setup-data/reset"
          >
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  Reset Password
                </Typography>
              )}
            />
          </MenuItem>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogout}
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default AccountPopover;
