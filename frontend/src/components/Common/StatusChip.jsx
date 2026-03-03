/**
 * 상태 표시 칩 컴포넌트
 */
import React from 'react';
import { Chip } from '@mui/material';

const STATUS_CONFIG = {
  // 공통
  active:      { label: '활성', color: 'success' },
  inactive:    { label: '비활성', color: 'default' },
  // 계약
  expired:     { label: '만료', color: 'warning' },
  terminated:  { label: '해지', color: 'error' },
  // 유지보수
  '접수':      { label: '접수', color: 'info' },
  '진행중':    { label: '진행중', color: 'warning' },
  '완료':      { label: '완료', color: 'success' },
  '취소':      { label: '취소', color: 'error' },
  // 우선순위
  '긴급':      { label: '긴급', color: 'error' },
  '보통':      { label: '보통', color: 'warning' },
  '낮음':      { label: '낮음', color: 'default' },
  // 공지
  '일반':      { label: '일반', color: 'default' },
  '공사':      { label: '공사', color: 'warning' },
};

const StatusChip = ({ status, size = 'small' }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
  return <Chip label={config.label} color={config.color} size={size} />;
};

export default StatusChip;
