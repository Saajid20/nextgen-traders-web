import type {
  GradeFeatureInput,
  VehicleChassisGroupInput,
  VehicleGradeInput,
  VehicleMarketUpdateInput,
  VehiclePayload,
} from '@/types/catalog-ingestion';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, field: string) {
  if (typeof value !== 'string') {
    throw new Error(`${field} must be a string.`);
  }
}

function assertNonEmptyString(value: unknown, field: string) {
  assertString(value, field);
  const stringValue = value as string;

  if (!stringValue.trim()) {
    throw new Error(`${field} is required.`);
  }
}

function assertOptionalString(value: unknown, field: string) {
  if (value !== undefined && value !== null && typeof value !== 'string') {
    throw new Error(`${field} must be a string when provided.`);
  }
}

function assertOptionalNumber(value: unknown, field: string) {
  if (value !== undefined && value !== null && typeof value !== 'number') {
    throw new Error(`${field} must be a number when provided.`);
  }
}

function assertOptionalBoolean(value: unknown, field: string) {
  if (value !== undefined && value !== null && typeof value !== 'boolean') {
    throw new Error(`${field} must be a boolean when provided.`);
  }
}

function assertOptionalStringArray(value: unknown, field: string) {
  if (value === undefined || value === null) {
    return;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`${field} must be an array of strings when provided.`);
  }
}

function assertArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`);
  }
}

function assertNonEmptyArray(value: unknown, field: string) {
  assertArray(value, field);
  const arrayValue = value as unknown[];

  if (arrayValue.length === 0) {
    throw new Error(`${field} must contain at least one item.`);
  }
}

function assertUniqueValues<T>(items: T[], getKey: (item: T) => string, context: string) {
  const seen = new Set<string>();

  for (const item of items) {
    const key = getKey(item);

    if (seen.has(key)) {
      throw new Error(`Duplicate ${context}: ${key}`);
    }

    seen.add(key);
  }
}

function buildMarketUpdateKey(update: Pick<VehicleMarketUpdateInput, 'title' | 'updateType'>) {
  return `${update.updateType ?? 'market_note'}::${update.title.trim().toLowerCase()}`;
}

function assertFeature(feature: unknown, gradeName: string): asserts feature is GradeFeatureInput {
  if (!isRecord(feature)) {
    throw new Error(`Feature entries in grade "${gradeName}" must be objects.`);
  }

  assertOptionalString(feature.id, `Feature id in grade "${gradeName}"`);
  assertOptionalString(feature.featureCategory, `Feature category in grade "${gradeName}"`);
  assertOptionalString(feature.featureKey, `Feature key in grade "${gradeName}"`);
  assertNonEmptyString(feature.featureLabel, `Feature label in grade "${gradeName}"`);
  assertOptionalString(feature.featureValue, `Feature value in grade "${gradeName}"`);
  assertOptionalNumber(feature.sortOrder, `Feature sortOrder in grade "${gradeName}"`);
  assertOptionalBoolean(feature.isHighlight, `Feature isHighlight in grade "${gradeName}"`);
}

function assertGrade(grade: unknown, groupCode: string): asserts grade is VehicleGradeInput {
  if (!isRecord(grade)) {
    throw new Error(`Grade entries in chassis group "${groupCode}" must be objects.`);
  }

  assertOptionalString(grade.id, `Grade id in chassis group "${groupCode}"`);
  assertNonEmptyString(grade.name, `Grade name in chassis group "${groupCode}"`);
  assertOptionalString(grade.positioningSummary, `Grade positioningSummary in grade "${String(grade.name ?? '')}"`);
  assertOptionalString(grade.bestFor, `Grade bestFor in grade "${String(grade.name ?? '')}"`);
  assertOptionalNumber(grade.engineCC, `Grade engineCC in grade "${String(grade.name ?? '')}"`);
  assertOptionalNumber(grade.sortOrder, `Grade sortOrder in grade "${String(grade.name ?? '')}"`);
  assertOptionalBoolean(grade.isActive, `Grade isActive in grade "${String(grade.name ?? '')}"`);

  const typedGrade = grade as VehicleGradeInput;

  if (
    typedGrade.positioningSummary !== undefined &&
    typedGrade.positioningSummary !== null &&
    !typedGrade.positioningSummary.trim()
  ) {
    throw new Error(`Grade positioningSummary cannot be blank in grade "${typedGrade.name}".`);
  }

  if (typedGrade.bestFor !== undefined && typedGrade.bestFor !== null && !typedGrade.bestFor.trim()) {
    throw new Error(`Grade bestFor cannot be blank in grade "${typedGrade.name}".`);
  }

  if (typedGrade.features === undefined) {
    throw new Error(`Grade "${typedGrade.name}" must include a features array.`);
  }

  assertNonEmptyArray(typedGrade.features, `Features in grade "${typedGrade.name}"`);
  const features = typedGrade.features as unknown[];
  features.forEach((feature) => assertFeature(feature, typedGrade.name));
  assertUniqueValues(
    typedGrade.features,
    (feature) => feature.featureLabel.trim().toLowerCase(),
    `feature label in grade ${typedGrade.name}`
  );
}

function assertMarketUpdate(
  update: unknown,
  context: string
): asserts update is VehicleMarketUpdateInput {
  if (!isRecord(update)) {
    throw new Error(`${context} must be an object.`);
  }

  assertOptionalString(update.id, `${context} id`);
  assertOptionalString(update.updateType, `${context} updateType`);
  assertNonEmptyString(update.title, `${context} title`);
  assertNonEmptyString(update.summary, `${context} summary`);
  assertOptionalString(update.impactLevel, `${context} impactLevel`);
  assertOptionalString(update.sourceName, `${context} sourceName`);
  assertOptionalString(update.sourceUrl, `${context} sourceUrl`);
  assertOptionalString(update.effectiveDate, `${context} effectiveDate`);
  assertOptionalString(update.publishedAt, `${context} publishedAt`);
  assertOptionalBoolean(update.isActive, `${context} isActive`);
  assertOptionalStringArray(update.tags, `${context} tags`);
}

function assertChassisGroup(chassisGroup: unknown): asserts chassisGroup is VehicleChassisGroupInput {
  if (!isRecord(chassisGroup)) {
    throw new Error('Chassis group entries must be objects.');
  }

  assertOptionalString(chassisGroup.id, 'Chassis group id');
  assertNonEmptyString(chassisGroup.groupCode, 'Chassis group groupCode');
  assertNonEmptyString(chassisGroup.displayName, 'Chassis group displayName');
  assertOptionalString(chassisGroup.chassisCode, `Chassis code in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalString(chassisGroup.fuelType, `Fuel type in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalString(chassisGroup.transmission, `Transmission in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalString(chassisGroup.drivetrain, `Drivetrain in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalNumber(chassisGroup.engineCCMin, `engineCCMin in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalNumber(chassisGroup.engineCCMax, `engineCCMax in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalNumber(chassisGroup.yearStart, `yearStart in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalNumber(chassisGroup.yearEnd, `yearEnd in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalString(chassisGroup.marketFocus, `marketFocus in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalNumber(chassisGroup.sortOrder, `sortOrder in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalBoolean(chassisGroup.isActive, `isActive in group "${String(chassisGroup.groupCode ?? '')}"`);
  assertOptionalString(chassisGroup.notes, `notes in group "${String(chassisGroup.groupCode ?? '')}"`);

  const typedChassisGroup = chassisGroup as VehicleChassisGroupInput;

  if (typedChassisGroup.grades === undefined) {
    throw new Error(`Chassis group "${typedChassisGroup.groupCode}" must include a grades array.`);
  }

  assertNonEmptyArray(typedChassisGroup.grades, `Grades in chassis group "${typedChassisGroup.groupCode}"`);
  const grades = typedChassisGroup.grades as unknown[];
  grades.forEach((grade) => assertGrade(grade, typedChassisGroup.groupCode));
  assertUniqueValues(
    typedChassisGroup.grades,
    (grade) => grade.name.trim().toLowerCase(),
    `grade name in chassis group ${typedChassisGroup.groupCode}`
  );

  if (typedChassisGroup.marketUpdates !== undefined) {
    assertArray(
      typedChassisGroup.marketUpdates,
      `Market updates in chassis group "${typedChassisGroup.groupCode}"`
    );
    const updates = typedChassisGroup.marketUpdates as unknown[];
    updates.forEach((update) =>
      assertMarketUpdate(update, `Market update in chassis group "${typedChassisGroup.groupCode}"`)
    );
    assertUniqueValues(
      typedChassisGroup.marketUpdates,
      buildMarketUpdateKey,
      `market update in chassis group ${typedChassisGroup.groupCode}`
    );
  }
}

export function validateVehiclePayload(payload: VehiclePayload) {
  if (!isRecord(payload)) {
    throw new Error('Vehicle payload must be an object.');
  }

  if (!isRecord(payload.vehicle)) {
    throw new Error('Vehicle payload requires a vehicle object.');
  }

  assertOptionalString(payload.vehicle.id, 'Vehicle id');
  assertNonEmptyString(payload.vehicle.slug, 'Vehicle slug');
  assertNonEmptyString(payload.vehicle.make, 'Vehicle make');
  assertNonEmptyString(payload.vehicle.model, 'Vehicle model');
  assertNonEmptyString(payload.vehicle.bodyType, 'Vehicle bodyType');
  assertNonEmptyString(payload.vehicle.overview, 'Vehicle overview');
  assertNonEmptyString(payload.vehicle.bestFor, 'Vehicle bestFor');
  assertOptionalString(payload.vehicle.make, 'Vehicle make');
  assertOptionalString(payload.vehicle.model, 'Vehicle model');
  assertOptionalString(payload.vehicle.bodyType, 'Vehicle bodyType');
  assertOptionalString(payload.vehicle.overview, 'Vehicle overview');
  assertOptionalString(payload.vehicle.bestFor, 'Vehicle bestFor');
  assertOptionalString(payload.vehicle.fuelType, 'Vehicle fuelType');
  assertOptionalNumber(payload.vehicle.engineCC, 'Vehicle engineCC');
  assertOptionalString(payload.vehicle.thumbnailUrl, 'Vehicle thumbnailUrl');
  assertOptionalString(payload.vehicle.chassis, 'Vehicle chassis');

  if (payload.chassisGroups === undefined) {
    throw new Error('Vehicle payload must include a chassisGroups array.');
  }

  assertNonEmptyArray(payload.chassisGroups, 'chassisGroups');
  const chassisGroups = payload.chassisGroups as unknown[];
  chassisGroups.forEach((chassisGroup) => assertChassisGroup(chassisGroup));
  assertUniqueValues(
    payload.chassisGroups,
    (group) => group.groupCode.trim().toLowerCase(),
    'chassis group code'
  );

  if (payload.marketUpdates !== undefined) {
    assertArray(payload.marketUpdates, 'marketUpdates');
    const updates = payload.marketUpdates as unknown[];
    updates.forEach((update) => assertMarketUpdate(update, 'Vehicle market update'));
    assertUniqueValues(payload.marketUpdates, buildMarketUpdateKey, 'vehicle market update');
  }
}

export function parseVehiclePayloadJson(payloadText: string): VehiclePayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payloadText);
  } catch (error) {
    throw new Error(error instanceof Error ? `Invalid JSON: ${error.message}` : 'Invalid JSON payload.');
  }

  validateVehiclePayload(parsed as VehiclePayload);
  return parsed as VehiclePayload;
}
