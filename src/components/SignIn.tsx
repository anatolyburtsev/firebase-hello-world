import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const SignIn: React.FC = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </Button>
  );
}

export default SignIn;