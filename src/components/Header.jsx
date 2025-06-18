import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const brands = ['Audi', 'Seat', 'Škoda'];

const Header = () => {
  const { user, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>BRMBRM</Link>
      </div>

      {/* Burger meni */}
      <div className='burger-icon' onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`bar ${menuOpen ? 'open' : ''}`} />
        <div className={`bar ${menuOpen ? 'open' : ''}`} />
        <div className={`bar ${menuOpen ? 'open' : ''}`} />
      </div>

      <nav className='nav-links'>
        <div className='dropdown'>
          <span className='dropdown-title'>Naši Brandovi</span>
          <div className='dropdown-content'>
            {brands.map((brand) => (
              <Link key={brand} to={`/brands/${brand.toLowerCase()}`}>{brand}</Link>
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
            <Link to='/servis/novi'>Dogovor servisa</Link>
            <Link to='/vozila'>Dogovor kupnje vozila</Link>
          </div>
        </div>

        <Link to='/about'>O nama</Link>

        <Link to='/favorites'>Favoriti</Link>

        {role === 'admin' && (
          <div className='dropdown'>
            <span className='dropdown-title'>Admin Panel</span>
            <div className='dropdown-content'>
              <Link to='/admin/add-vehicle'>Dodaj vozilo</Link>
              <Link to='/service-requests'>Dogovor servisa</Link>
              <Link to='/purchase-requests'>Dogovor kupnje</Link>
            </div>
          </div>
        )}
      </nav>

      <div className='auth-section'>
        {user ? (
          <>
            <span className='user-info'>{user.email} ({role})</span>
            <button onClick={signOut}>Odjava</button>
          </>
        ) : (
          <>
            <Link to='/login'>Prijava</Link>
            <Link to='/register'>Registracija</Link>
          </>
        )}
      </div>

      {menuOpen && (
        <div className='mobile-menu'>
          <button className='close-btn' onClick={() => setMenuOpen(false)}>×</button>
          <nav>
            <Link to='/' onClick={() => setMenuOpen(false)}>Početna</Link>
            <span>Naši Brandovi</span>
            {brands.map((brand) => (
              <Link key={brand} to={`/brands/${brand.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{brand}</Link>
            ))}
            <Link to='/vehicles?category=new' onClick={() => setMenuOpen(false)}>Nova vozila</Link>
            <Link to='/vehicles?category=used' onClick={() => setMenuOpen(false)}>Rabljena vozila</Link>
            <Link to='/vehicles?category=luxury' onClick={() => setMenuOpen(false)}>Luksuzna vozila</Link>
            <Link to='/service-requests' onClick={() => setMenuOpen(false)}>Dogovor servisa</Link>
            <Link to='/purchase-requests' onClick={() => setMenuOpen(false)}>Dogovor kupnje</Link>
            <Link to='/about' onClick={() => setMenuOpen(false)}>O nama</Link>
            <Link to='/favorites' onClick={() => setMenuOpen(false)}>Favoriti</Link>

            {role === 'admin' && (
              <>
                <span>Admin Panel</span>
                <Link to='/admin/add-vehicle' onClick={() => setMenuOpen(false)}>Dodaj vozilo</Link>
                <Link to='/service-requests' onClick={() => setMenuOpen(false)}>Dogovor servisa</Link>
                <Link to='/purchase-requests' onClick={() => setMenuOpen(false)}>Dogovor kupnje</Link>
              </>
            )}

            {user ? (
              <>
                <span>{user.email} ({role})</span>
                <button onClick={() => { signOut(); setMenuOpen(false); }}>Odjava</button>
              </>
            ) : (
              <>
                <Link to='/login' onClick={() => setMenuOpen(false)}>Prijava</Link>
                <Link to='/register' onClick={() => setMenuOpen(false)}>Registracija</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
