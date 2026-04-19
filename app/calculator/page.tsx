"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BRAND_RED = "#a60000";
const BRAND_BLUE = "#013667";

interface CalculationResult {
  baseValueLKR: number;
  totalTaxes: number;
  finalLandedCost: number;
  totalCid: number;
  exciseDuty: number;
  sscl: number;
  luxuryTax: number;
  vat: number;
}

interface LeaseCalculationResult {
  financedPrincipal: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentAmount: number;
}

type LeaseTermMonths = 36 | 60 | 84;

interface LeaseInputs {
  totalVehicleValueLKR: number;
  downPaymentPercent: number;
  annualInterestRate: number;
  leaseTermMonths: LeaseTermMonths;
}

interface LeaseEstimateParams {
  vehiclePrice: number;
  downPaymentAmount: number;
  annualInterestRate: number;
  leaseTermMonths: LeaseTermMonths;
}

interface LeaseFinanceSummary {
  downPaymentAmount: number;
  financedAmount: number;
  results: LeaseCalculationResult | null;
  validationMessage: string | null;
}

interface TaxCalculatorInputs {
  cifJPY: number;
  engineCC: number;
  fuelType: string;
  vehicleType: string;
  ageYears: number;
  exchangeRate: number;
  includeSSCL: boolean;
}

function buildInitialTaxInputs(searchParams: ReturnType<typeof useSearchParams>): TaxCalculatorInputs {
  const queryEngineCC = searchParams.get('engineCC');
  const parsedEngineCC = queryEngineCC ? Number(queryEngineCC) : Number.NaN;

  return {
    cifJPY: 1500000,
    engineCC: Number.isFinite(parsedEngineCC) && parsedEngineCC > 0 ? parsedEngineCC : 1000,
    fuelType: searchParams.get('fuelType')?.trim() || 'Petrol',
    vehicleType: searchParams.get('vehicleType')?.trim() || '',
    ageYears: 1,
    exchangeRate: 2.0,
    includeSSCL: false,
  };
}

function calculateDownPaymentAmount(vehiclePrice: number, downPaymentPercent: number) {
  return (vehiclePrice * downPaymentPercent) / 100;
}

function validateLeaseEstimate({
  vehiclePrice,
  downPaymentAmount,
  annualInterestRate,
  leaseTermMonths,
}: LeaseEstimateParams) {
  if (
    !Number.isFinite(vehiclePrice) ||
    !Number.isFinite(downPaymentAmount) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(leaseTermMonths) ||
    downPaymentAmount < 0 ||
    annualInterestRate < 0
  ) {
    return 'Enter valid numeric values to generate a finance estimate.';
  }

  if (vehiclePrice <= 0) {
    return 'Enter the vehicle value in LKR to generate a finance estimate.';
  }

  if (downPaymentAmount > vehiclePrice) {
    return 'Down payment cannot exceed the vehicle value.';
  }

  if (leaseTermMonths <= 0) {
    return 'Select a valid lease term.';
  }

  return null;
}

function calculateLeaseEstimate({
  vehiclePrice,
  downPaymentAmount,
  annualInterestRate,
  leaseTermMonths,
}: LeaseEstimateParams): LeaseCalculationResult | null {
  const validationMessage = validateLeaseEstimate({
    vehiclePrice,
    downPaymentAmount,
    annualInterestRate,
    leaseTermMonths,
  });

  if (validationMessage) {
    return null;
  }

  const financedPrincipal = vehiclePrice - downPaymentAmount;

  if (financedPrincipal <= 0) {
    return {
      financedPrincipal: 0,
      monthlyPayment: 0,
      totalPayment: downPaymentAmount,
      totalInterest: 0,
      downPaymentAmount,
    };
  }

  const monthlyRate = annualInterestRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthlyPayment = financedPrincipal / leaseTermMonths;
    const totalPayment = downPaymentAmount + financedPrincipal;

    return {
      financedPrincipal,
      monthlyPayment,
      totalPayment,
      totalInterest: 0,
      downPaymentAmount,
    };
  }

  const growthFactor = Math.pow(1 + monthlyRate, leaseTermMonths);
  const denominator = growthFactor - 1;

  if (!Number.isFinite(growthFactor) || denominator === 0) {
    return null;
  }

  const monthlyPayment =
    financedPrincipal * ((monthlyRate * growthFactor) / denominator);
  const totalOfInstallments = monthlyPayment * leaseTermMonths;
  const totalPayment = downPaymentAmount + totalOfInstallments;
  const totalInterest = totalOfInstallments - financedPrincipal;

  if (
    !Number.isFinite(monthlyPayment) ||
    !Number.isFinite(totalPayment) ||
    !Number.isFinite(totalInterest)
  ) {
    return null;
  }

  return {
    financedPrincipal,
    monthlyPayment,
    totalPayment,
    totalInterest,
    downPaymentAmount,
  };
}

