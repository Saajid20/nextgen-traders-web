import { CatalogIngestionForm } from './catalog-ingestion-form';

export default function CatalogIngestionPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <section className="border-b border-[#E6EBF0] pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#013667]">Admin</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-[#013667] sm:text-5xl lg:text-[4rem] lg:leading-[0.98]">
            Catalog Ingestion
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#111827]">
            Internal payload runner for adding or updating vehicle catalog records through the existing ingestion service.
          </p>
        </section>

        <section className="py-10">
          <CatalogIngestionForm />
        </section>
      </div>
    </main>
  );
}
