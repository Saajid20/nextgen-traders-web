import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCatalogVehicleDetail,
  type CatalogChassisGroup,
  type CatalogFeatureGroup,
  type CatalogGrade,
  type CatalogVehicleDetail,
} from '@/lib/catalog/catalog-data';

type VehiclePageProps = {
  params: Promise<{ slug: string }>;
};

type TextCardItem = {
  title: string;
  body: string;
};

type StatItem = {
  label: string;
  value: string;
  note: string;
};

type SnapshotItem = {
  label: string;
  value: string;
};

type MediaPlaceholder = {
  label: string;
  body: string;
  minHeightClass: string;
};

type NormalizedVehicleGrade = CatalogGrade;
type NormalizedChassisGroup = CatalogChassisGroup;
type NormalizedVehicleDetail = CatalogVehicleDetail;

type VehiclePageModel = {
  vehicle: NormalizedVehicleDetail;
  engineRange: string;
  quickFacts: string[];
  snapshotItems: SnapshotItem[];
  gradeCards: Array<
    NormalizedVehicleGrade & {
      calculatorHref: string;
    }
  >;
  comparisonGrades: NormalizedVehicleGrade[];
  chassisGroupItems: TextCardItem[];
  performanceItems: StatItem[];
  technologyItems: TextCardItem[];
  marketUpdates: NormalizedVehicleDetail['marketUpdates'];
  importAdvantageItems: ReadonlyArray<TextCardItem>;
  mediaPlaceholders: {
    primary: MediaPlaceholder;
    secondary: ReadonlyArray<MediaPlaceholder>;
  };
};

const brand = {
  blue: '#013667',
  red: '#a60000',
  white: '#FFFFFF',
  text: '#111827',
  mutedText: '#344054',
  border: '#D7DEE5',
  borderSoft: '#E6EBF0',
  borderDashed: '#C8D3DD',
  surface: '#FBFCFD',
} as const;

const classes = {
  page: `min-h-screen bg-[${brand.white}] px-4 py-12 sm:px-8 lg:px-16 lg:py-16`,
  container: 'mx-auto w-full max-w-7xl',
  section: `border-t border-[${brand.borderSoft}] py-16 lg:py-18`,
  firstSection: 'py-16 lg:py-18',
  label: `text-[11px] font-bold uppercase tracking-[0.24em] text-[${brand.blue}]`,
  title: `mt-4 text-3xl font-black tracking-[-0.03em] text-[${brand.blue}] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]`,
  body: `mt-5 max-w-3xl text-[15px] leading-8 text-[${brand.text}]`,
  card: `rounded-3xl border border-[${brand.border}] bg-[${brand.white}] shadow-[0_10px_26px_rgba(1,54,103,0.05)]`,
  pillBlue: `inline-flex items-center rounded-full border border-[${brand.blue}]/18 px-4 py-2 text-sm font-bold text-[${brand.blue}]`,
  pillNeutral: `inline-flex items-center rounded-full border border-[${brand.border}] px-4 py-2 text-sm font-semibold text-[${brand.mutedText}]`,
  primaryButton: `inline-flex items-center justify-center rounded-full bg-[${brand.red}] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-[${brand.white}] transition hover:opacity-90`,
  secondaryButton: `inline-flex items-center justify-center rounded-full border border-[${brand.blue}]/18 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[${brand.blue}] transition hover:border-[${brand.blue}]/30 hover:bg-[${brand.surface}]`,
  dashedPanel: `flex items-center justify-center rounded-2xl border border-dashed border-[${brand.borderDashed}] bg-[${brand.surface}]`,
} as const;

