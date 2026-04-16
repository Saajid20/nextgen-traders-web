const values = [
  {
    title: "Transparency",
    description:
      "Every quote and milestone is clearly explained so you always know your true landed cost.",
  },
  {
    title: "Speed",
    description:
      "From bidding to paperwork coordination, we keep the process efficient without sacrificing accuracy.",
  },
  {
    title: "Quality",
    description:
      "We focus on dependable Japanese vehicles with verified records and practical recommendations.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <section className="mx-auto w-full max-w-7xl">
        <header className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#013667]">
            NextGen Traders
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#013667] sm:text-5xl">
            Celebrating Our 1st Anniversary
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
            One year of trusted imports, clear communication, and confident handovers. Thank you for helping us build a
            standard of premium certainty in vehicle importing.
           </p>
         </header>

         <section className="mt-12" aria-labelledby="why-choose-us">
           <h2 id="why-choose-us" className="text-3xl font-bold tracking-tight text-[#013667]">
             Why Choose Us
           </h2>

           <div className="mt-6 grid gap-6 md:grid-cols-3">
             {values.map((value) => (
               <article key={value.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                 <h3 className="text-xl font-semibold text-[#013667]">{value.title}</h3>
                 <p className="mt-3 text-base leading-7 text-gray-600">{value.description}</p>
               </article>
             ))}
           </div>
         </section>

         <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" aria-labelledby="contact-info">
           <h2 id="contact-info" className="text-2xl font-bold tracking-tight text-[#013667]">
             Contact Information
           </h2>
           <address className="mt-5 not-italic text-base leading-8 text-gray-600">
             <p>NextGen Traders</p>
             <p>No. 123, Main Street, Colombo, Sri Lanka</p>
             <p>
               Phone: <a href="tel:+94770000000" className="font-medium text-[#013667]">+94 77 000 0000</a>
             </p>
             <p>
               Email: <a href="mailto:hello@nextgentraders.com" className="font-medium text-[#013667]">hello@nextgentraders.com</a>
             </p>
           </address>
         </section>
       </section>
     </main>
   );
}
