import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import '../styles/LoginStyles.css'

const Login = () => {
    const { user } = useAuth()
    console.log('Logirani korisnik:', user?.email)


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if(error) {
            setError(error.message)
        } else {
            navigate('/') // Ako login bude uspjesan, vrati korsnika na pocetnu stranicu
        }
    }

    return (
        <div className='login-container'>

            <h2>Prijava</h2>

            <form onSubmit={handleLogin}>

                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e)  => setEmail(e.target.value)}
                    required    
                />

                <input 
                    type="password" 
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e)  => setPassword(e.target.value)}
                    required    
                />

                <button>Prijavi se</button>
            </form>
            <p>
                Nemate račun?{' '}
                <Link to='/register'>Registrirajte se</Link>
            </p>
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}

export default Login