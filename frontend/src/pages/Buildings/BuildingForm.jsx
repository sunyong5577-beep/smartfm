/**
 * 건물 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getBuilding, createBuilding, updateBuilding } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { name: '', address: '', totalFloors: 1, totalUnits: 1, buildingType: '상업용', constructionYear: '', totalArea: '', description: '', status: 'active' };

const BuildingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['building', id], () => getBuilding(id).then(r => r.data), { enabled: isEdit });

  useEffect(() => {
    if (data?.data) {
      const b = data.data;
      setForm({ name: b.name, address: b.address, totalFloors: b.totalFloors, totalUnits: b.totalUnits,
        buildingType: b.buildingType, constructionYear: b.constructionYear || '', totalArea: b.totalArea || '',
        description: b.description || '', status: b.status });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateBuilding(id, values) : createBuilding(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('buildings'); navigate('/buildings'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.address) { setError('건물명과 주소는 필수 입력 항목입니다.'); return; }
    mutation.mutate(form);
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/buildings')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '건물 수정' : '건물 등록'}</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="건물명 *" name="name" value={form.name} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>건물 유형</InputLabel>
                  <Select name="buildingType" value={form.buildingType} onChange={handleChange} label="건물 유형">
                    <MenuItem value="상업용">상업용</MenuItem>
                    <MenuItem value="주거용">주거용</MenuItem>
                    <MenuItem value="혼합">혼합</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="주소 *" name="address" value={form.address} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField fullWidth label="총 층수" name="totalFloors" type="number" value={form.totalFloors} onChange={handleChange} size="small" inputProps={{ min: 1 }} />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField fullWidth label="총 호실 수" name="totalUnits" type="number" value={form.totalUnits} onChange={handleChange} size="small" inputProps={{ min: 1 }} />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField fullWidth label="건축 연도" name="constructionYear" type="number" value={form.constructionYear} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField fullWidth label="총 면적(㎡)" name="totalArea" type="number" value={form.totalArea} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>상태</InputLabel>
                  <Select name="status" value={form.status} onChange={handleChange} label="상태">
                    <MenuItem value="active">활성</MenuItem>
                    <MenuItem value="inactive">비활성</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="설명" name="description" value={form.description} onChange={handleChange} multiline rows={3} size="small" />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/buildings')}>취소</Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
                {mutation.isLoading ? '저장 중...' : '저장'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BuildingForm;
