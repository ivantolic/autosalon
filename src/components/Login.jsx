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
                setError('Please confirm your email address before logging in. Check your inbox for the confirmation link.');
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
                Don't have an account?{' '}
                <Link to='/register'>Register</Link>
            </p>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
