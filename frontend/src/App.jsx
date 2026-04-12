import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Sidebar from './components/Sidebar';

// New Admin Pages
import AddTeacher from './pages/AddTeacher';
import AddStudent from './pages/AddStudent';
import UserList from './pages/UserList';
import NoticesPage from './pages/NoticesPage';

// New Teacher Pages
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherHomework from './pages/TeacherHomework';
import TeacherMarks from './pages/TeacherMarks';

// New Parent Pages
import ParentFees from './pages/ParentFees';
import ParentHomework from './pages/ParentHomework';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

    return children;
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Sidebar role="admin" collapsed={collapsed} setCollapsed={setCollapsed} />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="users" element={<UserList />} />
                      <Route path="add-teacher" element={<AddTeacher />} />
                      <Route path="add-student" element={<AddStudent />} />
                      <Route path="notices" element={<NoticesPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/teacher/*" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Sidebar role="teacher" collapsed={collapsed} setCollapsed={setCollapsed} />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<TeacherDashboard />} />
                      <Route path="attendance" element={<TeacherAttendance />} />
                      <Route path="homework" element={<TeacherHomework />} />
                      <Route path="marks" element={<TeacherMarks />} />
                      <Route path="notices" element={<NoticesPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/parent/*" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Sidebar role="parent" collapsed={collapsed} setCollapsed={setCollapsed} />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<ParentDashboard />} />
                      <Route path="homework" element={<ParentHomework />} />
                      <Route path="fees" element={<ParentFees />} />
                      <Route path="notices" element={<NoticesPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
