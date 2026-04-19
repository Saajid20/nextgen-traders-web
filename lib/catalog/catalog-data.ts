import { vehicles as mockVehicles, type VehicleCatalogItem as MockVehicleCatalogItem } from '@/lib/mockVehicles';
import {
  getGradeFeaturesByGradeIds,
  getVehicleBySlug,
  getVehicleChassisGroupsByVehicleIds,
  getVehicleGradesByChassisGroupIds,
  getVehicleMarketUpdates,
  getVehicles,
} from '@/lib/supabase/queries';
import type { GradeFeature, Vehicle, VehicleChassisGroup, VehicleMarketUpdate } from '@/types/database';

export type CatalogFeatureGroup = {
  category: string;
  items: string[];
};

export type CatalogGrade = {
  id: string;
  name: string;
  engineCC: number | null;
  positioningSummary: string | null;
  bestFor: string | null;
  features: string[];
  featureGroups: CatalogFeatureGroup[];
  chassisGroupId: string;
  chassisGroupName: string;
  chassisCode: string | null;
  fuelType: string | null;
  transmission: string | null;
  drivetrain: string | null;
};

export type CatalogChassisGroup = {
  id: string;
  displayName: string;
  chassisCode: string | null;
  fuelType: string | null;
  transmission: string | null;
  drivetrain: string | null;
  engineCCMin: number | null;
  engineCCMax: number | null;
  yearStart: number | null;
  yearEnd: number | null;
  marketFocus: string;
  notes: string | null;
};

