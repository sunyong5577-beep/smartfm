/**
 * 유지보수 목록 페이지
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, Select, MenuItem,
  FormControl, InputLabel, Stack, IconButton, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import StatusChip from '../../components/Common/StatusChip';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { getMaintenanceList, deleteMaintenance } from '../../services/maintenanceService';

const MaintenanceList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery(
    ['maintenance', page, rowsPerPage, statusFilter, categoryFilter, priorityFilter],
    () => getMaintenanceList({ page: page + 1, limit: rowsPerPage, status: statusFilter, category: categoryFilter, priority: priorityFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation((id) => deleteMaintenance(id), {
    onSuccess: () => { queryClient.invalidateQueries('maintenance'); setDeleteId(null); },
  });

  const columns = [
    { id: 'title', label: '제목', minWidth: 160 },
    { id: 'building', label: '건물', minWidth: 120, render: (_, row) => row.building?.name || '-' },
    { id: 'category', label: '카테고리', minWidth: 80 },
    { id: 'requestDate', label: '요청일', minWidth: 100 },
    { id: 'priority', label: '우선순위', minWidth: 80, render: (v) => <StatusChip status={v} /> },
    { id: 'status', label: '상태', minWidth: 80, render: (v) => <StatusChip status={v} /> },
    { id: 'cost', label: '비용', minWidth: 100, render: (v) => v ? `₩${Number(v).toLocaleString()}` : '-' },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/maintenance/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>유지보수 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/maintenance/new')}>요청 등록</Button>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>카테고리</InputLabel>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="카테고리">
            <MenuItem value="">전체</MenuItem>
            {['전기','수도','소방','엘리베이터','냉난방','기타'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>상태</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="상태">
            <MenuItem value="">전체</MenuItem>
            {['접수','진행중','완료','취소'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>우선순위</InputLabel>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} label="우선순위">
            <MenuItem value="">전체</MenuItem>
            {['긴급','보통','낮음'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <DataTable columns={columns} rows={data?.data || []} loading={isLoading}
        total={data?.pagination?.total || 0} page={page} rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
      <ConfirmDialog open={!!deleteId} message="이 유지보수 항목을 삭제하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
};

export default MaintenanceList;
