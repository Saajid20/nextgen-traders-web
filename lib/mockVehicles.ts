export type VehicleGrade = {
  name: string;
  features: string[];
  engineCC: number;
};

export type VehicleCatalogItem = {
  slug: string;
  name: string;
  chassis: string;
  grades: VehicleGrade[];
};

export const vehicles: VehicleCatalogItem[] = [
  {
    slug: 'suzuki-every',
    name: 'Suzuki Every',
    chassis: 'DA17V',
    grades: [
      {
        name: 'PA',
        features: ['Halogen Headlights', 'Manual Windows', 'Basic Audio'],
        engineCC: 660,
      },
      {
        name: 'Join',
        features: ['Auto Gear Shift (AGS)', 'Power Windows', 'Keyless Entry', 'Foldable Rear Seats'],
        engineCC: 660,
      },
    ],
  },
  {
    slug: 'toyota-roomy',
    name: 'Toyota Roomy',
    chassis: 'M900A',
    grades: [
      {
        name: 'G',
        features: ['Halogen Headlights', 'Standard Bumpers', 'Push Start'],
        engineCC: 1000,
      },
      {
        name: 'Custom G',
        features: ['LED Headlights', 'Custom Aero Bumpers', 'Alloy Wheels', 'Leather Steering'],
        engineCC: 1000,
      },
    ],
  },
];
