import { supabase } from '@/lib/supabase/client';
import type {
  GradeFeature,
  GradeFeatureRow,
  Vehicle,
  VehicleChassisGroup,
  VehicleChassisGroupRow,
  VehicleGrade,
  VehicleGradeRow,
  VehicleMarketUpdate,
  VehicleMarketUpdateRow,
  VehicleRow,
} from '@/types/database';

function formatSupabaseError(context: string, error: { message: string }) {
  return new Error(`${context}: ${error.message}`);
}

function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    make: row.make ?? null,
    model: row.model ?? null,
    bodyType: row.body_type ?? null,
    overview: row.overview ?? null,
    bestFor: row.best_for ?? null,
    fuelType: row.fuel_type ?? null,
    engineCC: row.engine_cc ?? null,
    thumbnailUrl: row.thumbnail_url ?? null,
    chassis: row.chassis ?? null,
  };
}

function mapVehicleChassisGroup(row: VehicleChassisGroupRow): VehicleChassisGroup {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    groupCode: row.group_code,
    displayName: row.display_name,
    chassisCode: row.chassis_code ?? null,
    fuelType: row.fuel_type ?? null,
    transmission: row.transmission ?? null,
    drivetrain: row.drivetrain ?? null,
    engineCCMin: row.engine_cc_min ?? null,
    engineCCMax: row.engine_cc_max ?? null,
    yearStart: row.year_start ?? null,
    yearEnd: row.year_end ?? null,
    marketFocus: row.market_focus,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapVehicleGrade(row: VehicleGradeRow): VehicleGrade {
  return {
    id: row.id,
    chassisGroupId: row.chassis_group_id,
    name: row.name,
    positioningSummary: row.positioning_summary ?? null,
    bestFor: row.best_for ?? null,
    engineCC: row.engine_cc ?? null,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapGradeFeature(row: GradeFeatureRow): GradeFeature {
  return {
    id: row.id,
    gradeId: row.grade_id,
    featureCategory: row.feature_category,
    featureKey: row.feature_key ?? null,
    featureLabel: row.feature_label,
    featureValue: row.feature_value ?? null,
    sortOrder: row.sort_order,
    isHighlight: row.is_highlight,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapVehicleMarketUpdate(row: VehicleMarketUpdateRow): VehicleMarketUpdate {
  return {
    id: row.id,
    vehicleId: row.vehicle_id ?? null,
    chassisGroupId: row.chassis_group_id ?? null,
    updateType: row.update_type,
    title: row.title,
    summary: row.summary,
    impactLevel: row.impact_level,
    sourceName: row.source_name ?? null,
    sourceUrl: row.source_url ?? null,
    effectiveDate: row.effective_date ?? null,
    publishedAt: row.published_at,
    isActive: row.is_active,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase.from('vehicles').select('*').order('slug', { ascending: true });

  if (error) {
    throw formatSupabaseError('Failed to fetch vehicles', error);
  }

  return (data as VehicleRow[] | null)?.map(mapVehicle) ?? [];
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { data, error } = await supabase.from('vehicles').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    throw formatSupabaseError(`Failed to fetch vehicle for slug "${slug}"`, error);
  }

  return data ? mapVehicle(data as VehicleRow) : null;
}

export async function getVehicleChassisGroups(vehicleId: string): Promise<VehicleChassisGroup[]> {
  const { data, error } = await supabase
    .from('vehicle_chassis_groups')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError(`Failed to fetch chassis groups for vehicle "${vehicleId}"`, error);
  }

  return (data as VehicleChassisGroupRow[] | null)?.map(mapVehicleChassisGroup) ?? [];
}

export async function getVehicleChassisGroupsByVehicleIds(vehicleIds: string[]): Promise<VehicleChassisGroup[]> {
  if (vehicleIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('vehicle_chassis_groups')
    .select('*')
    .in('vehicle_id', vehicleIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError('Failed to fetch chassis groups for vehicle collection', error);
  }

  return (data as VehicleChassisGroupRow[] | null)?.map(mapVehicleChassisGroup) ?? [];
}

export async function getVehicleGrades(chassisGroupId: string): Promise<VehicleGrade[]> {
  const { data, error } = await supabase
    .from('vehicle_grades')
    .select('*')
    .eq('chassis_group_id', chassisGroupId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError(`Failed to fetch grades for chassis group "${chassisGroupId}"`, error);
  }

  return (data as VehicleGradeRow[] | null)?.map(mapVehicleGrade) ?? [];
}

export async function getVehicleGradesByChassisGroupIds(chassisGroupIds: string[]): Promise<VehicleGrade[]> {
  if (chassisGroupIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('vehicle_grades')
    .select('*')
    .in('chassis_group_id', chassisGroupIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError('Failed to fetch grades for chassis group collection', error);
  }

  return (data as VehicleGradeRow[] | null)?.map(mapVehicleGrade) ?? [];
}

export async function getGradeFeatures(gradeId: string): Promise<GradeFeature[]> {
  const { data, error } = await supabase
    .from('grade_features')
    .select('*')
    .eq('grade_id', gradeId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError(`Failed to fetch features for grade "${gradeId}"`, error);
  }

  return (data as GradeFeatureRow[] | null)?.map(mapGradeFeature) ?? [];
}

export async function getGradeFeaturesByGradeIds(gradeIds: string[]): Promise<GradeFeature[]> {
  if (gradeIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('grade_features')
    .select('*')
    .in('grade_id', gradeIds)
    .order('sort_order', { ascending: true });

  if (error) {
    throw formatSupabaseError('Failed to fetch features for grade collection', error);
  }

  return (data as GradeFeatureRow[] | null)?.map(mapGradeFeature) ?? [];
}

export async function getVehicleMarketUpdates(vehicleId: string): Promise<VehicleMarketUpdate[]> {
  const { data, error } = await supabase
    .from('vehicle_market_updates')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) {
    throw formatSupabaseError(`Failed to fetch market updates for vehicle "${vehicleId}"`, error);
  }

  return (data as VehicleMarketUpdateRow[] | null)?.map(mapVehicleMarketUpdate) ?? [];
}

export async function getChassisGroupMarketUpdates(chassisGroupId: string): Promise<VehicleMarketUpdate[]> {
  const { data, error } = await supabase
    .from('vehicle_market_updates')
    .select('*')
    .eq('chassis_group_id', chassisGroupId)
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) {
    throw formatSupabaseError(`Failed to fetch market updates for chassis group "${chassisGroupId}"`, error);
  }

  return (data as VehicleMarketUpdateRow[] | null)?.map(mapVehicleMarketUpdate) ?? [];
}
