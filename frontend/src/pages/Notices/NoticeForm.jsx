/**
 * 공지사항 등록/수정 폼
 */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Grid, Card, CardContent, Stack, Alert, FormControlLabel, Switch,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { getNotice, createNotice, updateNotice } from '../../services/noticeService';
import { getBuildings } from '../../services/buildingService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const INITIAL = { buildingId: '', title: '', content: '', noticeType: '일반', isImportant: false };

const NoticeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = React.useState(INITIAL);
  const [error, setError] = React.useState('');

  const { data, isLoading } = useQuery(['notice', id], () => getNotice(id).then(r => r.data), { enabled: isEdit });
  const { data: buildingsData } = useQuery('buildings-select', () => getBuildings({ limit: 100 }).then(r => r.data));

  useEffect(() => {
    if (data?.data) {
      const n = data.data;
      setForm({ buildingId: n.buildingId || '', title: n.title, content: n.content,
        noticeType: n.noticeType, isImportant: n.isImportant });
    }
  }, [data]);

  const mutation = useMutation(
    (values) => isEdit ? updateNotice(id, values) : createNotice(values),
    {
      onSuccess: () => { queryClient.invalidateQueries('notices'); navigate('/notices'); },
      onError: (err) => setError(err.response?.data?.message || '저장에 실패했습니다.'),
    }
  );

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (!form.title || !form.content) { setError('제목과 내용은 필수 항목입니다.'); return; }
    mutation.mutate({ ...form, buildingId: form.buildingId || null });
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/notices')}>목록</Button>
        <Typography variant="h5" fontWeight={700}>{isEdit ? '공지사항 수정' : '공지사항 등록'}</Typography>
      </Box>
      <Card><CardContent>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="제목 *" name="title" value={form.title} onChange={handleChange} size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>공지 유형</InputLabel>
                <Select name="noticeType" value={form.noticeType} onChange={handleChange} label="공지 유형">
                  {['일반','긴급','공사'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>대상 건물</InputLabel>
                <Select name="buildingId" value={form.buildingId} onChange={handleChange} label="대상 건물">
                  <MenuItem value="">전체</MenuItem>
                  {buildingsData?.data?.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="내용 *" name="content" value={form.content} onChange={handleChange} multiline rows={6} size="small" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.isImportant} onChange={(e) => setForm(f => ({ ...f, isImportant: e.target.checked }))} />}
                label="중요 공지로 설정"
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/notices')}>취소</Button>
            <Button type="submit" variant="contained" startIcon={<Save />} disabled={mutation.isLoading}>
              {mutation.isLoading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </form>
      </CardContent></Card>
    </Box>
  );
};

export default NoticeForm;
