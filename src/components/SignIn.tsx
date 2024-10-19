import React, { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { connectAuthEmulator } from 'firebase/auth';

// Check if running in emulator
export const isEmulator = window.location.hostname === '127.0.0.1';

const SignIn: React.FC = () => {
  useEffect(() => {
    // Connect to auth emulator if running locally
    if (isEmulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('Connected to Firebase Auth Emulator');

      // Predefine user credentials for emulator
      const mockIdToken = JSON.stringify({
        sub: '1234567890', // Unique user identifier
        email: 'testuser@example.com',
        email_verified: true,
        name: 'Test User',
        picture: 'https://www.example.com/testuser/profile.jpg',
        aud: 'your-app-id', // Your Firebase app's project ID
        iss: 'https://securetoken.google.com/your-app-id',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      });

      const mockCredential = GoogleAuthProvider.credential(mockIdToken);

      // Sign in with predefined credential
      signInWithCredential(auth, mockCredential)
        .then((result) => {
          console.log('Signed in with mock credentials:', result.user);
        })
        .catch((error) => {
          console.error('Error during emulator sign-in:', error);
        });
    }
  }, []);

  const signInWithGoogle = () => {
    if (!isEmulator) {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
    >
      {isEmulator ? 'Signed in (Emulator)' : 'Sign in with Google'}
    </Button>
  );
};

export default SignIn;
