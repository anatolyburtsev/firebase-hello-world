import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import SignIn from './components/SignIn';
import UserInfo from './components/UserInfo';
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ListingPage from "./components/ListingPage";

const theme = createTheme();

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {user ? (
            <>
              <UserInfo user={user} />
              <ListingPage />
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <SignIn />
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;