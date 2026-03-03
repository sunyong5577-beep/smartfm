/**
 * 계약 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getContract, createContract, updateContract } from '../../services/contractService';
import { getTenants } from '../../services/tenantService';
import { getBuildings } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { tenantId: '', buildingId: '', contractType: '월세', startDate: '', endDate: '', depositAmount: '', monthlyRent: '', managementFee: '', status: 'active', notes: '' };

const ContractForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['contract', id], () => getContract(id).then(r => r.data), { enabled: isEdit });
  const { data: tenantsData } = useQuery('tenants-select', () => getTenants({ limit: 200 }).then(r => r.data));
  const { data: buildingsData } = useQuery('buildings-select', () => getBuildings({ limit: 100 }).then(r => r.data));

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      setForm({ tenantId: c.tenantId, buildingId: c.buildingId, contractType: c.contractType,
        startDate: c.startDate || '', endDate: c.endDate || '', depositAmount: c.depositAmount || '',
        monthlyRent: c.monthlyRent || '', managementFee: c.managementFee || '',
        status: c.status, notes: c.notes || '' });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateContract(id, values) : createContract(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('contracts'); navigate('/contracts'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (!form.tenantId || !form.buildingId || !form.startDate || !form.endDate) {
      setError('입주자, 건물, 계약기간은 필수 항목입니다.'); return;
    }
    mutation.mutate(form);
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/contracts')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '계약 수정' : '계약 등록'}</Typography>
      </Box>
      <Card><CardContent>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>입주자 *</InputLabel>
                <Select name="tenantId" value={form.tenantId} onChange={handleChange} label="입주자 *">
                  {tenantsData?.data?.map(t => <MenuItem key={t.id} value={t.id}>{t.name} ({t.unitNumber})</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>건물 *</InputLabel>
                <Select name="buildingId" value={form.buildingId} onChange={handleChange} label="건물 *">
                  {buildingsData?.data?.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>계약 유형</InputLabel>
                <Select name="contractType" value={form.contractType} onChange={handleChange} label="계약 유형">
                  <MenuItem value="임대">임대</MenuItem>
                  <MenuItem value="전세">전세</MenuItem>
                  <MenuItem value="월세">월세</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField fullWidth label="계약 시작일 *" name="startDate" type="date" value={form.startDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField fullWidth label="계약 종료일 *" name="endDate" type="date" value={form.endDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="보증금(원)" name="depositAmount" type="number" value={form.depositAmount} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="월세(원)" name="monthlyRent" type="number" value={form.monthlyRent} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="관리비(원)" name="managementFee" type="number" value={form.managementFee} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>상태</InputLabel>
                <Select name="status" value={form.status} onChange={handleChange} label="상태">
                  <MenuItem value="active">활성</MenuItem>
                  <MenuItem value="expired">만료</MenuItem>
                  <MenuItem value="terminated">해지</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="비고" name="notes" value={form.notes} onChange={handleChange} multiline rows={2} size="small" />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/contracts')}>취소</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
              {mutation.isLoading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </form>
      </CardContent></Card>
    </Box>
  );
};

export default ContractForm;
