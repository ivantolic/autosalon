import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../styles/VehicleDetails.css';

// KORISTI točnu putanju do AuthContexta po tvojoj strukturi!
import { useAuth } from '../contexts/AuthContext';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // KORISTIMO ROLE iz contexta!
  const { role } = useAuth();

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      const { data: vehicleData, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_images(image_url, is_primary),
          vehicle_models(name, category, brands(name)),
          vehicle_features(feature)
        `)
        .eq('id', id)
        .single();

      if (!error && vehicleData) {
        setVehicle(vehicleData);
        const sortedImages = (vehicleData.vehicle_images || []).sort((a, b) => b.is_primary - a.is_primary);
        setImages(sortedImages.map(img => ({ original: img.image_url, thumbnail: img.image_url })));
        setFeatures(vehicleData.vehicle_features?.map(f => f.feature) || []);
      } else {
        console.error('Greška:', error);
      }
      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  if (loading) return <div className="vehicle-details-container">Učitavanje...</div>;
  if (!vehicle) return <div className="vehicle-details-container">Vozilo nije pronađeno.</div>;

  return (
    <div className="vehicle-details-container">
      <h2>{vehicle.title}</h2>

      <div className="vehicle-gallery">
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          showNav={true}
          showBullets={true}
        />
      </div>

      <div className="vehicle-details-grid">
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Marka:</span>
          <span className="vehicle-detail-value">{vehicle.vehicle_models?.brands?.name || '-'}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Model:</span>
          <span className="vehicle-detail-value">{vehicle.vehicle_models?.name || '-'}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Kategorija:</span>
          <span className="vehicle-detail-value">{vehicle.vehicle_models?.category || '-'}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Godina:</span>
          <span className="vehicle-detail-value">{vehicle.year}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Kilometraža:</span>
          <span className="vehicle-detail-value">{vehicle.mileage} km</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Snaga:</span>
          <span className="vehicle-detail-value">{vehicle.power} KS</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Gorivo:</span>
          <span className="vehicle-detail-value">{vehicle.fuel_type}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Mjenjač:</span>
          <span className="vehicle-detail-value">{vehicle.transmission}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Boja:</span>
          <span className="vehicle-detail-value">{vehicle.color}</span>
        </div>
        <div className="vehicle-detail-card">
          <span className="vehicle-detail-label">Cijena:</span>
          <span className="vehicle-detail-value vehicle-details-price">{vehicle.price} €</span>
        </div>
      </div>

      {features.length > 0 && (
        <div className="vehicle-features">
          <h3>Dodatna oprema</h3>
          <ul>
            {features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="vehicle-purchase-btn-wrapper">
        <Link
          to={`/kupnja/${vehicle.id}`}
          className="vehicle-purchase-btn"
        >
          Dogovorite kupnju ovog automobila
        </Link>

        {/* ADMIN - Prikazi "Uredi vozilo" gumb ako je role === 'admin' */}
        {role === 'admin' && (
          <Link
            to={`/vozila/edit/${vehicle.id}`}
            className="vehicle-edit-btn"
          >
            Uredi vozilo
          </Link>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
