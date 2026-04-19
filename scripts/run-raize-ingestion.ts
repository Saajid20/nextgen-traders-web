import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function runRaizeIngestion() {
  try {
    const { upsertVehicleCatalog } = await import('@/lib/catalog/catalog-service');
    const { raizePayload } = await import('./raize-payload');

    const result = await upsertVehicleCatalog(raizePayload);

    console.log('Raize catalog ingestion completed successfully.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Raize catalog ingestion failed.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void runRaizeIngestion();
