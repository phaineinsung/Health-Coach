//버튼 스타일링
import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        borderColor: '#fff',
        color: '#fff',
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#fff',
          color: 'gold',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
