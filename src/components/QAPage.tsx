import React, {useState} from 'react';
import {Box, Button, TextField, Typography, Paper} from '@mui/material';
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions';
import {isEmulator} from "./SignIn";


interface ExtractListingResponse {
  status: 'OK' | 'FAILED';
  response: string | null;
}

const QAPage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFunctionCall = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // const functions = getFunctions();
    const functions = getFunctions(undefined, 'us-central1');
    const answerLegalQuestionFunc = httpsCallable<{ query: string }, ExtractListingResponse>(functions, 'answer_legal_question');
    if (isEmulator) {
      connectFunctionsEmulator(functions, '127.0.0.1', 5001);  // Use the appropriate port number for your emulator
    }

    try {
      const response = await answerLegalQuestionFunc({ query });
      const data = response.data as ExtractListingResponse;  // Type assertion

      if (data.status === 'OK') {
        setResult(data.response);
      } else {
        setError(`Failed to answer query. Error: ${data.response}`);
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question"
          variant="outlined"
          margin="normal"
        />
        <Button
          onClick={handleFunctionCall}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading || !query}
        >
          {isLoading ? 'Extracting...' : 'Submit'}
        </Button>

        {error && <Typography color="error" sx={{mt: 2}}>{error}</Typography>}
        {result && <Typography color="green" sx={{mt: 2}}>Response: {result}</Typography>}
      </Paper>
    </Box>
  );
};

export default QAPage;
