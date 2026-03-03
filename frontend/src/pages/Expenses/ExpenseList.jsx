/**
 * 비용 목록 페이지
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, Select, MenuItem,
  FormControl, InputLabel, Stack, IconButton, Tooltip, TextField,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { getExpenses, deleteExpense } from '../../services/expenseService';

const ExpenseList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery(
    ['expenses', page, rowsPerPage, categoryFilter, year, month],
    () => getExpenses({ page: page + 1, limit: rowsPerPage, category: categoryFilter, year, month }).then(r => r.data),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation((id) => deleteExpense(id), {
    onSuccess: () => { queryClient.invalidateQueries('expenses'); setDeleteId(null); },
  });

  const columns = [
    { id: 'expenseDate', label: '지출일', minWidth: 100 },
    { id: 'building', label: '건물', minWidth: 120, render: (_, row) => row.building?.name || '-' },
    { id: 'category', label: '카테고리', minWidth: 90 },
    { id: 'description', label: '내용', minWidth: 160 },
    { id: 'amount', label: '금액', minWidth: 110, align: 'right', render: (v) => `₩${Number(v).toLocaleString()}` },
    { id: 'paymentMethod', label: '결제방법', minWidth: 90 },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/expenses/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>비용 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/expenses/new')}>비용 등록</Button>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" label="연도" type="number" value={year} onChange={(e) => setYear(e.target.value)} sx={{ width: 100 }} />
        <FormControl size="small" sx={{ minWidth: 90 }}>
          <InputLabel>월</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} label="월">
            <MenuItem value="">전체</MenuItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <MenuItem key={m} value={m}>{m}월</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>카테고리</InputLabel>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="카테고리">
            <MenuItem value="">전체</MenuItem>
            {['관리비','수도','전기','가스','인건비','수선비','기타'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
      <DataTable columns={columns} rows={data?.data || []} loading={isLoading}
        total={data?.pagination?.total || 0} page={page} rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
      <ConfirmDialog open={!!deleteId} message="이 비용 항목을 삭제하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
};

export default ExpenseList;
