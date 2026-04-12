import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ClipboardList, 
  BookOpen, 
  Bell, 
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ role, collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const adminLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Add Teacher', icon: <UserPlus size={20} />, path: '/admin/add-teacher' },
        { name: 'Add Student', icon: <UserPlus size={20} />, path: '/admin/add-student' },
        { name: 'Notices', icon: <Bell size={20} />, path: '/admin/notices' },
    ];

    const teacherLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/teacher' },
        { name: 'Attendance', icon: <ClipboardList size={20} />, path: '/teacher/attendance' },
        { name: 'Homework', icon: <BookOpen size={20} />, path: '/teacher/homework' },
        { name: 'Marks', icon: <ClipboardList size={20} />, path: '/teacher/marks' },
        { name: 'Notices', icon: <Bell size={20} />, path: '/teacher/notices' },
    ];

    const parentLinks = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/parent' },
        { name: 'Fees', icon: <CreditCard size={20} />, path: '/parent/fees' },
        { name: 'Homework', icon: <BookOpen size={20} />, path: '/parent/homework' },
        { name: 'Notices', icon: <Bell size={20} />, path: '/parent/notices' },
    ];

    const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : parentLinks;

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '260px', height: '100vh', position: 'sticky', top: 0 }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {!collapsed && <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Portal</span>}
                <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav style={{ flex: 1, padding: '10px' }}>
                {links.map((link) => (
                    <NavLink 
                        key={link.path} 
                        to={link.path}
                        className={({ isActive }) => (isActive ? 'nav-active' : 'nav-item')}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            marginBottom: '5px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                            gap: '12px'
                        })}
                    >
                        {link.icon}
                        {!collapsed && <span>{link.name}</span>}
                    </NavLink>
                ))}
            </nav>

            <button 
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    color: '#ffcdd2',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    gap: '12px'
                }}
            >
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    );
};

export default Sidebar;
