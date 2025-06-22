import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import VehicleCard from "./VehicleCard";
import { Link } from "react-router-dom";
import "../styles/VehiclesPage.css";
import "../styles/PurchaseRequest.css";
import '../styles/FavoriteButton.css'

const FavoritesPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return setLoading(false);
    setLoading(true);

    supabase
      .from("favorites")
      .select(`
        id,
        vehicle_id,
        vehicles:vehicle_id (
          *,
          vehicle_images(is_primary, image_url)
        )
      `)
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (data && !error) {
          const vehiclesWithImg = data
            .map((fav) => {
              if (!fav.vehicles) return null;
              const mainImg =
                fav.vehicles.vehicle_images?.find((img) => img.is_primary) ||
                fav.vehicles.vehicle_images?.[0] ||
                null;
              return {
                ...fav.vehicles,
                image_url: mainImg ? mainImg.image_url : null,
              };
            })
            .filter(Boolean);
          setVehicles(vehiclesWithImg);
        } else {
          setVehicles([]);
        }
        setLoading(false);
      });
  }, [user]);

  const handleUnfavorite = (vehicleId) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  if (!user) {
    return (
      <div className="vehicles-page-container centered-message">
        <h2>Favoriti</h2>
        <span className="error-message">
          Morate biti prijavljeni kako biste vidjeli favorite.<br />
          <Link to="/login" className="purchase-login-link">Prijava</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="vehicles-page-container">
      <h2>Favoriti</h2>
      <div className="vehicles-list">
        {loading ? (
          <p>Učitavanje...</p>
        ) : vehicles.length === 0 ? (
          <p>Nemate spremljenih favorita.</p>
        ) : (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onUnfavorite={handleUnfavorite}
              isFavoritePage
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
