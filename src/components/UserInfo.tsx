import React from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Firebase Auth App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user.displayName}
          </Typography>
          <Button color="inherit" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default UserInfo;