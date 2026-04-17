import Link from 'next/link';
import { VehicleFilterBar } from './filter-bar';
import { vehicles, type VehicleCatalogItem } from '@/lib/mockVehicles';

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  label: string;
  options: FilterOption[];
};

type VehicleCardModel = {
  slug: string;
  name: string;
  chassis: string;
  engineSummary: string;
  fuelType: string;
  engineGroup: string;
  priceFrom: string;
};

const brand = {
  blue: '#013667',
  red: '#a60000',
  white: '#FFFFFF',
  text: '#111827',
  mutedText: '#344054',
  border: '#D7DEE5',
  borderSoft: '#E6EBF0',
  surface: '#FBFCFD',
  shadow: 'shadow-[0_12px_28px_rgba(1,54,103,0.05)]',
} as const;

const copy = {
  eyebrow: 'Vehicle Catalog',
  title: 'Available Imports',
  description:
    'Explore curated Japanese models, review key specifications at a glance, and move into a full advisory page before calculating your landed cost.',
  filterLabel: 'Browse by',
  placeholderLabel: 'Vehicle Preview',
  detailsCta: 'View Details',
  calculatorCta: 'Calculate Landed Cost',
  homeCta: 'Back to Home',
  priceLabel: 'Indicative Starting Price',
  priceNote: 'Spec guidance and final landed cost may vary by grade and shipment timing.',
} as const;

const filterGroups: FilterGroup[] = [
  {
    label: 'Fuel Type',
    options: [
      { label: 'Petrol', value: 'petrol' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'Diesel', value: 'diesel' },
    ],
  },
  {
    label: 'Engine Size',
    options: [
      { label: 'Under 1000cc', value: 'under-1000' },
      { label: '1000-1500cc', value: '1000-1500' },
    ],
  },
];

const placeholderPrices: Record<string, string> = {
  'suzuki-every': 'From LKR 8.5M',
  'toyota-roomy': 'From LKR 10.9M',
};

