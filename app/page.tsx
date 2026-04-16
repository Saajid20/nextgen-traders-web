import Link from "next/link";

const testimonials = [
  {
    name: "Nimal Perera",
    role: "Business Owner",
    review:
      "Everything was clearly explained from auction bid to final registration. The process felt premium and predictable.",
  },
  {
    name: "Sashika Fernando",
    role: "First-time Importer",
    review:
      "I expected complexity, but their team gave me confidence at every step. Delivery timing and pricing were spot on.",
  },
  {
    name: "Ruwan Jayasinghe",
    role: "Fleet Manager",
    review:
      "Fast responses, transparent updates, and no surprises. This is the most professional import experience I have had.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#013667]">
      <main>
        <section className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-16 sm:px-10 lg:px-16 lg:pt-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#013667]">
            Trusted Vehicle Imports
          </p>
          <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">
            Import with absolute certainty.
            <span className="mt-2 block text-[#013667]">Drive with total confidence.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600">
            Premium Japanese vehicle sourcing, transparent pricing, and end-to-end guidance built for serious buyers.
          </p>
          <div className="mt-10">
            <a
              href="https://wa.me/94770000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#a60000] px-10 py-5 text-base font-bold text-white transition hover:opacity-90"
            >
              Contact via WhatsApp
            </a>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What clients say after they import with us</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-2xl border border-gray-200 bg-white p-7">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 text-[#013667]"
                  fill="currentColor"
                >
                  <path d="M10 11H7.5a2.5 2.5 0 0 1 2.5-2.5V6A5 5 0 0 0 5 11v7h5v-7Zm9 0h-2.5A2.5 2.5 0 0 1 19 8.5V6a5 5 0 0 0-5 5v7h5v-7Z" />
                </svg>
                <p className="mt-5 text-base leading-7 text-gray-600">{testimonial.review}</p>
                <p className="mt-6 text-lg font-semibold text-[#013667]">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">Vehicle Sneak Peek</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Popular Imports</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Suzuki Every",
              "Toyota Roomy",
              "Honda Vezel",
            ].map((vehicle) => (
              <article key={vehicle} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="h-44 border-b border-gray-200 bg-white" aria-hidden="true" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#013667]">{vehicle}</h3>
                  <Link href="/vehicles" className="mt-4 inline-block text-sm font-semibold text-[#013667] transition hover:opacity-80">
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10 lg:px-16">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">Creative Step-by-Step Process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">How to Import</h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="grid gap-8 md:grid-cols-3 md:items-start">
              {[
                { number: "01", title: "Auction", description: "Choose from vetted vehicles with clear specs and transparent bidding guidance." },
                { number: "02", title: "Import", description: "We handle shipping, documentation, and customs coordination with full visibility." },
                { number: "03", title: "Handover", description: "Receive your vehicle with final checks complete and support through registration." },
              ].map((step, index) => (
                <div key={step.title} className="relative">
                  <p className="text-5xl font-black leading-none tracking-tight text-[#013667] sm:text-6xl">{step.number}</p>
                  <h3 className="mt-3 text-xl font-semibold text-[#013667]">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">{step.description}</p>
                  {index < 2 && (
                    <div className="mt-6 hidden h-px w-full bg-gray-200 md:block" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
