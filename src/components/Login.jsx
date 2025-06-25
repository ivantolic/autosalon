import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const { user } = useAuth();
    console.log('Logged in user:', user?.email);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            if (
                error.message.toLowerCase().includes('confirm') ||
                error.message.toLowerCase().includes('verify')
            ) {
                setError('Molimo vas potvrdite vašu e-mail adresu.');
            } else {
                setError(error.message);
            }
        } else {
            navigate('/');
        }
    };

    return (
        <div className='login-container'>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button>Log in</button>
            </form>
            <p>
                Nemate račun?{' '}
                <Link to='/register'>Registrirajte se</Link>
            </p>
            <p className="forgot-password-link">
                <Link to="/reset-password">Zaboravljena lozinka?</Link>
            </p>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
