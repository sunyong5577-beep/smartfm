/**
 * 계약 목록 페이지
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
import { getContracts, deleteContract } from '../../services/contractService';

const ContractList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery(
    ['contracts', page, rowsPerPage, statusFilter, typeFilter],
    () => getContracts({ page: page + 1, limit: rowsPerPage, status: statusFilter, contractType: typeFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation((id) => deleteContract(id), {
    onSuccess: () => { queryClient.invalidateQueries('contracts'); setDeleteId(null); },
  });

  const columns = [
    { id: 'tenant', label: '입주자', minWidth: 120, render: (_, row) => row.tenant?.name || '-' },
    { id: 'building', label: '건물', minWidth: 120, render: (_, row) => row.building?.name || '-' },
    { id: 'contractType', label: '계약유형', minWidth: 80 },
    { id: 'startDate', label: '시작일', minWidth: 100 },
    { id: 'endDate', label: '종료일', minWidth: 100 },
    { id: 'monthlyRent', label: '월세', minWidth: 100, render: (v) => v ? `₩${Number(v).toLocaleString()}` : '-' },
    { id: 'depositAmount', label: '보증금', minWidth: 100, render: (v) => v ? `₩${Number(v).toLocaleString()}` : '-' },
    { id: 'status', label: '상태', minWidth: 80, render: (v) => <StatusChip status={v} /> },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/contracts/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>계약 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/contracts/new')}>계약 등록</Button>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>계약유형</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="계약유형">
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="임대">임대</MenuItem>
            <MenuItem value="전세">전세</MenuItem>
            <MenuItem value="월세">월세</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>상태</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="상태">
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="active">활성</MenuItem>
            <MenuItem value="expired">만료</MenuItem>
            <MenuItem value="terminated">해지</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <DataTable columns={columns} rows={data?.data || []} loading={isLoading}
        total={data?.pagination?.total || 0} page={page} rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
      <ConfirmDialog open={!!deleteId} message="이 계약을 삭제하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
};

export default ContractList;
