import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/MyServiceRequests.css';

const statusLabels = {
  pending: 'Na čekanju',
  accepted: 'Prihvaćeno',
  in_progress: 'U tijeku',
  completed: 'Završeno',
  rejected: 'Odbijeno',
};

const MyServiceRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setRequests(!error && data ? data : []);
      setLoading(false);
    };
    fetchRequests();
  }, [user]);

  if (!user) {
    return (
      <div className="my-service-requests centered-container">
        <h2 className="my-service-requests-title">Moji zahtjevi za servis</h2>
        <div className="centered-message">
          <span className="error-message">
            Morate biti prijavljeni kako biste vidjeli svoje servisne zahtjeve.
          </span>
          <Link to="/login" className="purchase-login-link">Prijava</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="my-service-requests-loading">Učitavanje...</div>;

  return (
    <div className="my-service-requests">
      <h2 className="my-service-requests-title">Moji zahtjevi za servis</h2>
      <table className="my-service-requests-table">
        <thead>
          <tr>
            <th>Marka</th>
            <th>Model</th>
            <th>Godina</th>
            <th>Registracija</th>
            <th>Status</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}>
                Nema servisnih zahtjeva.
              </td>
            </tr>
          ) : (
            requests.map(req => (
              <tr key={req.id}>
                <td>{req.brand}</td>
                <td>{req.model}</td>
                <td>{req.year}</td>
                <td>{req.registration}</td>
                <td className={`status-${req.status}`}>{statusLabels[req.status] || '-'}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyServiceRequests;
