import { NextResponse } from "next/server";
import { upsertVehicleCatalog } from "@/lib/catalog/catalog-service";
import type { VehiclePayload } from "@/types/catalog-ingestion";

export async function GET() {
  try {
    const payload: VehiclePayload = {
      vehicle: {
        make: "Test",
        model: "Test Vehicle",
        slug: "test-vehicle",
        chassis: "Test",
        bodyType: "SUV",
        overview: "A test overview of the vehicle",
        bestFor: "Testing purposes",
      },

      chassisGroups: [
        {
          groupCode: "test_group",
          displayName: "Test Group",
          grades: [
            {
              name: "Test Grade",
              sortOrder: 1,
              features: [
                {
                  featureCategory: "test",
                  featureLabel: "Test Feature",
                  featureValue: "Yes",
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await upsertVehicleCatalog(payload);

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
