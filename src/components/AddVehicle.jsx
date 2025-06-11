import { useState, useEffect } from 'react';
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
    naziv: '',
    cijena: '',
    godina: '',
    category: '',
    tip: '',
    gorivo: '',
    snaga: '',
    kilometraza: '',
    opis: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dohvati brandove iz baze
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
      if (error) {
        setError('Greška pri dohvaćanju marki: ' + error.message);
      } else {
        setBrands(data);
      }
    };
    fetchBrands();
  }, []);

  // Dohvati modele kad se promijeni odabrana marka
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
      if (error) {
        setError('Greška pri dohvaćanju modela: ' + error.message);
      } else {
        setModels(data);
      }
    };
    fetchModels();
  }, [selectedBrandId]);

  // Dohvati varijante za odabrani model
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

      if (error) {
        setError('Greška pri dohvaćanju varijanti: ' + error.message);
      } else {
        setVariants(data);
      }
    };

    fetchVariants();
  }, [selectedModelId]);

  const handleFormChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    let brandId = selectedBrandId;
    let modelId = selectedModelId;
    let tipValue = form.tip;

    if (useNewBrand) {
      if (!newBrandName.trim()) {
        setError('Unesite naziv nove marke.');
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
          return;
        }
        brandId = newBrand.id;
        setBrands(prev => [...prev, newBrand]);
      }
    } else {
      if (!brandId) {
        setError('Odaberite marku ili unesite novu.');
        return;
      }
    }

    if (useNewModel) {
      if (!newModelName.trim()) {
        setError('Unesite naziv novog modela.');
        return;
      }
      if (!tipValue) {
        setError('Molimo odaberite tip vozila za novi model.');
        return;
      }
      const existingModel = models.find(m => m.name.toLowerCase() === newModelName.trim().toLowerCase());
      if (existingModel) {
        modelId = existingModel.id;
      } else {
        const { data: newModel, error: modelError } = await supabase
          .from('vehicle_models')
          .insert([{ name: newModelName.trim(), brand_id: brandId, type: tipValue }])
          .select()
          .single();
        if (modelError) {
          setError('Greška kod dodavanja modela: ' + modelError.message);
          return;
        }
        modelId = newModel.id;
        setModels(prev => [...prev, newModel]);
      }
    } else {
      if (!modelId) {
        setError('Odaberite model ili unesite novi.');
        return;
      }
      // Ako je postoji model, tip se uzima iz varijante modela pa nema potrebe uzimati tip iz forme
      tipValue = null;
    }

    if (!coverImage) {
      setError('Molimo odaberite naslovnu sliku.');
      return;
    }
    if (!form.category) {
      setError('Molimo odaberite kategoriju vozila.');
      return;
    }
    // Ako je odabrana varijanta, tip vozila ce biti iz nje, a inace iz forme
    // Za novi model auta se trazi tip 
    // a za postojeci se tip uzima iz varijante modela
    if (!useNewModel && !selectedVariantId) {
      setError('Molimo odaberite varijantu modela.');
      return;
    }

    // Dohvati tip iz odabrane varijante ako postoji
    if (!useNewModel && selectedVariantId) {
      const variant = variants.find(v => v.id === selectedVariantId);
      if (variant) {
        tipValue = variant.type;
      }
    }

    // Unos vozila
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([{
        model_id: modelId,
        variant_id: selectedVariantId,
        naziv: form.naziv,
        cijena: Number(form.cijena),
        godina: Number(form.godina),
        category: form.category,
        tip: tipValue,
        gorivo: form.gorivo,
        snaga: Number(form.snaga),
        kilometraza: Number(form.kilometraza),
        opis: form.opis,
      }])
      .select()
      .single();

    if (vehicleError) {
      setError('Greška kod unosa vozila: ' + vehicleError.message);
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
      naziv: '',
      cijena: '',
      godina: '',
      category: '',
      tip: '',
      gorivo: '',
      snaga: '',
      kilometraza: '',
      opis: '',
    });
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
    setNewBrandName('');
    setNewModelName('');
    setUseNewBrand(false);
    setUseNewModel(false);
    setCoverImage(null);
    setAdditionalImages([]);
  };

  return (
    <div className="add-vehicle-container">
      <h2>Dodaj vozilo</h2>
      <form onSubmit={handleSubmit}>
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
          <label>
            <input
              type="radio"
              checked={useNewBrand}
              onChange={() => setUseNewBrand(true)}
            />
            Unesi novu
          </label>
        </div>

        {!useNewBrand ? (
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
        ) : (
          <input
            type="text"
            placeholder="Unesite naziv nove marke"
            value={newBrandName}
            onChange={e => setNewBrandName(e.target.value)}
          />
        )}

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
          <label>
            <input
              type="radio"
              checked={useNewModel}
              onChange={() => setUseNewModel(true)}
              disabled={!selectedBrandId && !useNewBrand}
            />
            Unesi novi
          </label>
        </div>

        {!useNewModel ? (
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
        ) : (
          <>
            <input
              type="text"
              placeholder="Unesite naziv novog modela"
              value={newModelName}
              onChange={e => setNewModelName(e.target.value)}
              disabled={!selectedBrandId && !useNewBrand}
            />
            <label>Tip vozila</label>
            <select
              name="tip"
              value={form.tip}
              onChange={handleFormChange}
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
          </>
        )}

        {variants.length > 0 && !useNewModel && (
          <>
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
          </>
        )}

        <label>Kategorija vozila</label>
        <select
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

        <input
          name="naziv"
          type="text"
          placeholder="Naziv vozila"
          value={form.naziv}
          onChange={handleFormChange}
          required
        />

        <input
          name="cijena"
          type="number"
          placeholder="Cijena"
          value={form.cijena}
          onChange={handleFormChange}
          required
        />

        <input
          name="godina"
          type="number"
          placeholder="Godina"
          value={form.godina}
          onChange={handleFormChange}
          required
        />

        <input
          name="gorivo"
          placeholder="Gorivo"
          value={form.gorivo}
          onChange={handleFormChange}
          required
        />

        <input
          name="snaga"
          type="number"
          placeholder="Snaga (ks)"
          value={form.snaga}
          onChange={handleFormChange}
          required
        />

        <input
          name="kilometraza"
          type="number"
          placeholder="Kilometraža"
          value={form.kilometraza}
          onChange={handleFormChange}
          required
        />

        <textarea
          name="opis"
          placeholder="Opis vozila"
          value={form.opis}
          onChange={handleFormChange}
        />

        <label>Naslovna slika:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setCoverImage(e.target.files[0])}
          required
        />

        <label>Dodatne slike:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setAdditionalImages([...e.target.files])}
        />

        <button type="submit">Dodaj vozilo</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddVehicle;
