import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/AdminPurchaseRequests.css';

const statusLabels = {
  pending: 'Na čekanju',
  contacted: 'Kontaktiran',
  completed: 'Riješen',
  rejected: 'Odbijen',
};

const AdminPurchaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_requests')
        .select(`
          id, created_at, contact_info, note, status, user_id, surname,
          vehicles(title)
        `)
        .order('created_at', { ascending: false });

      setRequests(!error && data ? data : []);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from('purchase_requests').update({ status: newStatus }).eq('id', id);
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj zahtjev?')) {
      await supabase.from('purchase_requests').delete().eq('id', id);
      setRequests(reqs => reqs.filter(r => r.id !== id));
    }
  };

  if (loading) return <div className="admin-requests-loading">Učitavanje...</div>;

  const openRequests = requests.filter(r => r.status !== 'completed');
  const completedRequests = requests.filter(r => r.status === 'completed');

  return (
    <div className="admin-requests-container">
      <h2 className="admin-requests-title">Zahtjevi za kupnju vozila</h2>

      {/* OTVORENI */}
      <table className="admin-requests-table">
        <thead>
          <tr>
            <th>Vozilo</th>
            <th>Korisnik ID</th>
            <th>Prezime</th>
            <th>Kontakt</th>
            <th>Napomena</th>
            <th>Status</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {openRequests.length === 0 ? (
            <tr><td colSpan={7}>Nema otvorenih zahtjeva.</td></tr>
          ) : (
            openRequests.map(req => (
              <tr key={req.id}>
                <td>{req.vehicles?.title || '-'}</td>
                <td>{req.user_id || '-'}</td>
                <td>{req.surname || '-'}</td>
                <td>{req.contact_info}</td>
                <td>{req.note || '-'}</td>
                <td>
                  <select
                    value={req.status || 'pending'}
                    onChange={e => handleStatusChange(req.id, e.target.value)}
                  >
                    <option value="pending">{statusLabels.pending}</option>
                    <option value="contacted">{statusLabels.contacted}</option>
                    <option value="completed">{statusLabels.completed}</option>
                    <option value="rejected">{statusLabels.rejected}</option>
                  </select>
                </td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ZAVRŠENI */}
      <h2 className="admin-requests-title done-title">Završeni zahtjevi</h2>
      <table className="admin-requests-table">
        <thead>
          <tr>
            <th>Vozilo</th>
            <th>Korisnik ID</th>
            <th>Prezime</th>
            <th>Kontakt</th>
            <th>Napomena</th>
            <th>Status</th>
            <th>Datum</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {completedRequests.length === 0 ? (
            <tr><td colSpan={8}>Nema završenih zahtjeva.</td></tr>
          ) : (
            completedRequests.map(req => (
              <tr key={req.id}>
                <td>{req.vehicles?.title || '-'}</td>
                <td>{req.user_id || '-'}</td>
                <td>{req.surname || '-'}</td>
                <td>{req.contact_info}</td>
                <td>{req.note || '-'}</td>
                <td>{statusLabels[req.status] || '-'}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  <button className="zavrsi-btn" onClick={() => handleDelete(req.id)}>
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

export default AdminPurchaseRequests;
