/**
 * 공지사항 목록 페이지
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, Select, MenuItem,
  FormControl, InputLabel, Stack, IconButton, Tooltip, Chip,
} from '@mui/material';
import { Add, Edit, Delete, PushPin } from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { getNotices, deleteNotice } from '../../services/noticeService';
import dayjs from 'dayjs';

const NoticeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery(
    ['notices', page, rowsPerPage, typeFilter],
    () => getNotices({ page: page + 1, limit: rowsPerPage, noticeType: typeFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation((id) => deleteNotice(id), {
    onSuccess: () => { queryClient.invalidateQueries('notices'); setDeleteId(null); },
  });

  const columns = [
    {
      id: 'title', label: '제목', minWidth: 200,
      render: (v, row) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {row.isImportant && <PushPin fontSize="small" color="error" />}
          <span>{v}</span>
        </Stack>
      ),
    },
    { id: 'building', label: '대상 건물', minWidth: 120, render: (_, row) => row.building?.name || '전체' },
    { id: 'noticeType', label: '유형', minWidth: 70,
      render: (v) => <Chip label={v} size="small"
        color={v === '긴급' ? 'error' : v === '공사' ? 'warning' : 'default'} /> },
    { id: 'createdAt', label: '등록일', minWidth: 100, render: (v) => dayjs(v).format('YYYY-MM-DD') },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/notices/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>공지사항 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/notices/new')}>공지 등록</Button>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>유형</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="유형">
            <MenuItem value="">전체</MenuItem>
            {['일반','긴급','공사'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <DataTable columns={columns} rows={data?.data || []} loading={isLoading}
        total={data?.pagination?.total || 0} page={page} rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
      <ConfirmDialog open={!!deleteId} message="이 공지사항을 삭제하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
};

export default NoticeList;
