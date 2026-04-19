import type { VehiclePayload } from '@/types/catalog-ingestion';

export const raizePayload: VehiclePayload = {
  vehicle: {
    make: 'Toyota',
    model: 'Raize',
    slug: 'toyota-raize',
    chassis: 'A200A',
    bodyType: 'Compact SUV',
    fuelType: 'Petrol',
    engineCC: 1000,
    overview:
      'The Toyota Raize is a compact Japanese-market SUV that combines easy city dimensions with the higher seating position, practicality, and modern styling many Sri Lankan import buyers look for.',
    bestFor:
      'Urban buyers and small families who want a manageable imported SUV with strong day-to-day usability, modern features, and easier parking than larger crossovers.',
  },
  chassisGroups: [
    {
      groupCode: 'a200a-2wd-1kr-vet',
      displayName: 'A200A 1.0L Turbo 2WD',
      chassisCode: 'A200A',
      fuelType: 'Petrol',
      transmission: 'CVT',
      drivetrain: '2WD',
      engineCCMin: 996,
      engineCCMax: 996,
      yearStart: 2019,
      marketFocus: 'Sri Lanka imports',
      sortOrder: 0,
      notes: 'Mainstream Japanese import configuration with turbocharged 1.0L petrol engine and front-wheel drive.',
      grades: [
        {
          name: 'X',
          engineCC: 996,
          sortOrder: 0,
          features: [
            { featureCategory: 'safety', featureLabel: 'Toyota Safety Sense', isHighlight: true },
            { featureCategory: 'lighting', featureLabel: 'LED headlamps' },
            { featureCategory: 'comfort', featureLabel: 'Manual air conditioning' },
            { featureCategory: 'access', featureLabel: 'Smart key on selected imports' },
            { featureCategory: 'wheels', featureLabel: '16-inch wheels' },
          ],
        },
        {
          name: 'G',
          engineCC: 996,
          sortOrder: 1,
          features: [
            { featureCategory: 'safety', featureLabel: 'Toyota Safety Sense', isHighlight: true },
            { featureCategory: 'comfort', featureLabel: 'Automatic climate control', isHighlight: true },
            { featureCategory: 'access', featureLabel: 'Smart entry and push start', isHighlight: true },
            { featureCategory: 'cabin', featureLabel: 'Multi-information display' },
            { featureCategory: 'wheels', featureLabel: '16-inch alloy wheels' },
          ],
        },
        {
          name: 'Z',
          engineCC: 996,
          sortOrder: 2,
          features: [
            { featureCategory: 'safety', featureLabel: 'Toyota Safety Sense', isHighlight: true },
            { featureCategory: 'lighting', featureLabel: 'Full LED headlamp package', isHighlight: true },
            { featureCategory: 'comfort', featureLabel: 'Automatic climate control' },
            { featureCategory: 'access', featureLabel: 'Smart entry and push start', isHighlight: true },
            { featureCategory: 'styling', featureLabel: '17-inch alloy wheels', isHighlight: true },
            { featureCategory: 'cabin', featureLabel: 'Premium trim accents' },
          ],
        },
      ],
      marketUpdates: [
        {
          updateType: 'market_note',
          title: 'Raize remains a strong compact SUV import candidate',
          summary:
            'The Raize continues to appeal in Sri Lanka due to its city-friendly footprint, SUV stance, and practical feature mix in Japanese import stock.',
          impactLevel: 'info',
          tags: ['raize', 'compact-suv', 'japan-import'],
        },
      ],
    },
    {
      groupCode: 'a210a-4wd-1kr-vet',
      displayName: 'A210A 1.0L Turbo 4WD',
      chassisCode: 'A210A',
      fuelType: 'Petrol',
      transmission: 'CVT',
      drivetrain: '4WD',
      engineCCMin: 996,
      engineCCMax: 996,
      yearStart: 2019,
      marketFocus: 'Sri Lanka imports',
      sortOrder: 1,
      notes: 'Less common four-wheel-drive variant for buyers prioritizing added traction and niche import preference.',
      grades: [
        {
          name: 'G 4WD',
          engineCC: 996,
          sortOrder: 0,
          features: [
            { featureCategory: 'drivetrain', featureLabel: 'Four-wheel drive', isHighlight: true },
            { featureCategory: 'safety', featureLabel: 'Toyota Safety Sense', isHighlight: true },
            { featureCategory: 'access', featureLabel: 'Smart entry and push start' },
            { featureCategory: 'comfort', featureLabel: 'Automatic climate control' },
          ],
        },
        {
          name: 'Z 4WD',
          engineCC: 996,
          sortOrder: 1,
          features: [
            { featureCategory: 'drivetrain', featureLabel: 'Four-wheel drive', isHighlight: true },
            { featureCategory: 'safety', featureLabel: 'Toyota Safety Sense', isHighlight: true },
            { featureCategory: 'lighting', featureLabel: 'Full LED headlamp package' },
            { featureCategory: 'styling', featureLabel: '17-inch alloy wheels', isHighlight: true },
            { featureCategory: 'access', featureLabel: 'Smart entry and push start' },
          ],
        },
      ],
    },
  ],
  marketUpdates: [
    {
      updateType: 'market_note',
      title: 'Toyota Raize suits Sri Lankan urban import demand',
      summary:
        'Demand remains strongest among buyers who want a modern compact crossover format with easier daily maneuverability than larger SUVs.',
      impactLevel: 'info',
      tags: ['toyota', 'raize', 'sri-lanka'],
    },
  ],
};
