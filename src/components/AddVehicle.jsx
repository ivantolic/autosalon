import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import '../styles/AddVehicle.css';

const AddVehicle = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [useNewBrand, setUseNewBrand] = useState(false);
  const [useNewModel, setUseNewModel] = useState(false);

  const [form, setForm] = useState({
    title: '',
    price: '',
    year: '',
    category: '',
    fuel_type: '',
    power: '',
    mileage: '',
    transmission: '',
    color: '',
    tip: '', // za novi model
    doors: '', // broj vrata
  });

  const [errors, setErrors] = useState({
    price: '',
    year: '',
    mileage: '',
    doors: '',
    power: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverHovered, setCoverHovered] = useState(false);

  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Dodano: Ref za file inpute
  const coverInputRef = useRef(null);
  const additionalInputRef = useRef(null);

  // Dohvati brandove
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
      if (error) setError('Greška pri dohvaćanju marki: ' + error.message);
      else setBrands(data);
    };
    fetchBrands();
  }, []);

  // Dohvati modele
  useEffect(() => {
    setSelectedModelId(null);
    setVariants([]);
    setSelectedVariantId(null);
    if (!selectedBrandId) {
      setModels([]);
      return;
    }
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('*')
        .eq('brand_id', selectedBrandId)
        .order('name', { ascending: true });
      if (error) setError('Greška pri dohvaćanju modela: ' + error.message);
      else setModels(data);
    };
    fetchModels();
  }, [selectedBrandId]);

  // Dohvati varijante
  useEffect(() => {
    setSelectedVariantId(null);
    if (!selectedModelId) {
      setVariants([]);
      return;
    }
    const fetchVariants = async () => {
      const { data, error } = await supabase
        .from('model_variants')
        .select('*')
        .eq('model_id', selectedModelId)
        .order('variant_name', { ascending: true });
      if (error) setError('Greška pri dohvaćanju varijanti: ' + error.message);
      else setVariants(data);
    };
    fetchVariants();
  }, [selectedModelId]);

  // Preview naslovne slike
  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverImage);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  // Preview dodatnih slika
  useEffect(() => {
    if (additionalImages.length === 0) {
      setAdditionalPreviews([]);
      return;
    }
    const urls = additionalImages.map(file => URL.createObjectURL(file));
    setAdditionalPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [additionalImages]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Validacije
    if (name === 'price') {
      setErrors(prev => ({ ...prev, price: Number(value) > 0 ? '' : 'Cijena mora biti veća od 0' }));
    }
    if (name === 'mileage') {
      setErrors(prev => ({ ...prev, mileage: Number(value) >= 0 ? '' : 'Kilometraža ne može biti negativna' }));
    }
    if (name === 'year') {
      const currentYear = new Date().getFullYear();
      let err = '';
      if (Number(value) < 1900) err = 'Godina ne može biti manja od 1900';
      else if (Number(value) > currentYear) err = `Godina ne može biti veća od ${currentYear}`;
      setErrors(prev => ({ ...prev, year: err }));
    }
    if (name === 'doors') {
      const doorsNum = Number(value);
      setErrors(prev => ({
        ...prev,
        doors: (doorsNum >= 1 && doorsNum <= 7) ? '' : 'Broj vrata mora biti između 1 i 7',
      }));
    }
    if (name === 'power') {
      setErrors(prev => ({
        ...prev,
        power: Number(value) > 0 ? '' : 'Snaga (ks) mora biti veća od 0'
      }));
    }
  };

  // Brisanje glavne slike + reset inputa
  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Brisanje dodatne slike + reset inputa ako obrišeš sve slike
  const handleRemoveAdditionalImage = (index) => {
    setAdditionalImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Resetiraj input ako nema više slika
      if (updated.length === 0 && additionalInputRef.current) {
        additionalInputRef.current.value = '';
      }
      return updated;
    });
  };

  const validateBeforeSubmit = () => {
    if (errors.price || errors.mileage || errors.year || errors.doors) return false;
    if (Number(form.price) <= 0) return false;
    if (Number(form.mileage) < 0) return false;
    if (Number(form.power) <= 0) return false;
    const currentYear = new Date().getFullYear();
    if (Number(form.year) < 1900 || Number(form.year) > currentYear) return false;
    const doorsNum = Number(form.doors);
    if (doorsNum < 1 || doorsNum > 10) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateBeforeSubmit()) {
      setError('Molimo ispravite greške u formi prije slanja.');
      return;
    }

    setLoading(true);

    let brandId = selectedBrandId;
    let modelId = selectedModelId;

    if (useNewBrand) {
      if (!newBrandName.trim()) {
        setError('Unesite naziv nove marke.');
        setLoading(false);
        return;
      }
      const existingBrand = brands.find(b => b.name.toLowerCase() === newBrandName.trim().toLowerCase());
      if (existingBrand) {
        brandId = existingBrand.id;
      } else {
        const { data: newBrand, error: brandError } = await supabase
          .from('brands')
          .insert([{ name: newBrandName.trim() }])
          .select()
          .single();
        if (brandError) {
          setError('Greška kod dodavanja marke: ' + brandError.message);
          setLoading(false);
          return;
        }
        brandId = newBrand.id;
        setBrands(prev => [...prev, newBrand]);
      }
    } else if (!brandId) {
      setError('Odaberite marku ili unesite novu.');
      setLoading(false);
      return;
    }

    if (useNewModel) {
      if (!newModelName.trim()) {
        setError('Unesite naziv novog modela.');
        setLoading(false);
        return;
      }
      if (!form.tip) {
        setError('Molimo odaberite tip vozila za novi model.');
        setLoading(false);
        return;
      }
      const existingModel = models.find(m => m.name.toLowerCase() === newModelName.trim().toLowerCase());
      if (existingModel) {
        modelId = existingModel.id;
      } else {
        const { data: newModel, error: modelError } = await supabase
          .from('vehicle_models')
          .insert([{ name: newModelName.trim(), brand_id: brandId, type: form.tip }])
          .select()
          .single();
        if (modelError) {
          setError('Greška kod dodavanja modela: ' + modelError.message);
          setLoading(false);
          return;
        }
        modelId = newModel.id;
        setModels(prev => [...prev, newModel]);
      }
    } else if (!modelId) {
      setError('Odaberite model ili unesite novi.');
      setLoading(false);
      return;
    }

    if (!coverImage) {
      setError('Molimo odaberite naslovnu sliku.');
      setLoading(false);
      return;
    }
    if (!form.category) {
      setError('Molimo odaberite kategoriju vozila.');
      setLoading(false);
      return;
    }
    if (!useNewModel && !selectedVariantId) {
      setError('Molimo odaberite varijantu modela.');
      setLoading(false);
      return;
    }

    // Unos vozila u bazu
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([{
        model_id: modelId,
        variant_id: selectedVariantId,
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
      }])
      .select()
      .single();

    if (vehicleError) {
      setError('Greška kod unosa vozila: ' + vehicleError.message);
      setLoading(false);
      return;
    }

    const vehicleId = vehicle.id;

    // Upload naslovne slike
    const coverFileName = `vehicles/${uuidv4()}`;
    const { error: coverUploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(coverFileName, coverImage);

    if (coverUploadError) {
      setError('Greška kod uploadanja naslovne slike: ' + coverUploadError.message);
      setLoading(false);
      return;
    }

    const { data: coverUrlData } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(coverFileName);

    await supabase.from('vehicle_images').insert({
      vehicle_id: vehicleId,
      image_url: coverUrlData.publicUrl,
      is_primary: true,
    });

    // Upload dodatnih slika
    for (const image of additionalImages) {
      const fileName = `vehicles/${uuidv4()}`;
      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, image);

      if (!uploadError) {
        const { data: imageUrlData } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(fileName);

        await supabase.from('vehicle_images').insert({
          vehicle_id: vehicleId,
          image_url: imageUrlData.publicUrl,
          is_primary: false,
        });
      }
    }

    setSuccess('Vozilo uspješno dodano!');
    setForm({
      title: '',
      price: '',
      year: '',
      category: '',
      fuel_type: '',
      power: '',
      mileage: '',
      transmission: '',
      color: '',
      tip: '',
      doors: '',
    });
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
    setNewBrandName('');
    setNewModelName('');
    setUseNewBrand(false);
    setUseNewModel(false);
    setCoverImage(null);
    setCoverPreview(null);
    setAdditionalImages([]);
    setAdditionalPreviews([]);
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (additionalInputRef.current) additionalInputRef.current.value = '';
    setLoading(false);
  };

  return (
    <div className="add-vehicle-container">
      <h2>Dodaj vozilo</h2>

      <form onSubmit={handleSubmit} noValidate>

        <fieldset className="form-section">
          <legend>Marka i model vozila</legend>
          <div className="form-row">
            <label>Marka vozila</label>
            <div>
              <label>
                <input
                  type="radio"
                  checked={!useNewBrand}
                  onChange={() => setUseNewBrand(false)}
                />
                Odaberi postojeću
              </label>
              <label style={{marginLeft: '1rem'}}>
                <input
                  type="radio"
                  checked={useNewBrand}
                  onChange={() => setUseNewBrand(true)}
                />
                Unesi novu
              </label>
            </div>
          </div>

          {!useNewBrand ? (
            <div className="form-row">
              <select
                value={selectedBrandId || ''}
                onChange={e => setSelectedBrandId(e.target.value || null)}
              >
                <option value="">-- Odaberite marku --</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-row">
              <input
                type="text"
                placeholder="Unesite naziv nove marke"
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
              />
            </div>
          )}

          <div className="form-row">
            <label>Model vozila</label>
            <div>
              <label>
                <input
                  type="radio"
                  checked={!useNewModel}
                  onChange={() => setUseNewModel(false)}
                  disabled={!selectedBrandId && !useNewBrand}
                />
                Odaberi postojeći
              </label>
              <label style={{marginLeft: '1rem'}}>
                <input
                  type="radio"
                  checked={useNewModel}
                  onChange={() => setUseNewModel(true)}
                  disabled={!selectedBrandId && !useNewBrand}
                />
                Unesi novi
              </label>
            </div>
          </div>

          {!useNewModel ? (
            <div className="form-row">
              <select
                value={selectedModelId || ''}
                onChange={e => setSelectedModelId(e.target.value || null)}
                disabled={!selectedBrandId && !useNewBrand}
              >
                <option value="">-- Odaberite model --</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Unesite naziv novog modela"
                  value={newModelName}
                  onChange={e => setNewModelName(e.target.value)}
                  disabled={!selectedBrandId && !useNewBrand}
                />
              </div>
              <div className="form-row">
                <label>Tip vozila</label>
                <select
                  name="tip"
                  value={form.tip || ''}
                  onChange={e => setForm(prev => ({ ...prev, tip: e.target.value }))}
                  required={useNewModel}
                  disabled={!useNewModel}
                >
                  <option value="">-- Odaberite tip --</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="coupe">Coupe</option>
                  <option value="kabriolet">Kabriolet</option>
                  <option value="karavan">Karavan</option>
                </select>
              </div>
            </>
          )}

          {variants.length > 0 && !useNewModel && (
            <div className="form-row">
              <label>Varijanta modela</label>
              <select
                value={selectedVariantId || ''}
                onChange={e => setSelectedVariantId(e.target.value || null)}
                required={!useNewModel}
              >
                <option value="">-- Odaberite varijantu --</option>
                {variants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.variant_name} ({variant.type})
                  </option>
                ))}
              </select>
            </div>
          )}
        </fieldset>

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
            {errors.price && <span className="input-error">{errors.price}</span>}
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
            {errors.year && <span className="input-error">{errors.year}</span>}
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
        </fieldset>

        <fieldset className="form-section">
          <legend>Tehničke karakteristike</legend>
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
            {errors.power && <span className="input-error">{errors.power}</span>}
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
            {errors.mileage && <span className="input-error">{errors.mileage}</span>}
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
            {errors.doors && <span className="input-error">{errors.doors}</span>}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Slike</legend>
          <div className="file-input-row">
            <label>Naslovna slika:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setCoverImage(e.target.files[0])}
              required
              ref={coverInputRef}
            />
            {coverPreview && (
              <div
                className={`cover-preview-wrapper${coverHovered ? ' image-preview-hover' : ''}`}
                onMouseEnter={() => setCoverHovered(true)}
                onMouseLeave={() => setCoverHovered(false)}
                onClick={handleRemoveCoverImage}
                title="Klikni za brisanje slike"
                style={{ display: 'inline-block', cursor: 'pointer' }}
              >
                <img
                  src={coverPreview}
                  alt="Naslovna slika preview"
                  className="image-preview"
                />
              </div>
            )}
          </div>

          <div className="file-input-row">
            <label>Dodatne slike:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setAdditionalImages(prev => [...prev, ...Array.from(e.target.files)])}
              ref={additionalInputRef}
            />
            <div className="additional-previews">
              {additionalPreviews.map((src, idx) => (
                <div
                  key={idx}
                  className={`additional-preview-wrapper${hoveredImage === idx ? ' image-preview-hover' : ''}`}
                  onMouseEnter={() => setHoveredImage(idx)}
                  onMouseLeave={() => setHoveredImage(null)}
                  onClick={() => handleRemoveAdditionalImage(idx)}
                  title="Klikni za brisanje slike"
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                >
                  <img
                    src={src}
                    alt={`Dodatna slika ${idx + 1}`}
                    className="image-preview"
                  />
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? 'Dodavanje...' : 'Dodaj vozilo'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddVehicle;
