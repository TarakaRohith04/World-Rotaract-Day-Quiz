import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('abhyasamAdminAuth') === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded password for client-side demo
        if (password === 'admin123') {
            localStorage.setItem('abhyasamAdminAuth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid password. Please try again.');
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h2>Admin Portal Login</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Please enter the administrative password to access the results dashboard.
            </p>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                        placeholder="Enter password..."
                    />
                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminLogin;
