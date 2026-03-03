/**
 * 로딩 스피너 컴포넌트
 */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = '로딩 중...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 2 }}>
    <CircularProgress />
    <Typography color="text.secondary" variant="body2">{message}</Typography>
  </Box>
);

export default LoadingSpinner;
