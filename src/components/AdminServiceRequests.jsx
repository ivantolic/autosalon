import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/AdminServiceRequests.css';

const statusLabels = {
  pending: 'Na čekanju',
  accepted: 'Prihvaćeno',
  in_progress: 'U tijeku',
  completed: 'Završeno',
  rejected: 'Odbijeno',
};

const AdminServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setRequests(!error && data ? data : []);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from('service_requests').update({ status: newStatus }).eq('id', id);
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj servisni zahtjev?')) {
      await supabase.from('service_requests').delete().eq('id', id);
      setRequests(reqs => reqs.filter(r => r.id !== id));
    }
  };

  if (loading) return <div className="admin-service-requests-loading">Učitavanje...</div>;

  return (
    <div className="admin-service-requests-container">
      <h2>Zahtjevi za servis vozila</h2>
      <table className="admin-service-requests-table">
        <thead>
          <tr>
            <th>Korisnik ID</th>
            <th>Prezime</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Godina</th>
            <th>Registracija</th>
            <th>Kontakt</th>
            <th>Opis</th>
            <th>Status</th>
            <th>Datum</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr><td colSpan={10}>Nema servisnih zahtjeva.</td></tr>
          ) : (
            requests.map(req => (
              <tr key={req.id}>
                <td>{req.user_id}</td>
                <td>{req.surname || '-'}</td>
                <td>{req.brand}</td>
                <td>{req.model}</td>
                <td>{req.year}</td>
                <td>{req.registration}</td>
                <td>{req.contact_info}</td>
                <td>{req.description || '-'}</td>
                <td>
                  <select
                    value={req.status}
                    onChange={e => handleStatusChange(req.id, e.target.value)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) =>
                      <option value={value} key={value}>{label}</option>
                    )}
                  </select>
                </td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  <button className="service-zavrsi-btn" onClick={() => handleDelete(req.id)}>
                    Obriši
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminServiceRequests;
