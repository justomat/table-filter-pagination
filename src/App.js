import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box fontSize="xl"></Box>
    </ChakraProvider>
  );
}

export default App;
