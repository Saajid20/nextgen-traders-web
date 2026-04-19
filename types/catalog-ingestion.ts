export type VehicleInput = {
  id?: string;
  slug: string;
  make?: string | null;
  model?: string | null;
  bodyType?: string | null;
  overview?: string | null;
  bestFor?: string | null;
  fuelType?: string | null;
  engineCC?: number | null;
  thumbnailUrl?: string | null;
  chassis?: string | null;
};

export type GradeFeatureInput = {
  id?: string;
  featureCategory?: string;
  featureKey?: string | null;
  featureLabel: string;
  featureValue?: string | null;
  sortOrder?: number;
  isHighlight?: boolean;
};

export type VehicleGradeInput = {
  id?: string;
  name: string;
  positioningSummary?: string | null;
  bestFor?: string | null;
  engineCC?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  features?: GradeFeatureInput[];
};

export type VehicleMarketUpdateInput = {
  id?: string;
  updateType?: string;
  title: string;
  summary: string;
  impactLevel?: string;
  sourceName?: string | null;
  sourceUrl?: string | null;
  effectiveDate?: string | null;
  publishedAt?: string | null;
  isActive?: boolean;
  tags?: string[];
};

export type VehicleChassisGroupInput = {
  id?: string;
  groupCode: string;
  displayName: string;
  chassisCode?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  engineCCMin?: number | null;
  engineCCMax?: number | null;
  yearStart?: number | null;
  yearEnd?: number | null;
  marketFocus?: string;
  sortOrder?: number;
  isActive?: boolean;
  notes?: string | null;
  grades?: VehicleGradeInput[];
  marketUpdates?: VehicleMarketUpdateInput[];
};

export type VehiclePayload = {
  vehicle: VehicleInput;
  chassisGroups?: VehicleChassisGroupInput[];
  marketUpdates?: VehicleMarketUpdateInput[];
};

export type VehicleCatalogPayload = VehiclePayload;

export type VehicleCatalogSyncResult = {
  vehicleId: string;
  chassisGroupIds: string[];
  gradeIds: string[];
  gradeFeatureIds: string[];
  marketUpdateIds: string[];
};
