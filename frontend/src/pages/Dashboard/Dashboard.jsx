/**
 * 대시보드 페이지 - 통계 카드 및 최근 활동
 */
import React from 'react';
import { useQuery } from 'react-query';
import {
  Grid, Card, CardContent, Typography, Box, Chip,
  List, ListItem, ListItemText, Divider, Paper,
} from '@mui/material';
import { Business, People, Build, AttachMoney } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBuildings } from '../../services/buildingService';
import { getTenants } from '../../services/tenantService';
import { getMaintenanceList } from '../../services/maintenanceService';
import { getMonthlySummary } from '../../services/expenseService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>{title}</Typography>
          <Typography variant="h4" fontWeight={700}>{value ?? '-'}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.light`, color: `${color}.main`, opacity: 0.85 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: buildingsData, isLoading: bLoading } = useQuery('dashboard-buildings',
    () => getBuildings({ limit: 5 }).then(r => r.data));
  const { data: tenantsData, isLoading: tLoading } = useQuery('dashboard-tenants',
    () => getTenants({ limit: 5, status: 'active' }).then(r => r.data));
  const { data: maintenanceData, isLoading: mLoading } = useQuery('dashboard-maintenance',
    () => getMaintenanceList({ limit: 5, status: '접수' }).then(r => r.data));
  const { data: expenseData } = useQuery('dashboard-expenses',
    () => getMonthlySummary({}).then(r => r.data));

  const isLoading = bLoading || tLoading || mLoading;
  if (isLoading) return <LoadingSpinner />;

  const chartData = expenseData?.data?.slice(0, 6).reverse().map(item => ({
    name: `${item.year}-${String(item.month).padStart(2,'0')}`,
    금액: Number(item.totalAmount) || 0,
  })) || [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>대시보드</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="전체 건물" value={buildingsData?.pagination?.total ?? 0}
            icon={<Business />} color="primary" subtitle="등록된 건물 수" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="활성 입주자" value={tenantsData?.pagination?.total ?? 0}
            icon={<People />} color="success" subtitle="현재 입주 중" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="유지보수 접수" value={maintenanceData?.pagination?.total ?? 0}
            icon={<Build />} color="warning" subtitle="처리 대기 중" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="이번 달 지출"
            value={chartData[chartData.length - 1]?.금액
              ? `₩${Number(chartData[chartData.length - 1].금액).toLocaleString()}` : '₩0'}
            icon={<AttachMoney />} color="error" subtitle="비용 집계" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>월별 비용 현황</Typography>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `₩${(v/10000).toFixed(0)}만`} />
                    <Tooltip formatter={(v) => [`₩${Number(v).toLocaleString()}`, '지출액']} />
                    <Bar dataKey="금액" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>비용 데이터가 없습니다.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>최근 유지보수 요청</Typography>
              {maintenanceData?.data?.length === 0 ? (
                <Typography color="text.secondary" variant="body2">접수된 요청이 없습니다.</Typography>
              ) : (
                <List dense>
                  {maintenanceData?.data?.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <ListItem disableGutters>
                        <ListItemText
                          primary={item.title}
                          secondary={`${item.building?.name || ''} · ${item.category}`}
                        />
                        <Chip label={item.priority} size="small"
                          color={item.priority === '긴급' ? 'error' : item.priority === '보통' ? 'warning' : 'default'} />
                      </ListItem>
                      {idx < maintenanceData.data.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
