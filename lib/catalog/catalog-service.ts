import { validateVehiclePayload } from '@/lib/catalog/payload-validation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type {
  GradeFeatureInput,
  VehiclePayload,
  VehicleCatalogSyncResult,
  VehicleChassisGroupInput,
  VehicleGradeInput,
  VehicleInput,
  VehicleMarketUpdateInput,
} from '@/types/catalog-ingestion';

type VehicleRecord = {
  id: string;
  slug: string;
};

type ChassisGroupRecord = {
  id: string;
  vehicle_id: string;
  group_code: string;
};

type GradeRecord = {
  id: string;
  chassis_group_id: string;
  name: string;
};

type GradeFeatureRecord = {
  id: string;
  grade_id: string;
  feature_label: string;
};

type MarketUpdateRecord = {
  id: string;
  vehicle_id: string | null;
  chassis_group_id: string | null;
  update_type: string;
  title: string;
};

function toNullableText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeTags(tags?: string[]) {
  return tags?.map((tag) => tag.trim()).filter(Boolean) ?? [];
}

async function upsertVehicleRecord(vehicle: VehicleInput): Promise<VehicleRecord> {
  const row = {
    slug: vehicle.slug.trim(),
    make: toNullableText(vehicle.make),
    model: toNullableText(vehicle.model),
    body_type: toNullableText(vehicle.bodyType),
    overview: toNullableText(vehicle.overview),
    best_for: toNullableText(vehicle.bestFor),
    fuel_type: toNullableText(vehicle.fuelType),
    engine_cc: vehicle.engineCC ?? null,
    thumbnail_url: toNullableText(vehicle.thumbnailUrl),
    chassis: toNullableText(vehicle.chassis),
  };

  if (vehicle.id) {
    const { data, error } = await supabaseAdmin
      .from('vehicles')
      .update(row)
      .eq('id', vehicle.id)
      .select('id, slug')
      .single();

    if (error) {
      throw new Error(`Failed to update vehicle "${vehicle.slug}": ${error.message}`);
    }

    return data as VehicleRecord;
  }

  const { data, error } = await supabaseAdmin
    .from('vehicles')
    .upsert(row, { onConflict: 'slug' })
    .select('id, slug')
    .single();

  if (error) {
    throw new Error(`Failed to upsert vehicle "${vehicle.slug}": ${error.message}`);
  }

  return data as VehicleRecord;
}

async function upsertChassisGroupRecord(vehicleId: string, chassisGroup: VehicleChassisGroupInput, sortOrder: number) {
  const row = {
    vehicle_id: vehicleId,
    group_code: chassisGroup.groupCode.trim(),
    display_name: chassisGroup.displayName.trim(),
    chassis_code: toNullableText(chassisGroup.chassisCode),
    fuel_type: toNullableText(chassisGroup.fuelType),
    transmission: toNullableText(chassisGroup.transmission),
    drivetrain: toNullableText(chassisGroup.drivetrain),
    engine_cc_min: chassisGroup.engineCCMin ?? null,
    engine_cc_max: chassisGroup.engineCCMax ?? null,
    year_start: chassisGroup.yearStart ?? null,
    year_end: chassisGroup.yearEnd ?? null,
    market_focus: chassisGroup.marketFocus?.trim() || 'Sri Lanka imports',
    sort_order: chassisGroup.sortOrder ?? sortOrder,
    is_active: chassisGroup.isActive ?? true,
    notes: toNullableText(chassisGroup.notes),
  };

  if (chassisGroup.id) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_chassis_groups')
      .update(row)
      .eq('id', chassisGroup.id)
      .select('id, vehicle_id, group_code')
      .single();

    if (error) {
      throw new Error(`Failed to update chassis group "${chassisGroup.groupCode}": ${error.message}`);
    }

    return data as ChassisGroupRecord;
  }

  const { data, error } = await supabaseAdmin
    .from('vehicle_chassis_groups')
    .upsert(row, { onConflict: 'vehicle_id,group_code' })
    .select('id, vehicle_id, group_code')
    .single();

  if (error) {
    throw new Error(`Failed to upsert chassis group "${chassisGroup.groupCode}": ${error.message}`);
  }

  return data as ChassisGroupRecord;
}

