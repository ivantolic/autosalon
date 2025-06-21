import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/AddVehicle.css";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    year: "",
    category: "",
    fuel_type: "",
    power: "",
    mileage: "",
    transmission: "",
    color: "",
    tip: "",
    doors: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [featureList, setFeatureList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dohvati podatke vozila po id-u
  useEffect(() => {
    async function fetchVehicle() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("vehicles")
        .select(`*, vehicle_features(id, feature)`)
        .eq("id", id)
        .single();

      if (!error && data) {
        setForm({
          title: data.title || "",
          price: data.price || "",
          year: data.year || "",
          category: data.category || "",
          fuel_type: data.fuel_type || "",
          power: data.power || "",
          mileage: data.mileage || "",
          transmission: data.transmission || "",
          color: data.color || "",
          tip: data.category || "",
          doors: data.doors || "",
        });

        setFeatureList(data.vehicle_features?.map(f => f.feature) || []);
      } else {
        setError("Greška kod dohvaćanja vozila: " + (error?.message || ""));
      }
      setLoading(false);
    }
    fetchVehicle();
  }, [id]);

  // Feature funkcije
  const handleAddFeature = () => {
    if (featureInput.trim() && !featureList.includes(featureInput.trim())) {
      setFeatureList(prev => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const handleRemoveFeature = idx => {
    setFeatureList(prev => prev.filter((_, i) => i !== idx));
  };

  // Promjena form polja
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Validacija
  const validateBeforeSubmit = () => {
    if (Number(form.price) <= 0) return false;
    if (Number(form.mileage) < 0) return false;
    if (Number(form.power) <= 0) return false;
    const currentYear = new Date().getFullYear();
    if (Number(form.year) < 1900 || Number(form.year) > currentYear) return false;
    const doorsNum = Number(form.doors);
    if (doorsNum < 1 || doorsNum > 10) return false;
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateBeforeSubmit()) {
      setError("Molimo ispravite greške u formi prije slanja.");
      return;
    }
    setLoading(true);

    // UPDATE vozila
    const { error: vehicleError } = await supabase
      .from("vehicles")
      .update({
        title: form.title,
        price: Number(form.price),
        year: Number(form.year),
        category: form.category,
        fuel_type: form.fuel_type,
        power: Number(form.power),
        mileage: Number(form.mileage),
        transmission: form.transmission,
        color: form.color,
        doors: Number(form.doors),
      })
      .eq("id", id);

    if (vehicleError) {
      setError("Greška kod spremanja: " + vehicleError.message);
      setLoading(false);
      return;
    }

    // Dodatna oprema: obriši sve stare, upiši nove
    await supabase.from("vehicle_features").delete().eq("vehicle_id", id);
    if (featureList.length > 0) {
      const featuresToInsert = featureList.map(f => ({
        vehicle_id: id,
        feature: f,
      }));
      await supabase.from("vehicle_features").insert(featuresToInsert);
    }

    setSuccess("Vozilo je ažurirano!");
    setTimeout(() => navigate(`/vozila/${id}`), 1200);
    setLoading(false);
  };

  return (
    <div className="add-vehicle-container">
      <h2>Uredi vozilo</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="form-section">
          <legend>Osnovni podaci</legend>
          <div className="form-row">
            <label htmlFor="title">Naslov vozila</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Naslov vozila"
              value={form.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="category">Kategorija</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              required
            >
              <option value="">-- Odaberite kategoriju --</option>
              <option value="novo">Novo</option>
              <option value="rabljeno">Rabljeno</option>
              <option value="luksuzno">Luksuzno</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="price">Cijena</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="Cijena"
              value={form.price}
              onChange={handleFormChange}
              required
              min="1"
              step="0.01"
            />
          </div>
          <div className="form-row">
            <label htmlFor="year">Godina</label>
            <input
              id="year"
              name="year"
              type="number"
              placeholder="Godina"
              value={form.year}
              onChange={handleFormChange}
              required
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="form-row">
            <label htmlFor="fuel_type">Vrsta goriva</label>
            <select
              id="fuel_type"
              name="fuel_type"
              value={form.fuel_type}
              onChange={handleFormChange}
              required
            >
              <option value="">-- Odaberite gorivo --</option>
              <option value="benzin">Benzin</option>
              <option value="diesel">Diesel</option>
              <option value="elektricni">Električni</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="power">Snaga (ks)</label>
            <input
              id="power"
              name="power"
              type="number"
              placeholder="Snaga (ks)"
              value={form.power}
              onChange={handleFormChange}
              required
              min="1"
            />
          </div>
          <div className="form-row">
            <label htmlFor="mileage">Kilometraža</label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              placeholder="Kilometraža"
              value={form.mileage}
              onChange={handleFormChange}
              required
              min="0"
            />
          </div>
          <div className="form-row">
            <label htmlFor="transmission">Mjenjač</label>
            <select
              id="transmission"
              name="transmission"
              value={form.transmission}
              onChange={handleFormChange}
            >
              <option value="">-- Odaberite mjenjač --</option>
              <option value="manualni">Manualni</option>
              <option value="automatski">Automatski</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="color">Boja</label>
            <input
              id="color"
              name="color"
              placeholder="Boja"
              value={form.color}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="doors">Broj vrata</label>
            <input
              id="doors"
              name="doors"
              type="number"
              placeholder="Broj vrata"
              value={form.doors}
              onChange={handleFormChange}
              required
              min="1"
              max="10"
            />
          </div>
        </fieldset>

        {/* Dodatna oprema */}
        <fieldset className="form-section">
          <legend>Dodatna oprema</legend>
          <div className="feature-section">
            <div className="feature-add-row">
              <input
                type="text"
                placeholder="Unesi novu opciju (npr. Senzori za kišu)"
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button type="button" onClick={handleAddFeature}>
                Dodaj opciju
              </button>
            </div>
            <ul className="feature-list">
              {featureList.map((feature, idx) => (
                <li key={idx}>
                  {feature}
                  <button
                    type="button"
                    className="feature-remove-btn"
                    onClick={() => handleRemoveFeature(idx)}
                  >
                    Ukloni
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? "Spremanje..." : "Spremi izmjene"}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default EditVehicle;
