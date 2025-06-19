import { useMemo } from "react";
import '../styles/VehiclesFilterSidebar.css';

const VehiclesFilterSidebar = ({
  brands,
  models,
  variants,
  categories,
  filters,
  onFilterChange,
}) => {
  // Modeli filtrirani po brandu
  const filteredModels = useMemo(
    () =>
      filters.brand
        ? models.filter((m) => m.brand_id === filters.brand)
        : models,
    [models, filters.brand]
  );

  // Varijante filtrirane po modelu
  const filteredVariants = useMemo(
    () =>
      filters.model
        ? variants.filter((v) => v.model_id === filters.model)
        : [],
    [variants, filters.model]
  );

  return (
    <div className="vehicles-filter-sidebar">
      <h3>Filteri</h3>
      {/* Brand */}
      <label>
        Proizvođač:
        <select
          value={filters.brand || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              brand: e.target.value,
              model: "",
              variant: ""
            })
          }
        >
          <option value="">Prikaži sve</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {/* Model */}
      <label>
        Model:
        <select
          value={filters.model || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, model: e.target.value, variant: "" })
          }
          disabled={!filters.brand}
        >
          <option value="">Prikaži sve</option>
          {filteredModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      {/* Varijanta */}
      <label>
        Varijanta:
        <select
          value={filters.variant || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, variant: e.target.value })
          }
          disabled={!filters.model}
        >
          <option value="">Prikaži sve</option>
          {filteredVariants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.variant_name}
            </option>
          ))}
        </select>
      </label>
      {/* Kategorija */}
      <label>
        Kategorija:
        <select
          value={filters.category || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, category: e.target.value })
          }
        >
          <option value="">Prikaži sve</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </label>
      {/* Cijena */}
      <label>
        Cijena od:
        <input
          type="number"
          placeholder="Min"
          value={filters.priceMin || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, priceMin: e.target.value })
          }
        />
      </label>
      <label>
        Cijena do:
        <input
          type="number"
          placeholder="Max"
          value={filters.priceMax || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, priceMax: e.target.value })
          }
        />
      </label>
    </div>
  );
};

export default VehiclesFilterSidebar;