async function upsertVehicleGradeRecord(
  chassisGroupId: string,
  grade: VehicleGradeInput,
  sortOrder: number
): Promise<GradeRecord> {
  const row = {
    chassis_group_id: chassisGroupId,
    name: grade.name.trim(),
    positioning_summary: toNullableText(grade.positioningSummary),
    best_for: toNullableText(grade.bestFor),
    engine_cc: grade.engineCC ?? null,
    sort_order: grade.sortOrder ?? sortOrder,
    is_active: grade.isActive ?? true,
  };

  if (grade.id) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_grades')
      .update(row)
      .eq('id', grade.id)
      .select('id, chassis_group_id, name')
      .single();

    if (error) {
      throw new Error(`Failed to update grade "${grade.name}": ${error.message}`);
    }

    return data as GradeRecord;
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('vehicle_grades')
    .select('id, chassis_group_id, name')
    .eq('chassis_group_id', chassisGroupId)
    .eq('name', grade.name.trim())
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to look up existing grade "${grade.name}": ${existingError.message}`);
  }

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_grades')
      .update(row)
      .eq('id', existing.id)
      .select('id, chassis_group_id, name')
      .single();

    if (error) {
      throw new Error(`Failed to update grade "${grade.name}": ${error.message}`);
    }

    return data as GradeRecord;
  }

  const { data, error } = await supabaseAdmin
    .from('vehicle_grades')
    .insert(row)
    .select('id, chassis_group_id, name')
    .single();

  if (error) {
    throw new Error(`Failed to insert grade "${grade.name}": ${error.message}`);
  }

  return data as GradeRecord;
}

async function syncGradeFeatures(gradeId: string, features?: GradeFeatureInput[]) {
  if (features === undefined) {
    return [];
  }

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from('grade_features')
    .select('id, grade_id, feature_label')
    .eq('grade_id', gradeId);

  if (existingError) {
    throw new Error(`Failed to fetch existing features for grade "${gradeId}": ${existingError.message}`);
  }

  const existingFeatures = (existingRows as GradeFeatureRecord[] | null) ?? [];
  const keptFeatureIds: string[] = [];

  for (const [index, feature] of features.entries()) {
    const row = {
      grade_id: gradeId,
      feature_category: feature.featureCategory?.trim() || 'general',
      feature_key: toNullableText(feature.featureKey),
      feature_label: feature.featureLabel.trim(),
      feature_value: toNullableText(feature.featureValue),
      sort_order: feature.sortOrder ?? index,
      is_highlight: feature.isHighlight ?? false,
    };

    if (feature.id) {
      const { data, error } = await supabaseAdmin
        .from('grade_features')
        .update(row)
        .eq('id', feature.id)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to update feature "${feature.featureLabel}": ${error.message}`);
      }

      keptFeatureIds.push((data as { id: string }).id);
      continue;
    }

    const { data, error } = await supabaseAdmin
      .from('grade_features')
      .upsert(row, { onConflict: 'grade_id,feature_label' })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to upsert feature "${feature.featureLabel}": ${error.message}`);
    }

    keptFeatureIds.push((data as { id: string }).id);
  }

  const staleFeatureIds = existingFeatures.map((feature) => feature.id).filter((id) => !keptFeatureIds.includes(id));

  if (staleFeatureIds.length > 0) {
    const { error } = await supabaseAdmin.from('grade_features').delete().in('id', staleFeatureIds);

    if (error) {
      throw new Error(`Failed to remove stale grade features for "${gradeId}": ${error.message}`);
    }
  }

  return keptFeatureIds;
}

async function syncVehicleGrades(chassisGroupId: string, grades?: VehicleGradeInput[]) {
  if (grades === undefined) {
    return {
      gradeIds: [],
      featureIds: [],
    };
  }

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from('vehicle_grades')
    .select('id, chassis_group_id, name')
    .eq('chassis_group_id', chassisGroupId);

  if (existingError) {
    throw new Error(`Failed to fetch existing grades for chassis group "${chassisGroupId}": ${existingError.message}`);
  }

  const existingGrades = (existingRows as GradeRecord[] | null) ?? [];
  const keptGradeIds: string[] = [];
  const featureIds: string[] = [];

  for (const [index, grade] of grades.entries()) {
    const upsertedGrade = await upsertVehicleGradeRecord(chassisGroupId, grade, index);
    keptGradeIds.push(upsertedGrade.id);

    const gradeFeatureIds = await syncGradeFeatures(upsertedGrade.id, grade.features);
    featureIds.push(...gradeFeatureIds);
  }

  const staleGradeIds = existingGrades.map((grade) => grade.id).filter((id) => !keptGradeIds.includes(id));

  if (staleGradeIds.length > 0) {
    const { error } = await supabaseAdmin.from('vehicle_grades').delete().in('id', staleGradeIds);

    if (error) {
      throw new Error(`Failed to remove stale grades for chassis group "${chassisGroupId}": ${error.message}`);
    }
  }

  return {
    gradeIds: keptGradeIds,
    featureIds,
  };
}

async function upsertMarketUpdateRecord(
  update: VehicleMarketUpdateInput,
  scope: { vehicleId: string | null; chassisGroupId: string | null }
): Promise<{ id: string }> {
  const row = {
    vehicle_id: scope.vehicleId,
    chassis_group_id: scope.chassisGroupId,
    update_type: update.updateType?.trim() || 'market_note',
    title: update.title.trim(),
    summary: update.summary.trim(),
    impact_level: update.impactLevel?.trim() || 'info',
    source_name: toNullableText(update.sourceName),
    source_url: toNullableText(update.sourceUrl),
    effective_date: update.effectiveDate ?? null,
    published_at: update.publishedAt ?? new Date().toISOString(),
    is_active: update.isActive ?? true,
    tags: normalizeTags(update.tags),
  };

  if (update.id) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_market_updates')
      .update(row)
      .eq('id', update.id)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to update market update "${update.title}": ${error.message}`);
    }

    return data as { id: string };
  }

  let existingQuery = supabaseAdmin
    .from('vehicle_market_updates')
    .select('id, vehicle_id, chassis_group_id, update_type, title')
    .eq('update_type', row.update_type)
    .eq('title', row.title);

  existingQuery = scope.vehicleId ? existingQuery.eq('vehicle_id', scope.vehicleId) : existingQuery.is('vehicle_id', null);
  existingQuery = scope.chassisGroupId
    ? existingQuery.eq('chassis_group_id', scope.chassisGroupId)
    : existingQuery.is('chassis_group_id', null);

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();

  if (existingError) {
    throw new Error(`Failed to look up market update "${update.title}": ${existingError.message}`);
  }

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('vehicle_market_updates')
      .update(row)
      .eq('id', existing.id)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to update market update "${update.title}": ${error.message}`);
    }

    return data as { id: string };
  }

  const { data, error } = await supabaseAdmin
    .from('vehicle_market_updates')
    .insert(row)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to insert market update "${update.title}": ${error.message}`);
  }

  return data as { id: string };
}

