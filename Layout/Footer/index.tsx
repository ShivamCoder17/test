import React from 'react';
import { Box, Typography, Container} from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: (theme) => theme.palette.grey[900],
        color: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Box mt={5} textAlign="center">
          <Typography  variant="h5" color="inherit">
            © 2024 Shivam Gupta. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;

