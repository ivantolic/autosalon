import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../styles/ServiceRequest.css';

const ALLOWED_BRANDS = ["Audi", "Seat", "Škoda"];

const initialState = {
  brand: '',
  model: '',
  year: '',
  registration: '', // DODANO
  contact: '',
  description: '',
};

const ServiceRequest = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.brand || !ALLOWED_BRANDS.includes(form.brand)) {
      setError('Dozvoljeni su samo Audi, Seat ili Škoda.');
      return;
    }
    if (!form.model || !form.year || !form.contact || !form.registration) { // Dodano registration
      setError('Sva polja osim opisa su obavezna.');
      return;
    }
    const { error } = await supabase.from('service_requests').insert({
      user_id: user?.id,
      brand: form.brand,
      model: form.model,
      year: form.year,
      registration: form.registration, // Dodano registration
      contact_info: form.contact,
      description: form.description,
      status: 'pending',
    });
    if (error) {
      setError('Greška pri slanju zahtjeva.');
    } else {
      setSuccess('Zahtjev za servis je poslan! Kontaktirat ćemo vas uskoro.');
      setForm(initialState);
    }
  };

  return (
    <div className="service-form-container">
      <h2 className="service-form-title">Dogovor servisa vozila</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Marka vozila:
          <select name="brand" value={form.brand} onChange={handleChange} required>
            <option value="">Odaberi</option>
            {ALLOWED_BRANDS.map(brand => (
              <option value={brand} key={brand}>{brand}</option>
            ))}
          </select>
        </label>
        <label>
          Model:
          <input type="text" name="model" value={form.model} onChange={handleChange} required />
        </label>
        <label>
          Godina:
          <input type="number" name="year" value={form.year} onChange={handleChange} required />
        </label>
        <label>
          Registracija:
          <input type="text" name="registration" value={form.registration} onChange={handleChange} required />
        </label>
        <label>
          Kontakt (telefon/mail):
          <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
        </label>
        <label>
          Opis problema (opcionalno):
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>
        <button type="submit" className="purchase-form-send-btn">Pošalji zahtjev</button>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
      <div className="to-my-requests-btn-wrapper">
        <Link to="/servis/moji" className="to-my-requests-btn">
          Pogledaj moje servisne zahtjeve
        </Link>
      </div>
    </div>
  );
};

export default ServiceRequest;
