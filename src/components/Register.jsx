import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        const user = data.user;
        if (user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    role: 'user', // defaultna uloga
                });

            if (profileError) {
                setError('Korisnik registriran, ali nije spremljen u profil: ' + profileError.message);
                return;
            }
        }

        navigate('/login');
    };

    return (
        <div className='register-container'>
            <h2>Registracija</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Ponovno unesite lozinku"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Registriraj se</button>
            </form>

            <p>
                Već imate račun? <Link to="/login">Prijavite se</Link>
            </p>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Register;