async function syncMarketUpdates(
  updates: VehicleMarketUpdateInput[] | undefined,
  scope: { vehicleId: string | null; chassisGroupId: string | null }
) {
  if (updates === undefined) {
    return [];
  }

  let query = supabaseAdmin
    .from('vehicle_market_updates')
    .select('id, vehicle_id, chassis_group_id, update_type, title');

  query = scope.vehicleId ? query.eq('vehicle_id', scope.vehicleId) : query.is('vehicle_id', null);
  query = scope.chassisGroupId ? query.eq('chassis_group_id', scope.chassisGroupId) : query.is('chassis_group_id', null);

  const { data: existingRows, error: existingError } = await query;

  if (existingError) {
    throw new Error(`Failed to fetch existing market updates: ${existingError.message}`);
  }

  const existingUpdates = (existingRows as MarketUpdateRecord[] | null) ?? [];
  const keptUpdateIds: string[] = [];

  for (const update of updates) {
    const upsertedUpdate = await upsertMarketUpdateRecord(update, scope);
    keptUpdateIds.push(upsertedUpdate.id);
  }

  const staleUpdateIds = existingUpdates.map((update) => update.id).filter((id) => !keptUpdateIds.includes(id));

  if (staleUpdateIds.length > 0) {
    const { error } = await supabaseAdmin.from('vehicle_market_updates').delete().in('id', staleUpdateIds);

    if (error) {
      throw new Error(`Failed to remove stale market updates: ${error.message}`);
    }
  }

  return keptUpdateIds;
}

