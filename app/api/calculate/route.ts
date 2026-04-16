import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cifJPY, engineCC, fuelType, ageYears, exchangeRate = 2.0, includeSSCL = false } = body;

    const baseValueLKR = cifJPY * exchangeRate;

    // 1. CID & Surcharge (20% Base + 50% Surcharge = Effective 30%)
    const cidBase = baseValueLKR * 0.20;
    const cidSurcharge = cidBase * 0.50;
    const totalCid = cidBase + cidSurcharge;

    // 2. Comprehensive XID Logic
    let exciseDuty = 0;

    switch (fuelType) {
      case "Petrol":
        if (engineCC < 1000) exciseDuty = Math.max(engineCC * 2450, 1992000);
        else if (engineCC < 1300) exciseDuty = engineCC * 3850;
        else if (engineCC < 1500) exciseDuty = engineCC * 4450;
        else if (engineCC < 1600) exciseDuty = engineCC * 5150;
        else if (engineCC < 1800) exciseDuty = engineCC * 6400;
        else if (engineCC < 2000) exciseDuty = engineCC * 7700;
        else if (engineCC < 2500) exciseDuty = engineCC * 8450;
        else if (engineCC < 2750) exciseDuty = engineCC * 9650;
        else if (engineCC < 3000) exciseDuty = engineCC * 10850;
        else if (engineCC < 4000) exciseDuty = engineCC * 12050;
        else exciseDuty = engineCC * 13300;
        break;

      case "Diesel":
        if (engineCC < 1500) exciseDuty = Math.max(engineCC * 5550, 5550000);
        else if (engineCC < 1600) exciseDuty = engineCC * 6950;
        else if (engineCC < 1800) exciseDuty = engineCC * 8300;
        else if (engineCC < 2000) exciseDuty = engineCC * 9650;
        else if (engineCC < 2500) exciseDuty = engineCC * 10850;
        else if (engineCC < 2750) exciseDuty = engineCC * 12050;
        else if (engineCC < 3000) exciseDuty = engineCC * 13300;
        else if (engineCC < 4000) exciseDuty = engineCC * 13300; 
        else exciseDuty = engineCC * 14500;
        break;

      case "Petrol Hybrid":
        if (engineCC <= 1000) exciseDuty = 1810900; 
        else if (engineCC < 1300) exciseDuty = engineCC * 2750;
        else if (engineCC < 1500) exciseDuty = engineCC * 3450;
        else if (engineCC < 1600) exciseDuty = engineCC * 4800;
        else if (engineCC < 1800) exciseDuty = engineCC * 6250;
        else if (engineCC < 2000) exciseDuty = engineCC * 6900;
        else if (engineCC < 2500) exciseDuty = engineCC * 7250;
        else if (engineCC < 2750) exciseDuty = engineCC * 8450;
        else if (engineCC < 3000) exciseDuty = engineCC * 9650;
        else if (engineCC < 4000) exciseDuty = engineCC * 10850;
        else exciseDuty = engineCC * 12050;
        break;

      case "Diesel Hybrid":
        if (engineCC < 1000) exciseDuty = engineCC * 4150;
        else if (engineCC < 1500) exciseDuty = engineCC * 4150;
        else if (engineCC < 1600) exciseDuty = engineCC * 5550;
        else if (engineCC < 1800) exciseDuty = engineCC * 6900;
        else if (engineCC < 2000) exciseDuty = engineCC * 8350;
        else if (engineCC < 2500) exciseDuty = engineCC * 8450;
        else if (engineCC < 2750) exciseDuty = engineCC * 9650;
        else if (engineCC < 3000) exciseDuty = engineCC * 10850;
        else if (engineCC < 4000) exciseDuty = engineCC * 12050;
        else exciseDuty = engineCC * 13300;
        break;

      case "Plug-in Hybrid - Petrol":
        if (engineCC <= 1000) exciseDuty = 0; 
        else if (engineCC < 1300) exciseDuty = engineCC * 2750;
        else if (engineCC < 1500) exciseDuty = engineCC * 3450;
        else if (engineCC < 1600) exciseDuty = engineCC * 4800;
        else if (engineCC < 1800) exciseDuty = engineCC * 6250;
        else if (engineCC < 2000) exciseDuty = engineCC * 6900;
        else if (engineCC < 2500) exciseDuty = engineCC * 7250;
        else if (engineCC < 2750) exciseDuty = engineCC * 8450;
        else if (engineCC < 3000) exciseDuty = engineCC * 9650;
        else if (engineCC < 4000) exciseDuty = engineCC * 10850;
        else exciseDuty = engineCC * 12050;
        break;

      case "Plug-in Hybrid - Diesel":
        if (engineCC < 1000) exciseDuty = engineCC * 4150;
        else if (engineCC < 1500) exciseDuty = engineCC * 4150;
        else if (engineCC < 1600) exciseDuty = engineCC * 5550;
        else if (engineCC < 1800) exciseDuty = engineCC * 6900;
        else if (engineCC < 2000) exciseDuty = engineCC * 8300;
        else if (engineCC < 2500) exciseDuty = engineCC * 8450;
        else if (engineCC < 2750) exciseDuty = engineCC * 9650;
        else if (engineCC < 3000) exciseDuty = engineCC * 10850;
        else if (engineCC < 4000) exciseDuty = engineCC * 12050;
        else exciseDuty = engineCC * 13300;
        break;

      case "Electric":
        if (ageYears === 1) {
          exciseDuty = engineCC < 50 ? engineCC * 18100 : engineCC < 100 ? engineCC * 24100 : engineCC < 200 ? engineCC * 36200 : engineCC * 96600;
        } else if (ageYears === 2) {
          exciseDuty = engineCC < 50 ? engineCC * 36200 : engineCC < 100 ? engineCC * 36200 : engineCC < 200 ? engineCC * 60400 : engineCC * 132800;
        } else {
          exciseDuty = engineCC < 50 ? engineCC * 48300 : engineCC < 100 ? engineCC * 72400 : engineCC < 200 ? engineCC * 108700 : engineCC * 144900;
        }
        break;

      case "E-SMART Hybrid":
        if (ageYears === 1) {
          exciseDuty = engineCC < 50 ? engineCC * 30770 : engineCC < 100 ? engineCC * 40970 : engineCC < 200 ? engineCC * 41630 : engineCC * 111090;
        } else {
          exciseDuty = engineCC < 50 ? engineCC * 43440 : engineCC < 100 ? engineCC * 43440 : engineCC < 200 ? engineCC * 63420 : engineCC * 139440;
        }
        break;

      default:
        exciseDuty = 0;
    }

    // 3. SSCL (2.5%) - NOW TOGGLEABLE
    const sscl = includeSSCL ? (baseValueLKR + totalCid + exciseDuty) * 0.025 : 0;

    // 4. Luxury Tax
    let lxtThreshold = 5000000;
    if (fuelType.includes("Hybrid")) lxtThreshold = 5500000;
    if (fuelType === "Electric" || fuelType === "E-SMART Hybrid") lxtThreshold = 6000000;
    
    const luxuryTax = baseValueLKR > lxtThreshold ? (baseValueLKR - lxtThreshold) * 1.0 : 0;

    // 5. VAT (18% on Uplifted Base)
    const vat = ((baseValueLKR * 1.1) + totalCid + exciseDuty + sscl) * 0.18;

    const totalTaxes = totalCid + exciseDuty + sscl + luxuryTax + vat;

    return NextResponse.json({
      baseValueLKR,
      exchangeRate,
      cidBase,
      cidSurcharge,
      totalCid,
      exciseDuty,
      sscl,
      luxuryTax,
      vat,
      totalTaxes,
      finalLandedCost: baseValueLKR + totalTaxes,
    });
  } catch  {
    return NextResponse.json({ error: "Calculation failed due to an internal server error." }, { status: 500 });
  }
}