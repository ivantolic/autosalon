import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../styles/PurchaseRequest.css'

const PurchaseRequest = () => {
  const { id: vehicleId } = useParams();
  const { user } = useAuth();
  const [vehicleTitle, setVehicleTitle] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Dohvati naslov vozila
    const fetchTitle = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('title')
        .eq('id', vehicleId)
        .single();
      if (data?.title) setVehicleTitle(data.title);
    };
    fetchTitle();
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!contact) {
      setError('Kontakt podatak je obavezan.');
      return;
    }
    const { error } = await supabase.from('purchase_requests').insert({
      vehicle_id: vehicleId,
      user_id: user?.id ?? null,
      contact_info: contact,
      note,
    });
    if (error) {
      setError('Greška pri slanju zahtjeva.');
    } else {
      setSuccess('Zahtjev za kupnju je poslan! Kontaktirat ćemo vas uskoro.');
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
          Kontakt broj telefona:
          <input
            type="text"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
          />
        </label>
        <label>
          Poruka (opcionalno):
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
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
