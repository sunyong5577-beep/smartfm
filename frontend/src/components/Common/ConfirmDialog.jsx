/**
 * 삭제 확인 다이얼로그
 */
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const ConfirmDialog = ({ open, title = '삭제 확인', message = '정말 삭제하시겠습니까?', onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Warning color="error" />
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} variant="outlined">취소</Button>
      <Button onClick={onConfirm} variant="contained" color="error">삭제</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
