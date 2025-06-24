import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import VehiclesFilterSidebar from './VehiclesFilterSidebar';
import VehicleCard from './VehicleCard';
import { useAuth } from '../contexts/AuthContext';
import '../styles/VehiclesPage.css';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Cijena – od najmanje' },
  { value: 'price-desc', label: 'Cijena – od najveće' },
  { value: 'name-asc', label: 'Naziv A-Z' },
  { value: 'name-desc', label: 'Naziv Z-A' },
];

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersReady, setFiltersReady] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');

  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  //  Fetchaj sve filtere opcije na mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      supabase.from('brands').select('*'),
      supabase.from('vehicle_models').select('*'),
      supabase.from('model_variants').select('*'),
      supabase.from('vehicles').select('category'),
    ]).then(([brandsRes, modelsRes, variantsRes, categoriesRes]) => {
      if (!isMounted) return;
      setBrands(brandsRes.data || []);
      setModels(modelsRes.data || []);
      setVariants(variantsRes.data || []);
      const uniqueCategories = Array.from( // U obicno polje
        new Set((categoriesRes.data || []).map(v => v.category).filter(Boolean)) // Izbacuje duplikate
      );
      setCategories(uniqueCategories);
    });
    return () => { isMounted = false; };
  }, []);

  // Svaki put kad se URL ili brands/models promijeni, postavi filter iz querya (i resetiraj ostalo)
  useEffect(() => {
    if (!brands.length || !models.length) return;
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const brandQuery = params.get('brand');
    const modelQuery = params.get('model');
    const variantQuery = params.get('variant');
    const priceMin = params.get('priceMin');
    const priceMax = params.get('priceMax');

    let newFilters = {};

    // Brand po imenu
    if (brandQuery) {
      const foundBrand = brands.find(b => b.name.toLowerCase() === brandQuery.toLowerCase());
      if (foundBrand) newFilters.brand = foundBrand.id;
    }

    // Model po imenu
    if (modelQuery) {
      const foundModel = models.find(m => m.name.toLowerCase() === modelQuery.toLowerCase());
      if (foundModel) {
        newFilters.model = foundModel.id;
        // Ako brand nije u query, automatski postavi prema modelu
        if (!newFilters.brand) newFilters.brand = foundModel.brand_id;
      }
    }

    // Variant po id-u iz query stringa
    if (variantQuery) newFilters.variant = variantQuery;

    // Kategorija iz query
    if (category === 'new' || category === 'used' || category === 'luxury') {
      newFilters.category =
        category === 'new'
          ? 'novo'
          : category === 'used'
          ? 'rabljeno'
          : 'luksuzno';
    }

    // Cijena
    if (priceMin) newFilters.priceMin = priceMin;
    if (priceMax) newFilters.priceMax = priceMax;

    // Resetiraj sve filtere na osnovu query-a (ne mergea sa starim)
    setFilters(newFilters);
    setFiltersReady(true);
  }, [location.search, brands, models]);

  //  Fetchaj vozila po filterima (kad su filteri spremni)
  useEffect(() => {
    if (!filtersReady) return;
    setLoading(true);

    let query = supabase
      .from('vehicles')
      .select('*, vehicle_images(is_primary, image_url)');

    // Brand (preko modela)
    if (filters.brand) {
      const selectedModels = models.filter(m => m.brand_id === filters.brand).map(m => m.id);
      if (selectedModels.length > 0) query = query.in('model_id', selectedModels);
    }
    // Model (po ID-u)
    if (filters.model) query = query.eq('model_id', filters.model);
    if (filters.variant) query = query.eq('variant_id', filters.variant);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.priceMin) query = query.gte('price', filters.priceMin);
    if (filters.priceMax) query = query.lte('price', filters.priceMax);

    query.order('id', { ascending: false }).then(({ data, error }) => {
      if (!error && data) {
        setVehicles(
          data.map(vehicle => {
            const mainImg =
              vehicle.vehicle_images?.find(img => img.is_primary) ||
              vehicle.vehicle_images?.[0] ||
              null;
            return { ...vehicle, image_url: mainImg ? mainImg.image_url : null };
          })
        );
      } else {
        setVehicles([]);
      }
      setLoading(false);
    });
  }, [filters, models, filtersReady]);

  //  Promjena filtera - update i URL
  const handleFilterChange = updated => {
    setFilters(updated);

    // Update URL sa query parametrima za brand/model itd.
    let params = new URLSearchParams();

    // Brand
    const brandObj = brands.find(b => b.id === updated.brand);
    if (brandObj) params.set('brand', brandObj.name.toLowerCase());

    // Model
    const modelObj = models.find(m => m.id === updated.model);
    if (modelObj) params.set('model', modelObj.name.toLowerCase());

    // Variant
    if (updated.variant) params.set('variant', updated.variant);

    // Kategorija
    if (updated.category) {
      let catParam = '';
      if (updated.category === 'novo') catParam = 'new';
      else if (updated.category === 'rabljeno') catParam = 'used';
      else if (updated.category === 'luksuzno') catParam = 'luxury';
      else catParam = updated.category;
      params.set('category', catParam);
    }

    // Cijena
    if (updated.priceMin) params.set('priceMin', updated.priceMin);
    if (updated.priceMax) params.set('priceMax', updated.priceMax);

    navigate({ search: params.toString() }, { replace: true });
  };

  // Sort
  function sortVehicles(list) {
    const v = [...list];
    switch (sortBy) {
      case 'price-asc':
        return v.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return v.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name-asc':
        return v.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'hr'));
      case 'name-desc':
        return v.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'hr'));
      default:
        return v;
    }
  }

  return (
    <div className="vehicles-page-container">
      <h2>Vozila</h2>
      <div className="vehicles-page-flex">
        <VehiclesFilterSidebar
          brands={brands}
          models={models}
          variants={variants}
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="vehicles-page-main">
          <div className="vehicles-page-sort">
            <label htmlFor="sort" className="sorting">Sortiraj:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="vehicles-sort-select"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="vehicles-list">
            {!filtersReady || loading ? (
              <p>Učitavanje...</p>
            ) : vehicles.length === 0 ? (
              <p>Nema vozila za prikaz.</p>
            ) : (
              sortVehicles(vehicles).map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isAdmin={role === 'admin'}
                  onDelete={id => setVehicles(vs => vs.filter(v => v.id !== id))}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
