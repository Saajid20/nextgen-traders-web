import Link from 'next/link';
import { notFound } from 'next/navigation';
import { vehicles } from '@/lib/mockVehicles';

type VehiclePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = vehicles.find((item) => item.slug === slug);

  if (!vehicle) {
    notFound();
  }

  const isRoomy = vehicle.slug === 'toyota-roomy';
  const allFeatures = Array.from(new Set(vehicle.grades.flatMap((grade) => grade.features)));

  return (
    <div className="min-h-screen bg-white px-4 py-14 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <section className="border-b border-gray-100 pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Vehicle Advisory</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#013667] sm:text-5xl lg:text-6xl">
            {vehicle.name}
          </h1>
          <div className="mt-5 inline-flex items-center rounded-full border border-[#013667]/30 px-4 py-1.5 text-sm font-bold text-[#013667]">
            Chassis: {vehicle.chassis}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-6 lg:grid-cols-[1.5fr_1fr] lg:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#013667]">Editorial Overview</p>
              <p className="mt-3 text-[15px] leading-8 text-gray-700">
                {isRoomy
                  ? 'Toyota Roomy is a practical city-family MPV with efficient packaging, comfortable cabin space, and grade levels that meaningfully change styling and convenience. Use this page as an advisory snapshot to match your ideal specification before running your landed-cost estimate.'
                  : `${vehicle.name} is offered in multiple grades that balance practicality, comfort, and value in different ways. This guide is structured to help you compare each model at a glance and shortlist the right variant before your landed-cost calculation.`}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">Advisor Notes</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
                <li>Compare every grade feature side by side.</li>
                <li>Review engine class and comfort upgrades.</li>
                <li>Move to landed-cost estimate once shortlisted.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">All Possible Models</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {vehicle.grades.map((grade) => (
                <div key={`${grade.name}-summary`} className="rounded-xl border border-gray-200 bg-white px-4 py-4">
                  <p className="text-sm font-black uppercase tracking-wide text-[#013667]">{grade.name}</p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {grade.engineCC.toLocaleString()} CC
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-[#013667]">Grade Matrix</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {vehicle.grades.map((grade) => (
              <article key={grade.name} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-7">
                <h3 className="text-2xl font-black tracking-tight text-[#013667]">{grade.name}</h3>

                <ul className="mt-5 space-y-2.5 text-sm leading-6 text-gray-700">
                  {grade.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013667]" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm font-semibold text-[#013667]">
                  Engine CC: <span className="font-black">{grade.engineCC.toLocaleString()}</span>
                </p>

                <Link
                  href="/calculator"
                  className="mt-9 inline-flex w-full items-center justify-center rounded-lg bg-[#a60000] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
                >
                  Calculate Landed Cost
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="text-lg font-bold uppercase tracking-[0.14em] text-[#013667]">Side-by-Side Model Comparison</h2>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            A quick decision matrix for fast grade shortlisting.
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="sticky left-0 bg-white px-5 py-4 font-bold uppercase tracking-wide text-gray-600">Feature</th>
                  {vehicle.grades.map((grade) => (
                    <th key={`${grade.name}-head`} className="px-5 py-4 font-bold uppercase tracking-wide text-[#013667]">
                      {grade.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="sticky left-0 bg-white px-5 py-4 font-semibold text-[#013667]">Engine CC</td>
                  {vehicle.grades.map((grade) => (
                    <td key={`${grade.name}-engine`} className="px-5 py-4 font-semibold text-gray-700">
                      {grade.engineCC.toLocaleString()} cc
                    </td>
                  ))}
                </tr>

                {allFeatures.map((feature) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="sticky left-0 bg-white px-5 py-4 text-gray-700">{feature}</td>
                    {vehicle.grades.map((grade) => (
                      <td key={`${grade.name}-${feature}`} className="px-5 py-4">
                        {grade.features.includes(feature) ? (
                          <span className="font-bold text-[#013667]">Yes</span>
                        ) : (
                          <span className="text-gray-300">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
