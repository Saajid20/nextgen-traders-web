export type VehicleRow = {
  id: string;
  slug: string;
  make: string | null;
  model: string | null;
  body_type: string | null;
  overview: string | null;
  best_for: string | null;
  fuel_type: string | null;
  engine_cc: number | null;
  thumbnail_url: string | null;
  chassis: string | null;
};

export type VehicleChassisGroupRow = {
  id: string;
  vehicle_id: string;
  group_code: string;
  display_name: string;
  chassis_code: string | null;
  fuel_type: string | null;
  transmission: string | null;
  drivetrain: string | null;
  engine_cc_min: number | null;
  engine_cc_max: number | null;
  year_start: number | null;
  year_end: number | null;
  market_focus: string;
  sort_order: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type VehicleGradeRow = {
  id: string;
  chassis_group_id: string;
  name: string;
  positioning_summary: string | null;
  best_for: string | null;
  engine_cc: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vehicle_id?: string | null;
  features?: string[] | null;
};

export type GradeFeatureRow = {
  id: string;
  grade_id: string;
  feature_category: string;
  feature_key: string | null;
  feature_label: string;
  feature_value: string | null;
  sort_order: number;
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
};

export type VehicleMarketUpdateRow = {
  id: string;
  vehicle_id: string | null;
  chassis_group_id: string | null;
  update_type: string;
  title: string;
  summary: string;
  impact_level: string;
  source_name: string | null;
  source_url: string | null;
  effective_date: string | null;
  published_at: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  slug: string;
  make: string | null;
  model: string | null;
  bodyType: string | null;
  overview: string | null;
  bestFor: string | null;
  fuelType: string | null;
  engineCC: number | null;
  thumbnailUrl: string | null;
  chassis: string | null;
};

export type VehicleChassisGroup = {
  id: string;
  vehicleId: string;
  groupCode: string;
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
  sortOrder: number;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VehicleGrade = {
  id: string;
  chassisGroupId: string;
  name: string;
  positioningSummary: string | null;
  bestFor: string | null;
  engineCC: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GradeFeature = {
  id: string;
  gradeId: string;
  featureCategory: string;
  featureKey: string | null;
  featureLabel: string;
  featureValue: string | null;
  sortOrder: number;
  isHighlight: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VehicleMarketUpdate = {
  id: string;
  vehicleId: string | null;
  chassisGroupId: string | null;
  updateType: string;
  title: string;
  summary: string;
  impactLevel: string;
  sourceName: string | null;
  sourceUrl: string | null;
  effectiveDate: string | null;
  publishedAt: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