const copy = {
  overviewDescription: 'Overview data comes directly from the current vehicle record.',
  gradesDescription: 'Each grade below reflects the current chassis-group, positioning, and feature data stored in the catalog.',
  chassisGroupsDescription: 'These cards show the current chassis and powertrain groups available for this model in the catalog.',
  performanceDescription: 'Performance and drivetrain facts are summarized directly from the current chassis-group and grade records.',
  technologyDescription: 'Feature categories are aggregated directly from current grade feature records.',
  marketUpdatesDescription:
    'These updates come directly from the current Sri Lanka market update records linked to this vehicle.',
  comparisonDescription: 'Use this matrix to compare the factual differences between each available grade and chassis-group combination.',
  galleryDescription: 'Media slots remain ready for verified supplier or auction imagery when that data is available.',
  importAdvantageIntro:
    'This section explains the buying process around the vehicle, with transparency and local advisory value built into the journey.',
  finalCtaTitle: 'Build a clearer landed-cost picture before you commit',
  finalCtaBody:
    'Once you have shortlisted the right grade, the next decision is budget clarity. Move into the calculator to estimate landed cost, or speak with us directly if you want help matching this vehicle to your priorities.',
  importAdvantages: [
    {
      title: 'Auction-Sourced Transparency',
      body: 'We structure the advisory journey around real Japanese-market sourcing logic, helping buyers move from vehicle selection to bidding clarity with fewer surprises.',
    },
    {
      title: 'Live Landed Cost Estimation',
      body: 'Each vehicle page naturally leads into a landed-cost workflow so pricing discussions can stay practical, current, and decision-ready.',
    },
    {
      title: 'Finance & Lease Visibility',
      body: 'The product-page structure supports later integration with finance assumptions, making it easier to discuss affordability alongside import cost.',
    },
    {
      title: 'WhatsApp Consultation',
      body: 'Buyers can move from browsing to direct advisory support quickly, which is especially useful when comparing grades and shipment options.',
    },
  ] as const,
  mediaPlaceholders: {
    primary: {
      label: 'Primary Gallery Placeholder',
      body: 'Verified exterior or interior imagery has not been added to this catalog entry yet.',
      minHeightClass: 'min-h-[300px]',
    },
    secondary: [
      {
        label: 'Colour Options',
        body: 'Colour-specific media is not available for this entry yet.',
        minHeightClass: 'min-h-[137px]',
      },
      {
        label: 'Interior Media',
        body: 'Interior media is not available for this entry yet.',
        minHeightClass: 'min-h-[137px]',
      },
    ],
  },
} as const;

function formatEngineRange(vehicle: NormalizedVehicleDetail) {
  const engineValues = Array.from(
    new Set(vehicle.grades.map((grade) => grade.engineCC).filter((value): value is number => value !== null))
  ).sort((left, right) => left - right);

  if (engineValues.length === 0) {
    return 'Not specified';
  }

  if (engineValues.length === 1) {
    return `${engineValues[0].toLocaleString()} cc`;
  }

  return `${engineValues[0].toLocaleString()}-${engineValues[engineValues.length - 1].toLocaleString()} cc`;
}

function dedupeFeatureValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function getFeatureHighlights(grade: NormalizedVehicleGrade) {
  return grade.features.slice(0, 4);
}

function formatEngineValue(engineCC: number | null) {
  return engineCC !== null ? `${engineCC.toLocaleString()} cc` : 'Not specified';
}

function formatYearRange(chassisGroup: NormalizedChassisGroup) {
  if (chassisGroup.yearStart && chassisGroup.yearEnd) {
    return `${chassisGroup.yearStart}-${chassisGroup.yearEnd}`;
  }

  if (chassisGroup.yearStart) {
    return `${chassisGroup.yearStart} onward`;
  }

  if (chassisGroup.yearEnd) {
    return `Up to ${chassisGroup.yearEnd}`;
  }

  return 'Not specified';
}

function buildTransmissionSummary(chassisGroups: NormalizedChassisGroup[]) {
  const transmissions = Array.from(
    new Set(chassisGroups.map((group) => group.transmission).filter((value): value is string => Boolean(value)))
  );

  return transmissions.length > 0 ? transmissions.join(', ') : 'Not specified';
}

function buildDrivetrainSummary(chassisGroups: NormalizedChassisGroup[]) {
  const drivetrains = Array.from(
    new Set(chassisGroups.map((group) => group.drivetrain).filter((value): value is string => Boolean(value)))
  );

  return drivetrains.length > 0 ? drivetrains.join(', ') : 'Not specified';
}

