import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/Login.css';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);
        if (error) {
            setError('Greška: ' + error.message);
        } else {
            setMessage('Lozinka je uspješno postavljena. Preusmjeravamo na login...');
            setTimeout(async () => {
                await supabase.auth.signOut();
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className='login-container'>
            <h2>Postavi novu lozinku</h2>
            <form onSubmit={handleUpdatePassword}>
                <input
                    type="password"
                    placeholder="Nova lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button disabled={loading}>
                    {loading ? 'Spremam...' : 'Spremi novu lozinku'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default UpdatePassword;
