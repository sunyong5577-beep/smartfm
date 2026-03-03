/**
 * 유지보수 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getMaintenance, createMaintenance, updateMaintenance } from '../../services/maintenanceService';
import { getBuildings } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { buildingId: '', title: '', category: '기타', description: '', requestDate: '', completionDate: '', cost: '', contractor: '', status: '접수', priority: '보통' };

const MaintenanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['maintenance-item', id], () => getMaintenance(id).then(r => r.data), { enabled: isEdit });
  const { data: buildingsData } = useQuery('buildings-select', () => getBuildings({ limit: 100 }).then(r => r.data));

  useEffect(() => {
    if (data?.data) {
      const m = data.data;
      setForm({ buildingId: m.buildingId, title: m.title, category: m.category, description: m.description || '',
        requestDate: m.requestDate || '', completionDate: m.completionDate || '',
        cost: m.cost || '', contractor: m.contractor || '', status: m.status, priority: m.priority });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateMaintenance(id, values) : createMaintenance(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('maintenance'); navigate('/maintenance'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (!form.buildingId || !form.title || !form.requestDate) { setError('건물, 제목, 요청일은 필수 항목입니다.'); return; }
    mutation.mutate(form);
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/maintenance')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '유지보수 수정' : '유지보수 등록'}</Typography>
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
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="제목 *" name="title" value={form.title} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>카테고리</InputLabel>
                <Select name="category" value={form.category} onChange={handleChange} label="카테고리">
                  {['전기','수도','소방','엘리베이터','냉난방','기타'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>우선순위</InputLabel>
                <Select name="priority" value={form.priority} onChange={handleChange} label="우선순위">
                  {['긴급','보통','낮음'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>상태</InputLabel>
                <Select name="status" value={form.status} onChange={handleChange} label="상태">
                  {['접수','진행중','완료','취소'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="요청일 *" name="requestDate" type="date" value={form.requestDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="완료일" name="completionDate" type="date" value={form.completionDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="비용(원)" name="cost" type="number" value={form.cost} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label="시공업체" name="contractor" value={form.contractor} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="상세 내용" name="description" value={form.description} onChange={handleChange} multiline rows={3} size="small" />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/maintenance')}>취소</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
              {mutation.isLoading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </form>
      </CardContent></Card>
    </Box>
  );
};

export default MaintenanceForm;
