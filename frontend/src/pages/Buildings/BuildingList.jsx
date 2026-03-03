/**
 * 건물 목록 페이지
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Stack, IconButton, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import StatusChip from '../../components/Common/StatusChip';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { getBuildings, deleteBuilding } from '../../services/buildingService';
import useDebounce from '../../hooks/useDebounce';

const BuildingList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery(
    ['buildings', page, rowsPerPage, debouncedSearch, statusFilter, typeFilter],
    () => getBuildings({ page: page + 1, limit: rowsPerPage, search: debouncedSearch, status: statusFilter, buildingType: typeFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation((id) => deleteBuilding(id), {
    onSuccess: () => { queryClient.invalidateQueries('buildings'); setDeleteId(null); },
  });

  const columns = [
    { id: 'name', label: '건물명', minWidth: 140 },
    { id: 'address', label: '주소', minWidth: 200 },
    { id: 'buildingType', label: '유형', minWidth: 80 },
    { id: 'totalFloors', label: '층수', minWidth: 60, align: 'center' },
    { id: 'totalUnits', label: '호실수', minWidth: 60, align: 'center' },
    { id: 'status', label: '상태', minWidth: 80, render: (v) => <StatusChip status={v} /> },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/buildings/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>건물 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/buildings/new')}>건물 등록</Button>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="건물명 또는 주소 검색" value={search}
          onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>유형</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="유형">
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="상업용">상업용</MenuItem>
            <MenuItem value="주거용">주거용</MenuItem>
            <MenuItem value="혼합">혼합</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>상태</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="상태">
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="active">활성</MenuItem>
            <MenuItem value="inactive">비활성</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={isLoading}
        total={data?.pagination?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
      />

      <ConfirmDialog
        open={!!deleteId}
        message="이 건물을 삭제하면 관련 데이터가 모두 삭제됩니다. 계속하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default BuildingList;