function buildFuelTypeSummary(vehicle: NormalizedVehicleDetail) {
  const fuelTypes = Array.from(
    new Set(
      [
        vehicle.fuelType,
        ...vehicle.grades.map((grade) => grade.fuelType),
        ...vehicle.chassisGroups.map((group) => group.fuelType),
      ].filter((value): value is string => Boolean(value))
    )
  );

  return fuelTypes.length > 0 ? fuelTypes.join(', ') : 'Not specified';
}

function buildCalculatorHref(vehicle: Pick<NormalizedVehicleDetail, 'fuelType' | 'bodyType'>, grade: Pick<NormalizedVehicleGrade, 'engineCC'>) {
  const searchParams = new URLSearchParams();

  if (grade.engineCC !== null) {
    searchParams.set('engineCC', String(grade.engineCC));
  }

  if (vehicle.fuelType) {
    searchParams.set('fuelType', vehicle.fuelType);
  }

  if (vehicle.bodyType) {
    searchParams.set('vehicleType', vehicle.bodyType);
  }

  const query = searchParams.toString();
  return query ? `/calculator?${query}` : '/calculator';
}

function buildQuickFacts(vehicle: NormalizedVehicleDetail, engineRange: string) {
  return [
    `Body type: ${vehicle.bodyType ?? 'Not specified'}`,
    `Fuel type: ${buildFuelTypeSummary(vehicle)}`,
    `Engine range: ${engineRange}`,
    `Chassis groups: ${vehicle.chassisGroups.length}`,
  ];
}

function buildSnapshotItems(vehicle: NormalizedVehicleDetail, engineRange: string): SnapshotItem[] {
  const primaryChassisGroup = vehicle.chassisGroups[0];

  return [
    {
      label: 'Body Type',
      value: vehicle.bodyType ?? 'Not specified',
    },
    {
      label: 'Fuel Type',
      value: buildFuelTypeSummary(vehicle),
    },
    {
      label: 'Engine Range',
      value: engineRange,
    },
    {
      label: 'Grade Count',
      value: String(vehicle.grades.length),
    },
    {
      label: 'Market Focus',
      value: primaryChassisGroup?.marketFocus ?? 'Not specified',
    },
  ];
}

