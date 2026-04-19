import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/supabase/queries';

export async function GET() {
  try {
    const vehicles = await getVehicles();

    return NextResponse.json({
      ok: true,
      message: 'Supabase connection successful.',
      vehicleCount: vehicles.length,
      vehicles: vehicles.slice(0, 5),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Supabase error';

    return NextResponse.json(
      {
        ok: false,
        message: 'Supabase connection test failed.',
        error: message,
      },
      { status: 500 }
    );
  }
}
