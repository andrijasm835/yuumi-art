import { brand } from "@/content/site";

export const metadata = {
  title: "Politika privatnosti | Yuumi Art",
  description: "Politika privatnosti za Yuumi Art booking i upite.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#fff7ef] px-5 py-16 text-[#241916] md:px-10 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="text-[11px] font-bold tracking-[0.32em] text-[#8f6d5a]">YUUMI ART</p>
        <h1 className="mt-5 font-serif text-[clamp(3rem,8vw,5.8rem)] leading-[0.9] text-[#6f1d2a]">
          Politika privatnosti
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#6b574e]">
          Ova politika objašnjava kako Yuumi Art koristi podatke poslate putem forme za rezervaciju ili upit na sajtu.
        </p>

        <div className="mt-12 grid gap-9 text-base leading-7 text-[#4e3a34]">
          <section>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Koje podatke prikupljamo</h2>
            <p className="mt-3">
              Prilikom slanja zahteva možemo prikupiti ime i prezime, email adresu, opcioni broj telefona, Instagram profil,
              napomenu, izabranu uslugu i detalje termina kao što su datum i vreme.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Kako koristimo podatke</h2>
            <p className="mt-3">
              Podaci se koriste isključivo za obradu rezervacije ili upita i za komunikaciju u vezi sa traženom uslugom. Podaci
              se ne prodaju i ne koriste se za druge svrhe.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Gde se podaci čuvaju</h2>
            <p className="mt-3">
              Podaci se čuvaju u okviru infrastrukture sajta, uključujući Supabase. Transakcione email notifikacije u vezi sa
              rezervacijom ili upitom mogu biti poslate putem servisa Resend.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-[#6f1d2a]">Ispravka ili brisanje podataka</h2>
            <p className="mt-3">
              Možeš zatražiti ispravku ili brisanje svojih podataka kontaktiranjem Yuumi Art profila na Instagramu:
              {" "}
              <a className="font-bold text-[#6f1d2a] underline decoration-[#d8bd80] underline-offset-4" href={brand.instagram}>
                @yuumi__art
              </a>
              .
            </p>
          </section>

          <p className="border-t border-[#d8bd80]/45 pt-6 text-sm text-[#8f6d5a]">Poslednje ažuriranje: {year}.</p>
        </div>
      </article>
    </main>
  );
}
