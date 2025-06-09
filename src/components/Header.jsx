import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Header.css'

const brands = ['Audi', 'Seat', 'Skoda']

const Header = () => {
    const { user, signOut } = useAuth()

    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>BRMBRM</Link>
            </div>

            <nav className='nav-links'>
                <div className='dropdown'>
                    <span className='dropdown-title'>Naši Brandovi</span>
                    <div className='dropdown-content'>
                        {brands.map((brand) => (
                            <Link key={brand} to={`/brands/${brand.toLowerCase()}`}>
                                {brand}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='dropdown'>
                    <span className='dropdown-title'>Ponuda vozila</span>
                    <div className='dropdown-content'>
                        <Link to='/vehicles?category=new'>Nova vozila</Link>
                        <Link to='/vehicles?category=used'>Rabljena vozila</Link>
                        <Link to='/vehicles?category=luxury'>Luksuzna vozila</Link>
                    </div>
                </div>

                <div className='dropdown'>
                    <span className='dropdown-title'>Usluge</span>
                    <div className='dropdown-content'>
                        <Link to='/service-requests'>Dogovor servisa</Link>
                        <Link to='/purchase-requests'>Dogovor kupnje vozila</Link>
                    </div>
                </div>

                <Link to='/about'>O nama</Link>
                <Link to='/favorites'>Favoriti</Link>
            </nav>

            <div className='auth-section'>
                {user ? (
                    <>
                        <span className='user-info'>{user.email}</span>
                        <button onClick={signOut}>Odjava</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Prijava</Link>
                        <Link to='/register'>Registracija</Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
