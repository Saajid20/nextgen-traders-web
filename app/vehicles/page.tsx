import Link from 'next/link';
import { VehicleCatalogClient } from './catalog-client';
import type { FilterGroup } from './catalog-types';
import { getCatalogVehicleListWithFallback } from '@/lib/catalog/catalog-data';

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
  noResultsMessage: 'No vehicles match the current filters yet. Try widening the selection.',
} as const;

const filterGroups: FilterGroup[] = [
  {
    key: 'fuelType',
    label: 'Fuel Type',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Petrol', value: 'petrol' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'Diesel', value: 'diesel' },
    ],
  },
  {
    key: 'bodyType',
    label: 'Body Type',
    options: [
      { label: 'All', value: 'all' },
      { label: 'SUV', value: 'suv' },
      { label: 'Van', value: 'van' },
      { label: 'MPV', value: 'mpv' },
      { label: 'Hatchback', value: 'hatchback' },
    ],
  },
  {
    key: 'drivetrain',
    label: 'Drivetrain',
    options: [
      { label: 'All', value: 'all' },
      { label: '2WD', value: '2wd' },
      { label: '4WD', value: '4wd' },
    ],
  },
];

const styles = {
  page: `min-h-screen bg-[${brand.white}] px-6 py-12 sm:px-10 lg:px-16 lg:py-16`,
  container: 'mx-auto w-full max-w-7xl',
  sectionHeader: 'max-w-3xl',
  eyebrow: `text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  title: `mt-4 text-3xl font-black tracking-[-0.03em] text-[${brand.blue}] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.05]`,
  description: `mt-5 max-w-2xl text-[15px] leading-8 text-[${brand.text}]`,
  actionRow: 'mt-8 flex flex-col gap-3 sm:flex-row',
  primaryButton:
    'inline-flex items-center justify-center rounded-full bg-[#a60000] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90',
  secondaryButton:
    'inline-flex items-center justify-center rounded-full bg-white border border-[#013667] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-[#013667] transition hover:bg-[#FBFCFD]',
  panel: `rounded-3xl border border-[${brand.border}] bg-[${brand.white}] ${brand.shadow}`,
  filterBar: 'mt-12 p-5 sm:p-6',
  filterIntro: `text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  filterGrid: 'mt-5 grid gap-5 lg:grid-cols-3',
  filterLabel: `text-sm font-bold text-[${brand.blue}]`,
  filterChips: 'mt-3 flex flex-wrap gap-3',
  filterChip:
    'inline-flex items-center rounded-full border border-[#D7DEE5] bg-white px-4 py-2 text-sm font-semibold text-[#344054] transition hover:border-[#013667]/30 hover:bg-[#FBFCFD] hover:text-[#013667]',
  filterChipActive: 'border-[#013667] bg-[#FBFCFD] text-[#013667]',
  grid: 'mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  emptyState: `mt-12 rounded-3xl border border-[${brand.border}] bg-[${brand.white}] p-8 text-center text-sm leading-7 text-[${brand.text}] ${brand.shadow}`,
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

export default async function VehiclesPage() {
  const vehicleCatalog = await getCatalogVehicleListWithFallback();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHeader />
        <VehicleCatalogClient
          vehicles={vehicleCatalog}
          filterGroups={filterGroups}
          panelClassName={styles.panel}
          filterBarClassName={styles.filterBar}
          filterIntroClassName={styles.filterIntro}
          filterGridClassName={styles.filterGrid}
          filterLabelClassName={styles.filterLabel}
          filterChipsClassName={styles.filterChips}
          filterChipClassName={styles.filterChip}
          activeFilterChipClassName={styles.filterChipActive}
          gridClassName={styles.grid}
          cardClassName={`${styles.panel} ${styles.card}`}
          cardImageShellClassName={styles.cardImageShell}
          cardImageFrameClassName={styles.cardImageFrame}
          placeholderWrapClassName={styles.placeholderWrap}
          placeholderIconClassName={styles.placeholderIcon}
          placeholderTextClassName={styles.placeholderText}
          cardBodyClassName={styles.cardBody}
          chassisBadgeClassName={styles.chassisBadge}
          cardTitleClassName={styles.cardTitle}
          summaryClassName={styles.summary}
          priceRowClassName={styles.priceRow}
          priceLabelClassName={styles.priceLabel}
          priceValueClassName={styles.priceValue}
          priceNoteClassName={styles.priceNote}
          cardActionsClassName={styles.cardActions}
          detailsButtonClassName={styles.detailsButton}
          utilityButtonClassName={styles.utilityButton}
          emptyStateClassName={styles.emptyState}
          filterIntroLabel={copy.filterLabel}
          placeholderLabel={copy.placeholderLabel}
          detailsCta={copy.detailsCta}
          calculatorCta={copy.calculatorCta}
          priceLabel={copy.priceLabel}
          priceNote={copy.priceNote}
          noResultsMessage={copy.noResultsMessage}
        />
      </div>
    </main>
  );
}
