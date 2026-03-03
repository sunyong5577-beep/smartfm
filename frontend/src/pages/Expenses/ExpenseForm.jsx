/**
 * 비용 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getExpense, createExpense, updateExpense } from '../../services/expenseService';
import { getBuildings } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { buildingId: '', category: '기타', amount: '', expenseDate: '', description: '', paymentMethod: '' };

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['expense', id], () => getExpense(id).then(r => r.data), { enabled: isEdit });
  const { data: buildingsData } = useQuery('buildings-select', () => getBuildings({ limit: 100 }).then(r => r.data));

  useEffect(() => {
    if (data?.data) {
      const e = data.data;
      setForm({ buildingId: e.buildingId, category: e.category, amount: e.amount,
        expenseDate: e.expenseDate || '', description: e.description || '', paymentMethod: e.paymentMethod || '' });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateExpense(id, values) : createExpense(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('expenses'); navigate('/expenses'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (!form.buildingId || !form.amount || !form.expenseDate) { setError('건물, 금액, 지출일은 필수 항목입니다.'); return; }
    mutation.mutate(form);
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/expenses')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '비용 수정' : '비용 등록'}</Typography>
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
              <FormControl fullWidth size="small">
                <InputLabel>카테고리</InputLabel>
                <Select name="category" value={form.category} onChange={handleChange} label="카테고리">
                  {['관리비','수도','전기','가스','인건비','수선비','기타'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="금액(원) *" name="amount" type="number" value={form.amount} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="지출일 *" name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="결제 방법" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} size="small" placeholder="카드, 계좌이체 등" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="내용" name="description" value={form.description} onChange={handleChange} multiline rows={2} size="small" />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/expenses')}>취소</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
              {mutation.isLoading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </form>
      </CardContent></Card>
    </Box>
  );
};

export default ExpenseForm;
