/**
 * 상단 네비게이션 바
 */
import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Avatar,
  Menu, MenuItem, Tooltip, Divider,
} from '@mui/material';
import { Menu as MenuIcon, Business, AccountCircle, Logout } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const roleLabel = { admin: '관리자', manager: '매니저', viewer: '조회자' };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'primary.main' }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Business sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          SmartFM 빌딩관리시스템
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="계정 메뉴">
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.9rem' }}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>{user?.username}</Typography>
              <Typography variant="caption" color="text.secondary">{roleLabel[user?.role]}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleClose(); logout(); }}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