function buildLeaseFinanceSummary(leaseInputs: LeaseInputs): LeaseFinanceSummary {
  const downPaymentAmount = calculateDownPaymentAmount(
    leaseInputs.totalVehicleValueLKR,
    leaseInputs.downPaymentPercent,
  );
  const financedAmount = Math.max(0, leaseInputs.totalVehicleValueLKR - downPaymentAmount);
  const validationMessage = validateLeaseEstimate({
    vehiclePrice: leaseInputs.totalVehicleValueLKR,
    downPaymentAmount,
    annualInterestRate: leaseInputs.annualInterestRate,
    leaseTermMonths: leaseInputs.leaseTermMonths,
  });

  return {
    downPaymentAmount,
    financedAmount,
    results: validationMessage
      ? null
      : calculateLeaseEstimate({
          vehiclePrice: leaseInputs.totalVehicleValueLKR,
          downPaymentAmount,
          annualInterestRate: leaseInputs.annualInterestRate,
          leaseTermMonths: leaseInputs.leaseTermMonths,
        }),
    validationMessage,
  };
}

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'tax' | 'lease'>('tax');
  const [inputs, setInputs] = useState<TaxCalculatorInputs>(() => buildInitialTaxInputs(searchParams));
  const [leaseInputs, setLeaseInputs] = useState<LeaseInputs>({
    totalVehicleValueLKR: 0,
    downPaymentPercent: 30,
    annualInterestRate: 13,
    leaseTermMonths: 60,
  });
  
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, type } = target;
    const checked = target instanceof HTMLInputElement ? target.checked : false;
    const value = target.value;

    setInputs(prev => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : name === 'fuelType' || name === 'vehicleType'
              ? value
              : Number(value),
    }));
  };

  const calculateEstimate = async (calculatorInputs: TaxCalculatorInputs) => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculatorInputs),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch calculation", error);
    }
    setLoading(false);
  };

  const handleCalculate = async () => {
    await calculateEstimate(inputs);
  };

  const chartData = results ? [
    { name: 'Vehicle Value', value: results.baseValueLKR, color: BRAND_BLUE },
    { name: 'Total Taxes', value: results.totalTaxes, color: BRAND_RED },
  ] : [];

  const handleLeaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLeaseInputs(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const leaseFinanceSummary = buildLeaseFinanceSummary(leaseInputs);
  const {
    downPaymentAmount,
    financedAmount,
    results: leaseResults,
    validationMessage: leaseValidationMessage,
  } = leaseFinanceSummary;

  const isKwBased = inputs.fuelType === "Electric" || inputs.fuelType === "E-SMART Hybrid";

  return (
    <div className="min-h-screen bg-white text-[#013667] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold text-[#013667]">NextGen Traders Import Calculator</h1>
          <p className="text-gray-500 mt-2">Get an exact estimate based on the 2026 Sri Lankan Tax Structure.</p>
        </header>

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-2">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab('tax')}
              className={`border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === 'tax'
                  ? 'border-[#013667] text-[#013667]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Import Tax
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lease')}
              className={`border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === 'lease'
                  ? 'border-[#013667] text-[#013667]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Lease Finance
            </button>
          </div>
        </div>

        {activeTab === 'tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: INPUTS */}
          <section className="space-y-6">
            <div className="bg-white p-2">
              <h2 className="text-lg font-bold mb-6 tracking-wide">VEHICLE SPECIFICATIONS</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CIF Value (JPY)</label>
                  <input
                    type="number"
                    name="cifJPY"
                    value={inputs.cifJPY}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Fuel Type</label>
                  <select
                    name="fuelType"
                    value={inputs.fuelType}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all appearance-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol Hybrid">Petrol Hybrid</option>
                    <option value="Diesel Hybrid">Diesel Hybrid</option>
                    <option value="Plug-in Hybrid - Petrol">Plug-in Hybrid - Petrol</option>
                    <option value="Plug-in Hybrid - Diesel">Plug-in Hybrid - Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="E-SMART Hybrid">E-SMART Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Type (Optional)</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={inputs.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. Compact SUV"
                    className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isKwBased ? 'Motor Power (kW)' : 'Engine Capacity (CC)'}</label>
                    <input
                      type="number"
                      name="engineCC"
                      value={inputs.engineCC}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Age (Years)</label>
                    <select
                      name="ageYears"
                      value={inputs.ageYears}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all appearance-none"
                    >
                      <option value={1}>1 Year (Fresh)</option>
                      <option value={2}>2 Years</option>
                      <option value={3}>3+ Years</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Live Exchange Rate (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="exchangeRate"
                    value={inputs.exchangeRate}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#013667] font-mono text-gray-600"
                  />
                </div>

                {/* SSCL TOGGLE */}
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label htmlFor="includeSSCL" className="block text-sm font-bold text-[#013667] cursor-pointer">
                        Include SSCL (2.5%)
                      </label>
                      <p className="mt-1 text-xs text-gray-500">Pending government implementation</p>
                    </div>

                    {/* FIXED: Changed to <label> to make the switch clickable */}
                    <label className="relative shrink-0 cursor-pointer">
                      <input
                        id="includeSSCL"
                        name="includeSSCL"
                        type="checkbox"
                        checked={inputs.includeSSCL}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="h-7 w-12 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#013667]" />
                      <div className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full bg-[#a60000] hover:opacity-90 text-white font-bold py-5 rounded shadow-md transform transition-transform active:scale-[0.98] mt-4 uppercase tracking-widest text-sm"
                >
                  {loading ? 'Processing Tax Logic...' : 'Calculate Estimate'}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: RESULTS & VIZ */}
          <section className="flex flex-col h-full bg-white lg:pl-12 lg:border-l border-gray-100">
            {results ? (
              <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Estimated Landed Cost</span>
                  <div className="text-6xl font-black text-[#013667] mt-2 tracking-tighter">
                    Rs. {results.finalLandedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                {/* Recharts Donut Chart */}
                <div className="h-64 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => value !== undefined && value !== null ? `Rs. ${(value as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''}
                        contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Tax Breakdown List */}
                <div className="grow space-y-3 mb-10">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Tax Breakdown</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
                    <span>Customs Duty (Inc. SUR):</span>
                    <span className="text-right font-mono">Rs. {results.totalCid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    
                    <span>Excise Duty (XID):</span>
                    <span className="text-right font-mono">Rs. {results.exciseDuty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    
                    <span className={`text-sm ${!inputs.includeSSCL ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className={!inputs.includeSSCL ? 'line-through' : ''}>SSCL (2.5%)</span>
                      {!inputs.includeSSCL && ' (Disabled)'}:
                    </span>
                    <span className={`text-right font-mono ${!inputs.includeSSCL ? 'text-gray-300' : ''}`}>
                      Rs. {results.sscl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    
                    {results.luxuryTax > 0 && (
                      <>
                        <span className="text-[#013667] font-bold">Luxury Tax (LXT):</span>
                        <span className="text-right font-mono text-[#013667] font-bold">Rs. {results.luxuryTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </>
                    )}

                    <span className="font-bold text-[#013667]">VAT (18%):</span>
                    <span className="text-right font-mono font-bold text-[#013667]">Rs. {results.vat.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    
                    <div className="col-span-2 border-t border-gray-100 mt-2 pt-3 flex justify-between font-bold text-[#013667] text-base">
                      <span>Total Tax Payable:</span>
                      <span className="font-mono">Rs. {results.totalTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => window.open(`https://wa.me/YOUR_NUMBER_HERE?text=Hi NextGen Traders, I am interested in a ${inputs.engineCC}${isKwBased ? 'kW' : 'cc'} ${inputs.fuelType} with an estimate of Rs. ${results.finalLandedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '_blank')}
                  className="w-full bg-[#a60000] hover:opacity-90 text-white font-bold py-5 rounded shadow-lg transform transition-transform active:scale-[0.98] focus:outline-none uppercase tracking-widest text-sm"
                >
                  Contact NextGen Traders via WhatsApp
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded border border-dashed border-gray-200">
                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 font-medium">Enter your vehicle details and click Calculate to view the complete 2026 tax breakdown.</p>
              </div>
            )}
          </section>

        </div>
        )}

        {activeTab === 'lease' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="space-y-6">
              <div className="bg-white p-2">
                <h2 className="text-lg font-bold mb-6 tracking-wide text-[#013667]">LEASE FINANCE INPUTS</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Total Vehicle Value (LKR)</label>
                    <input
                      type="number"
                      name="totalVehicleValueLKR"
                      value={leaseInputs.totalVehicleValueLKR}
                      onChange={handleLeaseInputChange}
                      className="w-full p-4 border border-gray-200 rounded bg-white text-[#013667] focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="block text-sm font-bold text-gray-700">Down Payment (%)</label>
                      <span className="text-sm font-bold text-[#013667]">{leaseInputs.downPaymentPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={70}
                      step={1}
                      name="downPaymentPercent"
                      value={leaseInputs.downPaymentPercent}
                      onChange={handleLeaseInputChange}
                      className="w-full accent-[#013667]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Annual Interest Rate (%)</label>
                    <input
                      type="number"
                      name="annualInterestRate"
                      value={leaseInputs.annualInterestRate}
                      onChange={handleLeaseInputChange}
                      className="w-full p-4 border border-gray-200 rounded bg-white text-[#013667] focus:outline-none focus:ring-2 focus:ring-[#013667] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Lease Term</label>
                    <div className="flex flex-wrap gap-3">
                      {[36, 60, 84].map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLeaseInputs(prev => ({ ...prev, leaseTermMonths: term as LeaseTermMonths }))}
                          className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                            leaseInputs.leaseTermMonths === term
                              ? 'border-[#013667] text-[#013667] bg-white'
                              : 'border-gray-200 text-gray-500 bg-white hover:text-gray-700'
                          }`}
                        >
                          {term} Months
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col h-full bg-white lg:pl-12 lg:border-l border-gray-100">
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 rounded-2xl border border-gray-100 bg-white px-6 py-7 sm:px-8">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Estimated Monthly Rental</span>
                  <div className="mt-3 text-5xl font-black tracking-[-0.04em] text-[#013667] sm:text-6xl">
                    Rs. {leaseResults ? leaseResults.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
                    A reducing-balance estimate based on your selected vehicle value, down payment, interest rate, and lease term.
                  </p>
                </div>

                <div className="grow mb-10">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3">Lease Breakdown</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: 'Down Payment Amount',
                        value: (leaseResults?.downPaymentAmount ?? downPaymentAmount).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        }),
                      },
                      {
                        label: 'Financed Amount',
                        value: (leaseResults?.financedPrincipal ?? financedAmount).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        }),
                      },
                      {
                        label: 'Total Interest',
                        value: (leaseResults?.totalInterest ?? 0).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        }),
                      },
                      {
                        label: 'Total Payable',
                        value: (leaseResults?.totalPayment ?? 0).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        }),
                        emphasized: true,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-xl border px-4 py-4 ${
                          item.emphasized ? 'border-[#013667]/15 bg-white' : 'border-gray-100 bg-white'
                        }`}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
                        <p
                          className={`mt-2 font-mono text-lg ${
                            item.emphasized ? 'font-bold text-[#013667]' : 'font-semibold text-gray-700'
                          }`}
                        >
                          Rs. {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {leaseValidationMessage && (
                    <p className="mt-4 rounded-xl border border-[#a60000]/15 bg-white px-4 py-3 text-sm font-medium leading-6 text-[#a60000]">
                      {leaseValidationMessage}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => window.open(`https://wa.me/YOUR_NUMBER_HERE?text=Hi NextGen Traders, I am interested in lease finance options for a vehicle valued at Rs. ${leaseInputs.totalVehicleValueLKR.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '_blank')}
                  className="w-full bg-[#a60000] hover:opacity-90 text-white font-bold py-5 rounded shadow-lg transform transition-transform active:scale-[0.98] focus:outline-none uppercase tracking-widest text-sm"
                >
                  Contact NextGen Traders via WhatsApp
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
