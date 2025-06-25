import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password',
        });

        if (error) {
            setError('Greška: ' + error.message);
        } else {
            setMessage('Poslali smo ti email za resetiranje lozinke!');
        }
    };

    return (
        <div className='login-container'>
            <h2>Reset lozinke</h2>
            <form onSubmit={handleReset}>
                <input
                    type="email"
                    placeholder="Unesi svoj email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button>Pošalji link za reset</button>
            </form>
            <p className="forgot-password-link">
                <Link to="/login">Natrag na login</Link>
            </p>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default PasswordReset;
