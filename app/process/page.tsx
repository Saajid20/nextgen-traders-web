const steps = [
  {
    title: "Auction",
    summary: "Select a vehicle from trusted auction partners with verified condition sheets.",
  },
  {
    title: "LC Open",
    summary: "We guide you through opening the Letter of Credit with clear payment milestones.",
  },
  {
    title: "Shipping",
    summary: "Your vehicle is scheduled and shipped with regular milestone updates.",
  },
  {
    title: "Customs Clearance",
    summary: "Documentation and tax handling are coordinated to avoid unnecessary delays.",
  },
  {
    title: "Registration Support",
    summary: "We assist with the final administrative process for legal road readiness.",
  },
  {
    title: "Handover",
    summary: "Receive your vehicle after final checks with full confidence in condition and cost.",
  },
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <section className="mx-auto w-full max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">
            Import Process
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#013667] sm:text-4xl">
            How Your Vehicle Moves from Auction to Handover
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            A transparent six-step process designed to give you certainty at every stage.
          </p>
        </header>

        <ol className="mt-10 space-y-8 border-l-2 border-gray-200 pl-6">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                className="absolute -left-8.25 top-1 inline-block h-5 w-5 rounded-full border-2 border-[#013667] bg-white"
                aria-hidden="true"
              />
              <article className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#013667]">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#013667]">{step.title}</h2>
                <p className="mt-3 text-base leading-7 text-gray-600">{step.summary}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