function buildChassisGroupItems(chassisGroups: NormalizedChassisGroup[]): TextCardItem[] {
  return chassisGroups.map((group) => ({
    title: group.displayName,
    body: [
      group.chassisCode ? `Chassis code: ${group.chassisCode}` : null,
      group.fuelType ? `Fuel type: ${group.fuelType}` : null,
      group.transmission ? `Transmission: ${group.transmission}` : null,
      group.drivetrain ? `Drivetrain: ${group.drivetrain}` : null,
      `Year range: ${formatYearRange(group)}`,
      group.engineCCMin !== null || group.engineCCMax !== null
        ? `Engine band: ${formatEngineValue(group.engineCCMin)} to ${formatEngineValue(group.engineCCMax)}`
        : null,
      group.notes ? `Notes: ${group.notes}` : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }));
}

function buildPerformanceItems(vehicle: NormalizedVehicleDetail, engineRange: string): StatItem[] {
  return [
    {
      label: 'Engine Range',
      value: engineRange,
      note: 'Derived from the current grade and chassis-group records.',
    },
    {
      label: 'Fuel Type',
      value: buildFuelTypeSummary(vehicle),
      note: 'Pulled from the current vehicle and chassis-group data.',
    },
    {
      label: 'Transmission',
      value: buildTransmissionSummary(vehicle.chassisGroups),
      note: 'Based on the transmissions recorded against each chassis group.',
    },
    {
      label: 'Drivetrain',
      value: buildDrivetrainSummary(vehicle.chassisGroups),
      note: 'Based on the drivetrains recorded against each chassis group.',
    },
  ];
}

function buildTechnologyItems(grades: NormalizedVehicleGrade[]): TextCardItem[] {
  const groupedFeatures = new Map<string, string[]>();

  for (const grade of grades) {
    for (const featureGroup of grade.featureGroups) {
      const currentItems = groupedFeatures.get(featureGroup.category) ?? [];
      groupedFeatures.set(featureGroup.category, [...currentItems, ...featureGroup.items]);
    }
  }

  return Array.from(groupedFeatures.entries()).map(([category, items]) => ({
    title: category,
    body: dedupeFeatureValues(items).join(', '),
  }));
}

function buildVehiclePageModel(vehicle: NormalizedVehicleDetail): VehiclePageModel {
  const engineRange = formatEngineRange(vehicle);

  return {
    vehicle,
    engineRange,
    quickFacts: buildQuickFacts(vehicle, engineRange),
    snapshotItems: buildSnapshotItems(vehicle, engineRange),
    gradeCards: vehicle.grades.map((grade) => ({
      ...grade,
      calculatorHref: buildCalculatorHref(vehicle, grade),
    })),
    comparisonGrades: vehicle.grades,
    chassisGroupItems: buildChassisGroupItems(vehicle.chassisGroups),
    performanceItems: buildPerformanceItems(vehicle, engineRange),
    technologyItems: buildTechnologyItems(vehicle.grades),
    marketUpdates: vehicle.marketUpdates,
    importAdvantageItems: copy.importAdvantages,
    mediaPlaceholders: copy.mediaPlaceholders,
  };
}

function formatMarketUpdateDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatImpactLevel(value: string) {
  return value
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getImpactLevelClasses(impactLevel: string) {
  switch (impactLevel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'border-[#a60000]/15 bg-[#fff4f4] text-[#a60000]';
    case 'medium':
    case 'watch':
      return 'border-[#013667]/15 bg-[#f4f8fc] text-[#013667]';
    default:
      return 'border-[#E4E9EE] bg-[#FBFCFD] text-[#344054]';
  }
}

function VehicleBreadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#344054]">
        <li>
          <Link href="/" className="transition hover:text-[#013667]">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/vehicles" className="transition hover:text-[#013667]">
            Vehicles
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-semibold text-[#013667]">{name}</li>
      </ol>
    </nav>
  );
}

function SectionShell({
  label,
  title,
  description,
  children,
  className = classes.section,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="max-w-3xl">
        <p className={classes.label}>{label}</p>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.body}>{description}</p>
      </div>
      <div className="mt-10 lg:mt-12">{children}</div>
    </section>
  );
}

function BasicCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${classes.card} ${className}`}>{children}</div>;
}

function EmptyStateCard({ title, body }: { title: string; body: string }) {
  return (
    <BasicCard className="p-7 sm:p-8">
      <h3 className="text-xl font-bold tracking-tight text-[#013667]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#111827]">{body}</p>
    </BasicCard>
  );
}

function TextCardGrid({ items, columnsClass = 'md:grid-cols-2 xl:grid-cols-3' }: { items: ReadonlyArray<TextCardItem>; columnsClass?: string }) {
  if (items.length === 0) {
    return <EmptyStateCard title="No data yet" body="Additional catalog data has not been added for this section yet." />;
  }

  return (
    <div className={`grid gap-6 ${columnsClass}`}>
      {items.map((item) => (
        <article key={item.title} className={`${classes.card} p-6 sm:p-7`}>
          <h3 className="text-xl font-bold tracking-tight text-[#013667]">{item.title}</h3>
          <p className="mt-4 text-sm leading-7 text-[#111827]">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function StatGrid({ items }: { items: StatItem[] }) {
  if (items.length === 0) {
    return <EmptyStateCard title="No performance data yet" body="Performance and drivetrain data has not been added for this section yet." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className={`${classes.card} p-6 sm:p-7`}>
          <p className={classes.label}>{item.label}</p>
          <p className="mt-4 text-xl font-black tracking-[-0.02em] text-[#013667]">{item.value}</p>
          <p className="mt-4 text-sm leading-7 text-[#111827]">{item.note}</p>
        </article>
      ))}
    </div>
  );
}

function SnapshotCard({ items }: { items: SnapshotItem[] }) {
  return (
    <BasicCard className="p-7 sm:p-8">
      <p className={classes.label}>Vehicle Snapshot</p>
      <dl className="mt-7 space-y-6">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-sm font-bold text-[#013667]">{item.label}</dt>
            <dd className="mt-2 text-sm leading-7 text-[#111827]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </BasicCard>
  );
}

function GradeFeatureGroups({ featureGroups }: { featureGroups: CatalogFeatureGroup[] }) {
  if (featureGroups.length === 0) {
    return <p className="mt-7 text-sm leading-7 text-[#344054]">No feature data available yet.</p>;
  }

  return (
    <div className="mt-7 space-y-6">
      {featureGroups.map((group) => (
        <div key={group.category}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#344054]">{group.category}</p>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-[#111827]">
            {group.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013667]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GradeCard({ grade }: { grade: VehiclePageModel['gradeCards'][number] }) {
  return (
    <article className={`${classes.card} flex h-full flex-col p-7 sm:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={classes.label}>Grade Option</p>
          <h3 className="mt-4 text-[1.75rem] font-black tracking-[-0.03em] text-[#013667]">{grade.name}</h3>
        </div>
        <div className="rounded-full border border-[#013667]/14 px-4 py-1.5 text-sm font-bold text-[#013667]">
          {formatEngineValue(grade.engineCC)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#344054]">
        <span className="rounded-full border border-[#E4E9EE] px-3 py-1.5">{grade.chassisGroupName}</span>
        {grade.drivetrain ? <span className="rounded-full border border-[#E4E9EE] px-3 py-1.5">{grade.drivetrain}</span> : null}
        {grade.transmission ? <span className="rounded-full border border-[#E4E9EE] px-3 py-1.5">{grade.transmission}</span> : null}
      </div>

      {grade.positioningSummary ? (
        <p className="mt-6 text-sm leading-7 text-[#111827]">{grade.positioningSummary}</p>
      ) : (
        <p className="mt-6 text-sm leading-7 text-[#344054]">Positioning summary not added yet.</p>
      )}

      <GradeFeatureGroups featureGroups={grade.featureGroups} />

      <div className="mt-7 border-t border-[#E4E9EE] pt-6 text-sm leading-7 text-[#111827]">
        <span className="font-bold text-[#013667]">Best for:</span>{' '}
        {grade.bestFor ?? 'Grade-specific buyer guidance has not been added yet.'}
      </div>

      <Link href={grade.calculatorHref} className={`${classes.primaryButton} mt-9 w-full`}>
        Calculate Landed Cost
      </Link>
    </article>
  );
}

