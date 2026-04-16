import Link from "next/link";

const vehicles = [
  { slug: "suzuki-every", make: "Suzuki", model: "Every" },
  { slug: "toyota-roomy", make: "Toyota", model: "Roomy" },
  { slug: "honda-vezel", make: "Honda", model: "Vezel" },
  { slug: "nissan-note", make: "Nissan", model: "Note" },
  { slug: "mazda-demio", make: "Mazda", model: "Demio" },
  { slug: "toyota-prius", make: "Toyota", model: "Prius" },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">
          Vehicle Catalog
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#013667] sm:text-4xl">
          Browse Available Imports
        </h1>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle.slug}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div
                className="h-44 border-b border-gray-200 bg-white"
                aria-hidden="true"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500">{vehicle.make}</p>
                <h2 className="mt-1 text-xl font-semibold text-[#013667]">
                  {vehicle.model}
                </h2>
                <Link
                  href={`/vehicles/${vehicle.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-[#013667] transition hover:opacity-80"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
