import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../styles/PurchaseRequest.css';

const initialState = {
  surname: '',
  contact: '',
  note: '',
};

const PurchaseRequest = () => {
  const { id: vehicleId } = useParams();
  const { user, loading } = useAuth();
  const [vehicleTitle, setVehicleTitle] = useState('');
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTitle = async () => {
      const { data } = await supabase
        .from('vehicles')
        .select('title')
        .eq('id', vehicleId)
        .single();
      if (data?.title) setVehicleTitle(data.title);
    };
    fetchTitle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="purchase-form-container centered-message">
        <h2 className="purchase-form-title">Dogovori kupnju vozila</h2>
        <div className="loading-msg">Učitavanje...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="purchase-form-container centered-message">
        <h2 className="purchase-form-title">Dogovori kupnju vozila</h2>
        <span className="error-message">
          Morate biti prijavljeni kako biste poslali zahtjev za kupnju.<br />
          <Link to="/login" className="purchase-login-link">Prijava</Link>
        </span>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.surname) {
      setError('Prezime je obavezno.');
      return;
    }
    if (!form.contact) {
      setError('Kontakt podatak je obavezan.');
      return;
    }
    const { error } = await supabase.from('purchase_requests').insert({
      vehicle_id: vehicleId,
      user_id: user?.id ?? null, // Optional chaning
      surname: form.surname,
      contact_info: form.contact,
      note: form.note,
    });
    if (error) {
      setError('Greška pri slanju zahtjeva.');
    } else {
      setSuccess('Zahtjev za kupnju je poslan! Kontaktirat ćemo vas uskoro.');
      setForm(initialState);
      setTimeout(() => navigate('/vozila'), 2000);
    }
  };

  return (
    <div className="purchase-form-container">
      <h2 className="purchase-form-title">Dogovori kupnju vozila</h2>
      {vehicleTitle && (
        <span className="purchase-form-vehicle-title">
          Vozilo: {vehicleTitle}
        </span>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Prezime:
          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Kontakt (telefon/mail):
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Poruka (opcionalno):
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Npr. željeni termin za kontakt, dodatne napomene..."
            rows={5}
          />
        </label>
        <button type="submit" className="purchase-form-send-btn">Pošalji zahtjev</button>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default PurchaseRequest;
