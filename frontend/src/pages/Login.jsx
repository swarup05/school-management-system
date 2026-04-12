import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('role', data.role);
            localStorage.setItem('email', data.email);

            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'teacher') navigate('/teacher');
            else if (data.role === 'parent') navigate('/parent');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <div className="school-header">
                    <img src="/logo.png" alt="logo" onError={(e) => e.target.src = 'https://via.placeholder.com/80/1a237e/ffd700?text=WVS'} />
                    <h1>WARANA VALLEY SCHOOL, SAGAON</h1>
                    <p>CBSE Affiliation No: 1130759</p>
                    <p>Sagaon Sarud Road, Near Warana River Bridge</p>
                    <p>Tal. Shirala, Dist. Sangli - 415408</p>
                    <p>Email: wvssagaon@gmail.com</p>
                    <p>Contact: 9595729551, 9571659595</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>}
                    <button type="submit" className="btn-primary">Login to Portal</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
