export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  key: 'fuelType' | 'bodyType' | 'drivetrain';
  label: string;
  options: FilterOption[];
};

export type NormalizedVehicleCatalogItem = {
  slug: string;
  name: string;
  chassis: string;
  grades: Array<{
    name: string;
    features: string[];
    engineCC: number | null;
  }>;
  fuelType: string | null;
  bodyType: string | null;
  drivetrains: string[];
  engineCC: number | null;
};

export type VehicleFilterState = Record<FilterGroup['key'], string>;
