'use server';

import { upsertVehicleCatalog } from '@/lib/catalog/catalog-service';
import { parseVehiclePayloadJson } from '@/lib/catalog/payload-validation';

export type CatalogIngestionActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
  result: {
    vehicleId: string;
    chassisGroupIds: string[];
    gradeIds: string[];
    gradeFeatureIds: string[];
    marketUpdateIds: string[];
  } | null;
};

export const initialCatalogIngestionState: CatalogIngestionActionState = {
  status: 'idle',
  message: null,
  result: null,
};

export async function submitCatalogIngestion(
  _previousState: CatalogIngestionActionState,
  formData: FormData
): Promise<CatalogIngestionActionState> {
  const payloadText = formData.get('payload');

  if (typeof payloadText !== 'string' || !payloadText.trim()) {
    return {
      status: 'error',
      message: 'Paste a vehicle payload JSON document before submitting.',
      result: null,
    };
  }

  try {
    const payload = parseVehiclePayloadJson(payloadText);
    const result = await upsertVehicleCatalog(payload);

    return {
      status: 'success',
      message: `Catalog payload processed successfully for slug "${payload.vehicle.slug}".`,
      result,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown ingestion error.',
      result: null,
    };
  }
}
