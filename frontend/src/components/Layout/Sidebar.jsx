/**
 * 사이드바 네비게이션
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Divider, Box, Typography,
} from '@mui/material';
import {
  Dashboard, Business, People, Description,
  Build, AttachMoney, Announcement,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: '대시보드', icon: <Dashboard />, path: '/dashboard' },
  { label: '건물관리', icon: <Business />, path: '/buildings' },
  { label: '입주자관리', icon: <People />, path: '/tenants' },
  { label: '계약관리', icon: <Description />, path: '/contracts' },
  { label: '유지보수', icon: <Build />, path: '/maintenance' },
  { label: '비용관리', icon: <AttachMoney />, path: '/expenses' },
  { label: '공지사항', icon: <Announcement />, path: '/notices' },
];

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar />
      <Divider />
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => { navigate(item.path); if (onClose) onClose(); }}
              selected={isActive(item.path)}
              sx={{
                mx: 1, borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">SmartFM v1.0.0</Typography>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer variant="temporary" open={open} onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer variant="permanent" open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          transform: open ? 'none' : `translateX(-${DRAWER_WIDTH}px)`,
          transition: 'transform 0.3s ease',
        },
      }}>
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
