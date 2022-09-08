import { Box, Spinner, HStack, Heading } from 'native-base';
import React from 'react';

export default function StartupScreen() {
  return (
    <Box>
      <HStack space={2} justifyContent="center" alignItems="center">
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color="primary.500" fontSize="md">
          Loading
        </Heading>
      </HStack>
    </Box>
  );
}
