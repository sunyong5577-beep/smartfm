/**
 * 입주자 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getTenant, createTenant, updateTenant } from '../../services/tenantService';
import { getBuildings } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { buildingId: '', unitNumber: '', tenantType: '개인', name: '', phone: '', email: '', businessNumber: '', representativeName: '', moveInDate: '', moveOutDate: '', status: 'active', notes: '' };

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['tenant', id], () => getTenant(id).then(r => r.data), { enabled: isEdit });
  const { data: buildingsData } = useQuery('buildings-select', () => getBuildings({ limit: 100 }).then(r => r.data));

  useEffect(() => {
    if (data?.data) {
      const t = data.data;
      setForm({ buildingId: t.buildingId, unitNumber: t.unitNumber, tenantType: t.tenantType, name: t.name,
        phone: t.phone || '', email: t.email || '', businessNumber: t.businessNumber || '',
        representativeName: t.representativeName || '', moveInDate: t.moveInDate || '',
        moveOutDate: t.moveOutDate || '', status: t.status, notes: t.notes || '' });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateTenant(id, values) : createTenant(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('tenants'); navigate('/tenants'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (!form.buildingId || !form.name || !form.unitNumber) { setError('건물, 이름, 호실은 필수 항목입니다.'); return; }
    mutation.mutate(form);
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/tenants')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '입주자 수정' : '입주자 등록'}</Typography>
      </Box>
      <Card><CardContent>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>건물 *</InputLabel>
                <Select name="buildingId" value={form.buildingId} onChange={handleChange} label="건물 *">
                  {buildingsData?.data?.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="호실 *" name="unitNumber" value={form.unitNumber} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>입주자 유형</InputLabel>
                <Select name="tenantType" value={form.tenantType} onChange={handleChange} label="입주자 유형">
                  <MenuItem value="개인">개인</MenuItem>
                  <MenuItem value="법인">법인</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="이름/법인명 *" name="name" value={form.name} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="연락처" name="phone" value={form.phone} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="이메일" name="email" type="email" value={form.email} onChange={handleChange} size="small" />
            </Grid>
            {form.tenantType === '법인' && <>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="사업자등록번호" name="businessNumber" value={form.businessNumber} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="대표자명" name="representativeName" value={form.representativeName} onChange={handleChange} size="small" />
              </Grid>
            </>}
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="입주일" name="moveInDate" type="date" value={form.moveInDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="퇴실일" name="moveOutDate" type="date" value={form.moveOutDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>상태</InputLabel>
                <Select name="status" value={form.status} onChange={handleChange} label="상태">
                  <MenuItem value="active">활성</MenuItem>
                  <MenuItem value="inactive">비활성</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="비고" name="notes" value={form.notes} onChange={handleChange} multiline rows={2} size="small" />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/tenants')}>취소</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
              {mutation.isLoading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </form>
      </CardContent></Card>
    </Box>
  );
};

export default TenantForm;