function ComparisonTable({ grades }: { grades: VehiclePageModel['comparisonGrades'] }) {
  if (grades.length === 0) {
    return <EmptyStateCard title="No grades yet" body="Comparison data will appear here once grade records are added to the catalog." />;
  }

  const rows = [
    {
      label: 'Chassis Group',
      values: grades.map((grade) => grade.chassisGroupName),
    },
    {
      label: 'Chassis Code',
      values: grades.map((grade) => grade.chassisCode ?? 'Not specified'),
    },
    {
      label: 'Fuel Type',
      values: grades.map((grade) => grade.fuelType ?? 'Not specified'),
    },
    {
      label: 'Drivetrain',
      values: grades.map((grade) => grade.drivetrain ?? 'Not specified'),
    },
    {
      label: 'Transmission',
      values: grades.map((grade) => grade.transmission ?? 'Not specified'),
    },
    {
      label: 'Engine CC',
      values: grades.map((grade) => formatEngineValue(grade.engineCC)),
    },
    {
      label: 'Positioning',
      values: grades.map((grade) => grade.positioningSummary ?? 'Not specified'),
    },
    {
      label: 'Best For',
      values: grades.map((grade) => grade.bestFor ?? 'Not specified'),
    },
  ];

  return (
    <BasicCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E4E9EE] bg-[#FFFFFF]">
              <th className="sticky left-0 bg-[#FFFFFF] px-6 py-5 font-bold uppercase tracking-[0.12em] text-[#344054]">
                Specification
              </th>
              {grades.map((grade) => (
                <th key={grade.id} className="min-w-64 px-6 py-5 align-top text-[#013667]">
                  <div className="text-sm font-black uppercase tracking-[0.12em]">{grade.name}</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#344054]">
                    {grade.chassisGroupName}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="border-b border-[#E4E9EE] bg-[#FBFCFD]">
              <th className="sticky left-0 bg-[#FBFCFD] px-6 py-4 font-bold uppercase tracking-[0.12em] text-[#344054]">
                Feature Highlights
              </th>
              {grades.map((grade) => (
                <th key={`${grade.id}-features`} className="px-6 py-4">
                  {getFeatureHighlights(grade).length > 0 ? (
                    <ul className="space-y-2 text-left text-sm leading-6 text-[#111827]">
                      {getFeatureHighlights(grade).map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013667]" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm font-medium text-[#344054]">No feature data</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[#EAEFF3] align-top last:border-b-0">
                <th className="sticky left-0 bg-[#FFFFFF] px-6 py-5 font-bold text-[#111827]">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${grades[index]?.id ?? index}`} className="px-6 py-5 leading-7 text-[#111827]">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BasicCard>
  );
}

function MarketUpdatesSection({ updates }: { updates: VehiclePageModel['marketUpdates'] }) {
  if (updates.length === 0) {
    return null;
  }

  return (
    <SectionShell
      label="Sri Lanka Market Updates"
      title="Current market context for this vehicle"
      description={copy.marketUpdatesDescription}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {updates.map((update) => {
          const effectiveDate = formatMarketUpdateDate(update.effectiveDate);

          return (
            <article key={update.id} className={`${classes.card} p-6 sm:p-7`}>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${getImpactLevelClasses(
                    update.impactLevel
                  )}`}
                >
                  {formatImpactLevel(update.impactLevel)}
                </span>
                {effectiveDate ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#344054]">
                    Effective {effectiveDate}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#013667]">{update.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#111827]">{update.summary}</p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ChassisGroupSection({ items }: { items: TextCardItem[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div>
        <div className="max-w-3xl">
          <p className={classes.label}>Chassis & Powertrain Groups</p>
          <h2 className={classes.title}>Structured for the actual import variants in the catalog</h2>
          <p className={classes.body}>Each card below reflects the factual chassis-group records currently linked to this vehicle.</p>
        </div>
      </div>

      <TextCardGrid items={items} columnsClass="sm:grid-cols-2" />
    </div>
  );
}

function MediaPlaceholderPanel({ item }: { item: MediaPlaceholder }) {
  return (
    <BasicCard className="p-6">
      <div className={`${classes.dashedPanel} ${item.minHeightClass}`}>
        <div className="max-w-sm text-center">
          <p className={classes.label}>{item.label}</p>
          <p className="mt-4 text-base leading-7 text-[#111827]">{item.body}</p>
        </div>
      </div>
    </BasicCard>
  );
}

function FinalCta() {
  return (
    <section className={classes.section}>
      <BasicCard className="p-8 sm:p-10">
        <p className={classes.label}>Next Step</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-[#013667] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]">
          {copy.finalCtaTitle}
        </h2>
        <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#111827]">{copy.finalCtaBody}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/calculator" className={classes.primaryButton}>
            Calculate Landed Cost
          </Link>
          <a
            href="https://wa.me/94770000000"
            target="_blank"
            rel="noreferrer"
            className={classes.secondaryButton}
          >
            Contact via WhatsApp
          </a>
        </div>
      </BasicCard>
    </section>
  );
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getCatalogVehicleDetail(slug);

  if (!vehicle) {
    notFound();
  }

  const pageModel = buildVehiclePageModel(vehicle);

  return (
    <main className={classes.page}>
      <div className={classes.container}>
        <section className="border-b border-[#E6EBF0] pb-16 lg:pb-18">
          <VehicleBreadcrumb name={pageModel.vehicle.name} />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
            <div>
              <p className={classes.label}>Vehicle Advisory</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-[#013667] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.98]">
                {pageModel.vehicle.name}
              </h1>
              {pageModel.vehicle.bestFor ? (
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#111827]">{pageModel.vehicle.bestFor}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className={classes.pillBlue}>Chassis: {pageModel.vehicle.chassis}</div>
                <div className={classes.pillNeutral}>{pageModel.vehicle.grades.length} grade options</div>
                <div className={classes.pillNeutral}>Engine range {pageModel.engineRange}</div>
              </div>
            </div>

            <BasicCard className="p-7 sm:p-8">
              <p className={classes.label}>Quick Facts</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-[#111827]">
                {pageModel.quickFacts.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013667]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link href="/calculator" className={`${classes.primaryButton} flex-1`}>
                  Calculate Landed Cost
                </Link>
                <a
                  href="https://wa.me/94770000000"
                  target="_blank"
                  rel="noreferrer"
                  className={`${classes.secondaryButton} flex-1`}
                >
                  Contact via WhatsApp
                </a>
              </div>
            </BasicCard>
          </div>
        </section>

        <SectionShell
          label="Vehicle Overview"
          title={pageModel.vehicle.name}
          description={copy.overviewDescription}
          className={classes.firstSection}
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {pageModel.vehicle.overview ? (
              <BasicCard className="p-7 sm:p-8">
                <div className="space-y-5 text-[15px] leading-8 text-[#111827]">
                  <p>{pageModel.vehicle.overview}</p>
                </div>
              </BasicCard>
            ) : (
              <EmptyStateCard title="Overview not available yet" body="This vehicle record does not currently include an overview field." />
            )}

            <SnapshotCard items={pageModel.snapshotItems} />
          </div>
        </SectionShell>

        <SectionShell
          label="Grades Overview"
          title={`Choose the right ${pageModel.vehicle.name} grade`}
          description={copy.gradesDescription}
        >
          {pageModel.gradeCards.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {pageModel.gradeCards.map((grade) => (
                <GradeCard key={grade.id} grade={grade} />
              ))}
            </div>
          ) : (
            <EmptyStateCard title="No grades added yet" body="This vehicle record does not currently have any grade entries." />
          )}
        </SectionShell>

        <section className={classes.section}>
          <ChassisGroupSection items={pageModel.chassisGroupItems} />
        </section>

        <SectionShell
          label="Performance & Efficiency"
          title="Structured around current mechanical data"
          description={copy.performanceDescription}
        >
          <StatGrid items={pageModel.performanceItems} />
        </SectionShell>

        <SectionShell
          label="Safety & Technology"
          title="Feature categories from current grade data"
          description={copy.technologyDescription}
        >
          <TextCardGrid items={pageModel.technologyItems} />
        </SectionShell>

        <MarketUpdatesSection updates={pageModel.marketUpdates} />

        <SectionShell
          label="Grade Comparison"
          title="Compare the lineup side by side"
          description={copy.comparisonDescription}
        >
          <ComparisonTable grades={pageModel.comparisonGrades} />
        </SectionShell>

        <SectionShell
          label="Gallery & Presentation"
          title="Prepared for colours, media, and verified visuals"
          description={copy.galleryDescription}
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <MediaPlaceholderPanel item={pageModel.mediaPlaceholders.primary} />

            <div className="grid gap-6">
              {pageModel.mediaPlaceholders.secondary.map((item) => (
                <MediaPlaceholderPanel key={item.label} item={item} />
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell
          label="NextGen Import Advantage"
          title="Why import this vehicle through NextGen Traders"
          description={copy.importAdvantageIntro}
        >
          <TextCardGrid items={pageModel.importAdvantageItems} columnsClass="sm:grid-cols-2" />
        </SectionShell>

        <FinalCta />
      </div>
    </main>
  );
}
