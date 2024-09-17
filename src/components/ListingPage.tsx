import React, {useState} from 'react';
import {Box, Button, TextField, Typography, Paper} from '@mui/material';
import {getFunctions, httpsCallable} from 'firebase/functions';


interface ExtractListingResponse {
  status: 'OK' | 'FAILED';
  listing_id: string | null;
}

const ExtractListingPage = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFunctionCall = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const functions = getFunctions();
    const extractListingId = httpsCallable<{ url: string }, ExtractListingResponse>(functions, 'extract_listing_id_function');

    try {
      const response = await extractListingId({ url });
      const data = response.data as ExtractListingResponse;  // Type assertion

      if (data.status === 'OK') {
        setResult(data.listing_id);
      } else {
        setError('Failed to extract listing ID.');
      }
    } catch (err) {
      setError('Error calling function. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Paper elevation={3} sx={{p: 3, width: '100%', maxWidth: 500}}>
        <TextField
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Airbnb URL"
          variant="outlined"
          margin="normal"
        />
        <Button
          onClick={handleFunctionCall}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading || !url}
        >
          {isLoading ? 'Extracting...' : 'Submit'}
        </Button>

        {error && <Typography color="error" sx={{mt: 2}}>{error}</Typography>}
        {result && <Typography color="green" sx={{mt: 2}}>Listing ID: {result}</Typography>}
      </Paper>
    </Box>
  );
};

export default ExtractListingPage;
