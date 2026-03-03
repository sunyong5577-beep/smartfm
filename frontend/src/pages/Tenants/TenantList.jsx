/**
 * 입주자 목록 페이지
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
import { getTenants, deleteTenant } from '../../services/tenantService';
import { getBuildings } from '../../services/buildingService';
import useDebounce from '../../hooks/useDebounce';

const TenantList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery(
    ['tenants', page, rowsPerPage, debouncedSearch, buildingFilter, statusFilter],
    () => getTenants({ page: page + 1, limit: rowsPerPage, search: debouncedSearch, buildingId: buildingFilter, status: statusFilter }).then(r => r.data),
    { keepPreviousData: true }
  );

  const { data: buildingsData } = useQuery('buildings-select',
    () => getBuildings({ limit: 100 }).then(r => r.data));

  const deleteMutation = useMutation((id) => deleteTenant(id), {
    onSuccess: () => { queryClient.invalidateQueries('tenants'); setDeleteId(null); },
  });

  const columns = [
    { id: 'name', label: '이름/법인명', minWidth: 120 },
    { id: 'building', label: '건물', minWidth: 120, render: (_, row) => row.building?.name || '-' },
    { id: 'unitNumber', label: '호실', minWidth: 80 },
    { id: 'tenantType', label: '유형', minWidth: 70 },
    { id: 'phone', label: '연락처', minWidth: 120 },
    { id: 'moveInDate', label: '입주일', minWidth: 100 },
    { id: 'status', label: '상태', minWidth: 80, render: (v) => <StatusChip status={v} /> },
    {
      id: 'actions', label: '관리', minWidth: 100, align: 'center',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="수정"><IconButton size="small" onClick={() => navigate(`/tenants/${row.id}/edit`)}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="삭제"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>입주자 관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/tenants/new')}>입주자 등록</Button>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="이름 / 연락처 검색" value={search}
          onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>건물 필터</InputLabel>
          <Select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)} label="건물 필터">
            <MenuItem value="">전체</MenuItem>
            {buildingsData?.data?.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
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
      <DataTable columns={columns} rows={data?.data || []} loading={isLoading}
        total={data?.pagination?.total || 0} page={page} rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
      <ConfirmDialog open={!!deleteId} message="이 입주자를 삭제하시겠습니까?"
        onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </Box>
  );
};

export default TenantList;
