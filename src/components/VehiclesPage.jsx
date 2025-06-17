import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VehicleCard from './VehicleCard';
import { useAuth } from '../contexts/AuthContext';
import '../styles/VehiclesPage.css';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_images(is_primary, image_url)
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Greška kod dohvaćanja vozila:', error.message);
      setVehicles([]);
    } else {
      const mappedVehicles = data.map(vehicle => {
        const mainImg =
          vehicle.vehicle_images?.find(img => img.is_primary) ||
          vehicle.vehicle_images?.[0] ||
          null;
        return {
          ...vehicle,
          image_url: mainImg ? mainImg.image_url : null,
        };
      });
      setVehicles(mappedVehicles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  // Handler za brisanje
  const handleDelete = async (vehicleId) => {
    // Izbaci iz liste bez refetcha
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
  };

  return (
    <div className="vehicles-page-container">
      <h2>Sva vozila</h2>
      {loading ? (
        <p>Učitavanje...</p>
      ) : vehicles.length === 0 ? (
        <p>Nema vozila u bazi.</p>
      ) : (
        <div className="vehicles-list">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isAdmin={role === 'admin'}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