export type CatalogVehicleListItem = {
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

export type CatalogVehicleDetail = {
  id: string;
  slug: string;
  name: string;
  chassis: string;
  fuelType: string | null;
  bodyType: string | null;
  overview: string | null;
  bestFor: string | null;
  grades: CatalogGrade[];
  chassisGroups: CatalogChassisGroup[];
  marketUpdates: VehicleMarketUpdate[];
};

type CatalogAssembly = {
  chassisGroupsByVehicleId: Map<string, CatalogChassisGroup[]>;
  gradesByChassisGroupId: Map<string, CatalogGrade[]>;
};

function buildVehicleName(vehicle: Vehicle) {
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(' ').trim();
  return name || vehicle.slug;
}

function formatFeatureCategory(category: string | null | undefined) {
  if (!category) {
    return 'General';
  }

  return category
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function dedupeValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizeFeatureGroups(features: GradeFeature[]): CatalogFeatureGroup[] {
  const grouped = new Map<string, string[]>();

  for (const feature of features) {
    const category = formatFeatureCategory(feature.featureCategory);
    const label = feature.featureLabel.trim();

    if (!label) {
      continue;
    }

    grouped.set(category, [...(grouped.get(category) ?? []), label]);
  }

  return Array.from(grouped.entries()).map(([category, items]) => ({
    category,
    items: dedupeValues(items),
  }));
}

function flattenFeatureGroups(featureGroups: CatalogFeatureGroup[]) {
  return featureGroups.flatMap((group) => group.items);
}

function getVehicleDrivetrains(chassisGroups: CatalogChassisGroup[]) {
  return Array.from(
    new Set(chassisGroups.map((chassisGroup) => chassisGroup.drivetrain?.trim()).filter((value): value is string => Boolean(value)))
  );
}

function getMockBodyType(slug: string) {
  const mockBodyTypes: Record<string, string> = {
    'suzuki-every': 'Van',
    'toyota-roomy': 'MPV',
  };

  return mockBodyTypes[slug] ?? null;
}

function getMockDrivetrains(slug: string) {
  const mockDrivetrains: Record<string, string[]> = {
    'suzuki-every': ['2WD'],
    'toyota-roomy': ['2WD'],
  };

  return mockDrivetrains[slug] ?? [];
}

function normalizeMockVehicle(vehicle: MockVehicleCatalogItem): CatalogVehicleListItem {
  return {
    slug: vehicle.slug,
    name: vehicle.name,
    chassis: vehicle.chassis,
    grades: vehicle.grades.map((grade) => ({
      name: grade.name,
      features: dedupeValues(grade.features),
      engineCC: grade.engineCC,
    })),
    fuelType: null,
    bodyType: getMockBodyType(vehicle.slug),
    drivetrains: getMockDrivetrains(vehicle.slug),
    engineCC: null,
  };
}

function normalizeChassisGroup(chassisGroup: VehicleChassisGroup): CatalogChassisGroup {
  return {
    id: chassisGroup.id,
    displayName: chassisGroup.displayName,
    chassisCode: chassisGroup.chassisCode,
    fuelType: chassisGroup.fuelType,
    transmission: chassisGroup.transmission,
    drivetrain: chassisGroup.drivetrain,
    engineCCMin: chassisGroup.engineCCMin,
    engineCCMax: chassisGroup.engineCCMax,
    yearStart: chassisGroup.yearStart,
    yearEnd: chassisGroup.yearEnd,
    marketFocus: chassisGroup.marketFocus,
    notes: chassisGroup.notes,
  };
}

async function buildCatalogAssembly(vehicles: Vehicle[]): Promise<CatalogAssembly> {
  const vehicleIds = vehicles.map((vehicle) => vehicle.id);
  const chassisGroups = await getVehicleChassisGroupsByVehicleIds(vehicleIds);
  const chassisGroupIds = chassisGroups.map((chassisGroup) => chassisGroup.id);
  const grades = await getVehicleGradesByChassisGroupIds(chassisGroupIds);
  const gradeIds = grades.map((grade) => grade.id);
  const features = await getGradeFeaturesByGradeIds(gradeIds);

  const rawFeaturesByGradeId = new Map<string, GradeFeature[]>();

  for (const feature of features) {
    const currentFeatures = rawFeaturesByGradeId.get(feature.gradeId) ?? [];
    currentFeatures.push(feature);
    rawFeaturesByGradeId.set(feature.gradeId, currentFeatures);
  }

  const normalizedFeatureGroupsByGradeId = new Map<string, CatalogFeatureGroup[]>();

  for (const grade of grades) {
    const gradeFeatures = rawFeaturesByGradeId.get(grade.id) ?? [];
    normalizedFeatureGroupsByGradeId.set(grade.id, normalizeFeatureGroups(gradeFeatures));
  }

  const chassisGroupMap = new Map(chassisGroups.map((chassisGroup) => [chassisGroup.id, chassisGroup]));
  const gradesByChassisGroupId = new Map<string, CatalogGrade[]>();

  for (const grade of grades) {
    const chassisGroup = chassisGroupMap.get(grade.chassisGroupId);

    if (!chassisGroup) {
      continue;
    }

    const featureGroups = normalizedFeatureGroupsByGradeId.get(grade.id) ?? [];
    const normalizedGrade: CatalogGrade = {
      id: grade.id,
      name: grade.name,
      engineCC: grade.engineCC ?? chassisGroup.engineCCMax ?? chassisGroup.engineCCMin ?? null,
      positioningSummary: grade.positioningSummary ?? null,
      bestFor: grade.bestFor ?? null,
      features: flattenFeatureGroups(featureGroups),
      featureGroups,
      chassisGroupId: grade.chassisGroupId,
      chassisGroupName: chassisGroup.displayName,
      chassisCode: chassisGroup.chassisCode,
      fuelType: chassisGroup.fuelType,
      transmission: chassisGroup.transmission,
      drivetrain: chassisGroup.drivetrain,
    };

    const existingGrades = gradesByChassisGroupId.get(grade.chassisGroupId) ?? [];
    existingGrades.push(normalizedGrade);
    gradesByChassisGroupId.set(grade.chassisGroupId, existingGrades);
  }

  const chassisGroupsByVehicleId = new Map<string, CatalogChassisGroup[]>();

  for (const chassisGroup of chassisGroups) {
    const normalizedChassisGroup = normalizeChassisGroup(chassisGroup);
    const existingChassisGroups = chassisGroupsByVehicleId.get(chassisGroup.vehicleId) ?? [];
    existingChassisGroups.push(normalizedChassisGroup);
    chassisGroupsByVehicleId.set(chassisGroup.vehicleId, existingChassisGroups);
  }

  return {
    chassisGroupsByVehicleId,
    gradesByChassisGroupId,
  };
}

function buildVehicleListItem(
  vehicle: Vehicle,
  chassisGroups: CatalogChassisGroup[],
  gradesByChassisGroupId: Map<string, CatalogGrade[]>
): CatalogVehicleListItem {
  const grades = chassisGroups.flatMap((chassisGroup) => gradesByChassisGroupId.get(chassisGroup.id) ?? []);

  return {
    slug: vehicle.slug,
    name: buildVehicleName(vehicle),
    chassis: vehicle.chassis ?? 'To be confirmed',
    grades: grades.map((grade) => ({
      name: grade.name,
      features: grade.features,
      engineCC: grade.engineCC,
    })),
    fuelType: vehicle.fuelType ?? null,
    bodyType: vehicle.bodyType ?? null,
    drivetrains: getVehicleDrivetrains(chassisGroups),
    engineCC: vehicle.engineCC ?? null,
  };
}

function buildVehicleDetail(
  vehicle: Vehicle,
  chassisGroups: CatalogChassisGroup[],
  gradesByChassisGroupId: Map<string, CatalogGrade[]>,
  marketUpdates: VehicleMarketUpdate[]
): CatalogVehicleDetail {
  const grades = chassisGroups.flatMap((chassisGroup) => gradesByChassisGroupId.get(chassisGroup.id) ?? []);
  const primaryChassisCode = chassisGroups.find((group) => group.chassisCode)?.chassisCode ?? vehicle.chassis ?? 'Not specified';
  const primaryFuelType = chassisGroups.find((group) => group.fuelType)?.fuelType ?? vehicle.fuelType ?? null;

  return {
    id: vehicle.id,
    slug: vehicle.slug,
    name: buildVehicleName(vehicle),
    chassis: primaryChassisCode,
    fuelType: primaryFuelType,
    bodyType: vehicle.bodyType ?? null,
    overview: vehicle.overview ?? null,
    bestFor: vehicle.bestFor ?? null,
    grades,
    chassisGroups,
    marketUpdates,
  };
}

export function getMockVehicleCatalog(): CatalogVehicleListItem[] {
  return mockVehicles.map(normalizeMockVehicle);
}

export async function getCatalogVehicleList(): Promise<CatalogVehicleListItem[]> {
  const vehicles = await getVehicles();

  if (vehicles.length === 0) {
    return [];
  }

  const { chassisGroupsByVehicleId, gradesByChassisGroupId } = await buildCatalogAssembly(vehicles);

  return vehicles.map((vehicle) => {
    const chassisGroups = chassisGroupsByVehicleId.get(vehicle.id) ?? [];
    return buildVehicleListItem(vehicle, chassisGroups, gradesByChassisGroupId);
  });
}

export async function getCatalogVehicleListWithFallback(): Promise<CatalogVehicleListItem[]> {
  try {
    const catalogVehicles = await getCatalogVehicleList();

    if (catalogVehicles.length > 0) {
      return catalogVehicles;
    }
  } catch (error) {
    console.error('Failed to load vehicles from Supabase, falling back to mock data.', error);
  }

  return getMockVehicleCatalog();
}

export async function getCatalogVehicleDetail(slug: string): Promise<CatalogVehicleDetail | null> {
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return null;
  }

  const { chassisGroupsByVehicleId, gradesByChassisGroupId } = await buildCatalogAssembly([vehicle]);
  const chassisGroups = chassisGroupsByVehicleId.get(vehicle.id) ?? [];
  const marketUpdates = await getVehicleMarketUpdates(vehicle.id);

  return buildVehicleDetail(vehicle, chassisGroups, gradesByChassisGroupId, marketUpdates);
}
