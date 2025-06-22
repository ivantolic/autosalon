import { supabase } from '../supabaseClient';
import FavoriteButton from './FavoriteButton';
import '../styles/VehicleCard.css';

const VehicleCard = ({ vehicle, isAdmin, onDelete, onUnfavorite, isFavoritePage }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm('Želite li stvarno obrisati ovo vozilo? Ova radnja je nepovratna!');
    if (!confirmed) return;

    await supabase.from('vehicle_images').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('vehicle_features').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('favorites').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('service_requests').delete().eq('vehicle_id', vehicle.id);
    await supabase.from('purchase_requests').delete().eq('vehicle_id', vehicle.id);

    const { error } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
    if (error) {
      alert('Došlo je do greške pri brisanju vozila!');
      return;
    }
    if (onDelete) onDelete(vehicle.id);
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-img-wrapper">
        {/* Zvjezdica NA slici, gore desno */}
        <div className="vehicle-fav-imgcorner">
          <FavoriteButton
            vehicleId={vehicle.id}
            size="1.22rem"
            onUnfavorite={isFavoritePage ? onUnfavorite : undefined}
          />
        </div>
        <img
          src={vehicle.image_url || '/no-image.png'}
          alt={vehicle.title}
          className="vehicle-card-img"
          loading="lazy"
        />
      </div>
      <div className="vehicle-card-info">
        <h3>{vehicle.title}</h3>
        <div className="vehicle-card-specs-2col">
          <div>
            <span>{vehicle.year || '-'}</span>
            <span>{vehicle.fuel_type || '-'}</span>
            <span>{vehicle.transmission || '-'}</span>
          </div>
          <div>
            <span>{vehicle.mileage ? `${vehicle.mileage} km` : '-'}</span>
            <span>{vehicle.power ? `${vehicle.power} KS` : '-'}</span>
            <span>{vehicle.color || '-'}</span>
          </div>
        </div>
        <div className="vehicle-card-bottom">
          <span className="vehicle-card-price">
            {vehicle.price ? vehicle.price.toLocaleString('hr-HR') : '-'} €
          </span>
          <div>
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