async function syncVehicleChassisGroups(vehicleId: string, chassisGroups?: VehicleChassisGroupInput[]) {
  if (chassisGroups === undefined) {
    return {
      chassisGroupIds: [],
      gradeIds: [],
      featureIds: [],
      marketUpdateIds: [],
    };
  }

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from('vehicle_chassis_groups')
    .select('id, vehicle_id, group_code')
    .eq('vehicle_id', vehicleId);

  if (existingError) {
    throw new Error(`Failed to fetch existing chassis groups for vehicle "${vehicleId}": ${existingError.message}`);
  }

  const existingChassisGroups = (existingRows as ChassisGroupRecord[] | null) ?? [];
  const keptChassisGroupIds: string[] = [];
  const gradeIds: string[] = [];
  const featureIds: string[] = [];
  const marketUpdateIds: string[] = [];

  for (const [index, chassisGroup] of chassisGroups.entries()) {
    const upsertedChassisGroup = await upsertChassisGroupRecord(vehicleId, chassisGroup, index);
    keptChassisGroupIds.push(upsertedChassisGroup.id);

    const gradeResult = await syncVehicleGrades(upsertedChassisGroup.id, chassisGroup.grades);
    gradeIds.push(...gradeResult.gradeIds);
    featureIds.push(...gradeResult.featureIds);

    const chassisGroupUpdateIds = await syncMarketUpdates(chassisGroup.marketUpdates, {
      vehicleId: null,
      chassisGroupId: upsertedChassisGroup.id,
    });
    marketUpdateIds.push(...chassisGroupUpdateIds);
  }

  const staleChassisGroupIds = existingChassisGroups
    .map((chassisGroup) => chassisGroup.id)
    .filter((id) => !keptChassisGroupIds.includes(id));

  if (staleChassisGroupIds.length > 0) {
    const { error } = await supabaseAdmin.from('vehicle_chassis_groups').delete().in('id', staleChassisGroupIds);

    if (error) {
      throw new Error(`Failed to remove stale chassis groups for vehicle "${vehicleId}": ${error.message}`);
    }
  }

  return {
    chassisGroupIds: keptChassisGroupIds,
    gradeIds,
    featureIds,
    marketUpdateIds,
  };
}

export async function upsertVehicleCatalog(payload: VehiclePayload): Promise<VehicleCatalogSyncResult> {
  validateVehiclePayload(payload);

  const vehicleRecord = await upsertVehicleRecord(payload.vehicle);
  const chassisGroupResult = await syncVehicleChassisGroups(vehicleRecord.id, payload.chassisGroups);
  const vehicleMarketUpdateIds = await syncMarketUpdates(payload.marketUpdates, {
    vehicleId: vehicleRecord.id,
    chassisGroupId: null,
  });

  return {
    vehicleId: vehicleRecord.id,
    chassisGroupIds: chassisGroupResult.chassisGroupIds,
    gradeIds: chassisGroupResult.gradeIds,
    gradeFeatureIds: chassisGroupResult.featureIds,
    marketUpdateIds: [...vehicleMarketUpdateIds, ...chassisGroupResult.marketUpdateIds],
  };
}

export const upsertVehicleCatalogPayload = upsertVehicleCatalog;
