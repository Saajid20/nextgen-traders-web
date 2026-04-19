'use client';

import { useActionState, useState } from 'react';
import { parseVehiclePayloadJson } from '@/lib/catalog/payload-validation';
import {
  initialCatalogIngestionState,
  submitCatalogIngestion,
  type CatalogIngestionActionState,
} from './actions';

const initialPayload = `{
  "vehicle": {
    "slug": "toyota-raize",
    "make": "Toyota",
    "model": "Raize",
    "bodyType": "SUV",
    "overview": "Compact crossover for Sri Lanka-focused import catalog testing.",
    "bestFor": "Urban buyers who want compact SUV practicality.",
    "fuelType": "Petrol",
    "engineCC": 996,
    "chassis": "A200A"
  },
  "chassisGroups": [
    {
      "groupCode": "a200a-1.0t-2wd-cvt",
      "displayName": "A200A 1.0T 2WD CVT",
      "fuelType": "Petrol",
      "transmission": "CVT",
      "drivetrain": "2WD",
      "engineCCMin": 996,
      "engineCCMax": 996,
      "grades": [
        {
          "name": "Z",
          "positioningSummary": "Well-equipped flagship grade.",
          "bestFor": "Buyers who want stronger everyday comfort and equipment.",
          "engineCC": 996,
          "features": [
            {
              "featureCategory": "safety",
              "featureLabel": "Toyota Safety Sense"
            }
          ]
        }
      ]
    }
  ]
}`;

type ValidationState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

const initialValidationState: ValidationState = {
  status: 'idle',
  message: null,
};

function ResultPanel({ state }: { state: CatalogIngestionActionState }) {
  if (state.status === 'idle' || !state.message) {
    return null;
  }

  const isSuccess = state.status === 'success';

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isSuccess ? 'border-[#013667]/15 bg-[#f4f8fc]' : 'border-[#a60000]/15 bg-[#fff5f5]'
      }`}
    >
      <p className={`text-sm font-bold uppercase tracking-[0.14em] ${isSuccess ? 'text-[#013667]' : 'text-[#a60000]'}`}>
        {isSuccess ? 'Ingestion Success' : 'Ingestion Error'}
      </p>
      <p className="mt-3 text-sm leading-7 text-[#111827]">{state.message}</p>

      {isSuccess && state.result ? (
        <dl className="mt-5 grid gap-4 text-sm text-[#111827] sm:grid-cols-2">
          <div>
            <dt className="font-bold text-[#013667]">Vehicle ID</dt>
            <dd className="mt-1 break-all">{state.result.vehicleId}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#013667]">Chassis Group IDs</dt>
            <dd className="mt-1 break-all">{state.result.chassisGroupIds.join(', ') || 'None'}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#013667]">Grade IDs</dt>
            <dd className="mt-1 break-all">{state.result.gradeIds.join(', ') || 'None'}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#013667]">Feature IDs</dt>
            <dd className="mt-1 break-all">{state.result.gradeFeatureIds.join(', ') || 'None'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-bold text-[#013667]">Market Update IDs</dt>
            <dd className="mt-1 break-all">{state.result.marketUpdateIds.join(', ') || 'None'}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}

export function CatalogIngestionForm() {
  const [payloadText, setPayloadText] = useState(initialPayload);
  const [validationState, setValidationState] = useState<ValidationState>(initialValidationState);
  const [actionState, formAction, isPending] = useActionState(submitCatalogIngestion, initialCatalogIngestionState);

  function handleValidate() {
    try {
      parseVehiclePayloadJson(payloadText);
      setValidationState({
        status: 'success',
        message: 'Payload is valid JSON and matches the current catalog ingestion structure.',
      });
    } catch (error) {
      setValidationState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown validation error.',
      });
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-3xl border border-[#D7DEE5] bg-white p-6 shadow-[0_10px_26px_rgba(1,54,103,0.05)] sm:p-8">
        <div className="flex flex-col gap-3 border-b border-[#E6EBF0] pb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#013667]">Internal Use</p>
          <h2 className="text-2xl font-black tracking-[-0.03em] text-[#013667]">Catalog Payload</h2>
          <p className="max-w-3xl text-sm leading-7 text-[#111827]">
            Paste a full `VehiclePayload` JSON document here, validate it, then run the existing catalog upsert flow.
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="payload" className="text-sm font-bold text-[#013667]">
            VehiclePayload JSON
          </label>
          <textarea
            id="payload"
            name="payload"
            value={payloadText}
            onChange={(event) => setPayloadText(event.target.value)}
            spellCheck={false}
            className="mt-3 min-h-[480px] w-full rounded-2xl border border-[#D7DEE5] px-4 py-4 font-mono text-sm leading-7 text-[#111827] outline-none transition focus:border-[#013667]"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleValidate}
            className="inline-flex items-center justify-center rounded-full border border-[#013667]/18 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#013667] transition hover:bg-[#f4f8fc]"
          >
            Validate Payload
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full bg-[#a60000] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Submitting...' : 'Run Ingestion'}
          </button>
        </div>
      </div>

      {validationState.status !== 'idle' ? (
        <div
          className={`rounded-2xl border p-5 ${
            validationState.status === 'success'
              ? 'border-[#013667]/15 bg-[#f4f8fc]'
              : 'border-[#a60000]/15 bg-[#fff5f5]'
          }`}
        >
          <p
            className={`text-sm font-bold uppercase tracking-[0.14em] ${
              validationState.status === 'success' ? 'text-[#013667]' : 'text-[#a60000]'
            }`}
          >
            {validationState.status === 'success' ? 'Validation Passed' : 'Validation Error'}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#111827]">{validationState.message}</p>
        </div>
      ) : null}

      <ResultPanel state={actionState} />
    </form>
  );
}