const styles = {
  page: `min-h-screen bg-[${brand.white}] px-6 py-12 sm:px-10 lg:px-16 lg:py-16`,
  container: 'mx-auto w-full max-w-7xl',
  sectionHeader: 'max-w-3xl',
  eyebrow: `text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  title: `mt-4 text-3xl font-black tracking-[-0.03em] text-[${brand.blue}] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.05]`,
  description: `mt-5 max-w-2xl text-[15px] leading-8 text-[${brand.text}]`,
  actionRow: 'mt-8 flex flex-col gap-3 sm:flex-row',
  primaryButton: 'inline-flex items-center justify-center rounded-full bg-[#a60000] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90',
  secondaryButton:
    'inline-flex items-center justify-center rounded-full bg-white border border-[#013667] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-[#013667] transition hover:bg-[#FBFCFD]',
  panel: `rounded-3xl border border-[${brand.border}] bg-[${brand.white}] ${brand.shadow}`,
  filterBar: 'mt-12 p-5 sm:p-6',
  filterIntro: `text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  filterGrid: 'mt-5 grid gap-5 lg:grid-cols-2',
  filterLabel: `text-sm font-bold text-[${brand.blue}]`,
  filterChips: 'mt-3 flex flex-wrap gap-3',
  filterChip:
    'inline-flex items-center rounded-full border border-[#D7DEE5] bg-white px-4 py-2 text-sm font-semibold text-[#344054] transition hover:border-[#013667]/30 hover:bg-[#FBFCFD] hover:text-[#013667]',
  filterChipActive: 'border-[#013667] bg-[#FBFCFD] text-[#013667]',
  grid: 'mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  card: 'flex h-full flex-col overflow-hidden',
  cardImageShell: `border-b border-[${brand.borderSoft}] bg-[${brand.surface}] p-6`,
  cardImageFrame: `flex aspect-[4/3] items-center justify-center rounded-2xl border border-[${brand.border}] bg-[${brand.white}]`,
  placeholderWrap: 'flex flex-col items-center text-center',
  placeholderIcon: `h-14 w-14 text-[${brand.blue}]`,
  placeholderText: `mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  cardBody: 'flex flex-1 flex-col p-6 sm:p-7',
  chassisBadge: `inline-flex items-center rounded-full border border-[${brand.blue}]/16 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[${brand.blue}]`,
  cardTitle: `mt-5 text-[1.65rem] font-black tracking-[-0.03em] text-[${brand.blue}]`,
  summary: `mt-4 text-sm leading-7 text-[${brand.text}]`,
  priceRow: `mt-6 border-t border-[${brand.borderSoft}] pt-5`,
  priceLabel: `text-[11px] font-bold uppercase tracking-[0.22em] text-[${brand.mutedText}]`,
  priceValue: `mt-2 text-xl font-black tracking-[-0.02em] text-[${brand.blue}]`,
  priceNote: `mt-2 text-sm leading-7 text-[${brand.mutedText}]`,
  cardActions: 'mt-7 flex flex-col gap-3 sm:flex-row',
  detailsButton:
    'inline-flex items-center justify-center rounded-full bg-white border border-[#013667] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#013667] transition hover:bg-[#FBFCFD]',
  utilityButton:
    'inline-flex items-center justify-center rounded-full bg-[#a60000] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90',
} as const;

function formatEngineSummary(vehicle: VehicleCatalogItem) {
  const values = Array.from(new Set(vehicle.grades.map((grade) => grade.engineCC))).sort((left, right) => left - right);

  if (values.length === 1) {
    return `${values[0].toLocaleString()} cc engine`;
  }

  return `${values[0].toLocaleString()}-${values[values.length - 1].toLocaleString()} cc engine range`;
}

function inferFuelType(vehicle: VehicleCatalogItem) {
  const name = vehicle.name.toLowerCase();

  if (name.includes('prius') || name.includes('note e-power')) {
    return 'Hybrid';
  }

  return 'Petrol';
}

function getEngineGroup(vehicle: VehicleCatalogItem) {
  const highestEngine = Math.max(...vehicle.grades.map((grade) => grade.engineCC));
  return highestEngine < 1000 ? 'Under 1000cc' : '1000-1500cc';
}

function buildVehicleCardModel(vehicle: VehicleCatalogItem): VehicleCardModel {
  return {
    slug: vehicle.slug,
    name: vehicle.name,
    chassis: vehicle.chassis,
    engineSummary: formatEngineSummary(vehicle),
    fuelType: inferFuelType(vehicle),
    engineGroup: getEngineGroup(vehicle),
    priceFrom: placeholderPrices[vehicle.slug] ?? 'From LKR 9.8M',
  };
}

function PageHeader() {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.description}>{copy.description}</p>

      <div className={styles.actionRow}>
        <Link href="/calculator" className={styles.primaryButton}>
          {copy.calculatorCta}
        </Link>
        <Link href="/" className={styles.secondaryButton}>
          {copy.homeCta}
        </Link>
      </div>
    </header>
  );
}

function VehiclePlaceholder() {
  return (
    <div className={styles.placeholderWrap}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className={styles.placeholderIcon} fill="none">
        <path
          d="M14 39h36l-3.5-11.5A4 4 0 0 0 42.67 25H21.33a4 4 0 0 0-3.83 2.5L14 39Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 39h44v7a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4v-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M18 46h6M40 46h6M22 25l4-7h12l4 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="46" r="2" fill="currentColor" />
        <circle cx="46" cy="46" r="2" fill="currentColor" />
      </svg>
      <p className={styles.placeholderText}>{copy.placeholderLabel}</p>
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: VehicleCardModel }) {
  return (
    <article className={`${styles.panel} ${styles.card}`}>
      <div className={styles.cardImageShell}>
        <div className={styles.cardImageFrame}>
          <VehiclePlaceholder />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div>
          <span className={styles.chassisBadge}>Chassis {vehicle.chassis}</span>
          <h2 className={styles.cardTitle}>{vehicle.name}</h2>
        </div>

        <p className={styles.summary}>
          {vehicle.engineSummary} · {vehicle.fuelType} · {vehicle.engineGroup}
        </p>

        <div className={styles.priceRow}>
          <p className={styles.priceLabel}>{copy.priceLabel}</p>
          <p className={styles.priceValue}>{vehicle.priceFrom}</p>
          <p className={styles.priceNote}>{copy.priceNote}</p>
        </div>

        <div className={styles.cardActions}>
          <Link href={`/vehicles/${vehicle.slug}`} className={`${styles.detailsButton} flex-1`}>
            {copy.detailsCta}
          </Link>
          <Link href="/calculator" className={`${styles.utilityButton} flex-1`}>
            {copy.calculatorCta}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function VehiclesPage() {
  const vehicleCards = vehicles.map(buildVehicleCardModel);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHeader />
        <VehicleFilterBar
          groups={filterGroups}
          introLabel={copy.filterLabel}
          panelClassName={`${styles.panel} ${styles.filterBar}`}
          introClassName={styles.filterIntro}
          gridClassName={styles.filterGrid}
          groupLabelClassName={styles.filterLabel}
          chipsClassName={styles.filterChips}
          chipClassName={styles.filterChip}
          activeChipClassName={styles.filterChipActive}
        />

        <section className={styles.grid}>
          {vehicleCards.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </section>
      </div>
    </main>
  );
}
