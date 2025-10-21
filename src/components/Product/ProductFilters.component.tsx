import { Dispatch, SetStateAction } from 'react';
import { Product, ProductType } from '@/types/product';

import Button from '@/components/UI/Button.component';
import Checkbox from '@/components/UI/Checkbox.component';
import RangeSlider from '@/components/UI/RangeSlider.component';

interface ProductFiltersProps {
  selectedSizes: string[];
  setSelectedSizes: Dispatch<SetStateAction<string[]>>;
  selectedColors: string[];
  setSelectedColors: Dispatch<SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  productTypes: ProductType[];
  toggleProductType: (id: string) => void;
  products: Product[];
  resetFilters: () => void;
}

const ProductFilters = ({
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  priceRange,
  setPriceRange,
  productTypes,
  toggleProductType,
  products,
  resetFilters,
}: ProductFiltersProps) => {
  // Get unique sizes from all products
  const sizes = Array.from(
    new Set(
      products.flatMap(
        (product: Product) =>
          product.allPaSizes?.nodes.map(
            (node: { name: string }) => node.name,
          ) || [],
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  // Get unique colors from all products
  const availableColors = products
    .flatMap((product: Product) => product.allPaColors?.nodes || [])
    .filter((color, index, self) => 
      index === self.findIndex((c) => c.slug === color.slug)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const colors = availableColors.map((color) => ({
    name: color.name,
    class: `bg-${color.slug}-500`
  }));

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white px-8 pb-8 sm:px-6 sm:pb-6 rounded-lg shadow-sm">
        <div className="mb-8">
          <h3 className="font-semibold mb-4">PRODUCT TYPE</h3>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <Checkbox
                key={type.id}
                id={type.id}
                label={type.name}
                checked={type.checked}
                onChange={() => toggleProductType(type.id)}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-4">PRICE</h3>
          <RangeSlider
            id="price-range"
            label="Price"
            min={0}
            max={1000}
            value={priceRange[1]}
            startValue={priceRange[0]}
            onChange={(value) => setPriceRange([priceRange[0], value])}
            formatValue={(value) => `kr ${value}`}
          />
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-4">SIZE</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                handleButtonClick={() => toggleSize(size)}
                variant="filter"
                selected={selectedSizes.includes(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-4">COLOR</h3>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  color.class
                } ${
                  selectedColors.includes(color.name)
                    ? 'ring-2 ring-offset-2 ring-gray-900'
                    : ''
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <Button
          handleButtonClick={resetFilters}
          variant="reset"
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
