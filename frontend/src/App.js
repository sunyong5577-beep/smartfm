/**
 * 메인 App 컴포넌트 - 라우트 설정
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

// 페이지 컴포넌트
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import BuildingList from './pages/Buildings/BuildingList';
import BuildingForm from './pages/Buildings/BuildingForm';
import TenantList from './pages/Tenants/TenantList';
import TenantForm from './pages/Tenants/TenantForm';
import ContractList from './pages/Contracts/ContractList';
import ContractForm from './pages/Contracts/ContractForm';
import MaintenanceList from './pages/Maintenance/MaintenanceList';
import MaintenanceForm from './pages/Maintenance/MaintenanceForm';
import ExpenseList from './pages/Expenses/ExpenseList';
import ExpenseForm from './pages/Expenses/ExpenseForm';
import NoticeList from './pages/Notices/NoticeList';
import NoticeForm from './pages/Notices/NoticeForm';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buildings" element={<BuildingList />} />
            <Route path="/buildings/new" element={<BuildingForm />} />
            <Route path="/buildings/:id/edit" element={<BuildingForm />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="/tenants/new" element={<TenantForm />} />
            <Route path="/tenants/:id/edit" element={<TenantForm />} />
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/new" element={<ContractForm />} />
            <Route path="/contracts/:id/edit" element={<ContractForm />} />
            <Route path="/maintenance" element={<MaintenanceList />} />
            <Route path="/maintenance/new" element={<MaintenanceForm />} />
            <Route path="/maintenance/:id/edit" element={<MaintenanceForm />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/expenses/new" element={<ExpenseForm />} />
            <Route path="/expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="/notices" element={<NoticeList />} />
            <Route path="/notices/new" element={<NoticeForm />} />
            <Route path="/notices/:id/edit" element={<NoticeForm />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
