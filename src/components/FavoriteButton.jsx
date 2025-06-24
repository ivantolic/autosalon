import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const FavoriteButton = ({
  vehicleId,
  onUnfavorite,
  className = ""
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Je li auto favorit
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    let ignore = false;
    const checkFavorite = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('vehicle_id', vehicleId)
        .single();
      if (!ignore) setIsFavorite(!!data);
    };
    checkFavorite();
    return () => { ignore = true };
  }, [user, vehicleId]);
  
  // Dodavanje brisanje favorita
  const toggleFavorite = async () => {
    if (!user || loading) return;
    setLoading(true);
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('vehicle_id', vehicleId);
      setIsFavorite(false);
      if (onUnfavorite) onUnfavorite(vehicleId);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, vehicle_id: vehicleId });
      setIsFavorite(true);
    }
    setLoading(false);
  };

  return (
    <div className={`favorite-btn-wrapper ${className}`}>
      <button
        className={`favorite-btn${isFavorite ? " active" : ""}${!user ? " favorite-btn-disabled" : ""}`}
        onClick={toggleFavorite}
        disabled={loading}
        aria-label={isFavorite ? "Makni iz favorita" : "Dodaj u favorite"}
        title={user ? (isFavorite ? "Makni iz favorita" : "Dodaj u favorite") : "Prijavite se kako bi dodali vozilo u favorite"}
        type="button"
        tabIndex={user ? 0 : -1}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
};

export default FavoriteButton;
