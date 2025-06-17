import { supabase } from '../supabaseClient';
import '../styles/VehicleCard.css';

const VehicleCard = ({ vehicle, isAdmin, onDelete }) => {
  // Brisanje vozila i svih vezanih podataka (slike, favorites, features, requests...)
  const handleDelete = async () => {
    const confirmed = window.confirm('Želite li stvarno obrisati ovo vozilo? Ova radnja je nepovratna!');
    if (!confirmed) return;

    // Prvo obrisi sve vezane podatke
    await supabase.from('vehicle_images').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('vehicle_features').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('favorites').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('service_requests').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('purchase_requests').delete().eq('vehicle_id', vehicle.id);

    // Zatim obrisi vozilo samo na kraju
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
    if (error) {
      alert('Došlo je do greške pri brisanju vozila!');
      return;
    }
    if (onDelete) onDelete(vehicle.id);
  };

  return (
    <div className="vehicle-card">
      <img
        src={vehicle.image_url || '/no-image.png'}
        alt={vehicle.title}
        className="vehicle-card-img"
        loading="lazy"
      />
      <div className="vehicle-card-info">
        <h3>{vehicle.title}</h3>
        <div className="vehicle-card-meta">
          <span>{vehicle.year} • {vehicle.mileage} km</span>
          <span>{vehicle.power} KS</span>
        </div>
        <div className="vehicle-card-details">
          <span>{vehicle.fuel_type}</span>
          <span>{vehicle.transmission}</span>
          <span>{vehicle.color}</span>
        </div>
        <div className="vehicle-card-bottom">
          <span className="vehicle-card-price">
            {vehicle.price ? vehicle.price.toLocaleString('hr-HR') : '-'} €
          </span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href={`/vozila/${vehicle.id}`} className="vehicle-card-link">
              Detalji
            </a>
            {isAdmin && (
              <button className="vehicle-delete-btn" onClick={handleDelete}>
                Obriši
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
