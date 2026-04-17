import Link from 'next/link';
import { notFound } from 'next/navigation';
import { vehicles, type VehicleCatalogItem, type VehicleGrade } from '@/lib/mockVehicles';

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

type ComparisonRowDefinition = {
  label: string;
  getValue: (grade: VehicleGrade, vehicle: VehicleCatalogItem) => string;
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

type VehicleNarrative = {
  positioning: string;
  overviewTitle: string;
  overviewParagraphs: string[];
  practicalityLead: string;
  practicalityNarrative: string[];
  practicalityItems: TextCardItem[];
  performanceItems: StatItem[];
  safetyItems: TextCardItem[];
};

type VehiclePageModel = {
  vehicle: VehicleCatalogItem;
  engineRange: string;
  quickAdvisory: ReadonlyArray<string>;
  narrative: VehicleNarrative;
  snapshotItems: SnapshotItem[];
  gradeCards: Array<
    VehicleGrade & {
      bestFor: string;
    }
  >;
  comparisonRows: Array<{
    label: string;
    values: string[];
  }>;
  technologyItems: TextCardItem[];
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
  shadow: 'shadow-[0_12px_30px_rgba(1,54,103,0.06)]',
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

const editorialCopy = {
  overviewIntro:
    'A premium advisory summary designed to help buyers understand how the vehicle fits real Sri Lankan ownership needs before moving into grade and cost comparison.',
  gradesIntro:
    'Each grade is presented as a buying guide rather than a bare specification card, so you can quickly see how comfort, equipment, and ownership logic change across the lineup.',
  comparisonIntro:
    'A cleaner decision matrix for shortlisting the grade that best suits your budget, convenience priorities, and desired presentation.',
  performanceIntro:
    'This is not a performance-led presentation. The emphasis is on urban ease, manageable ownership expectations, and the kind of engine and transmission logic buyers actually care about when importing for local use.',
  safetyIntro:
    'We surface what is reasonable from the current data, while leaving room for verified auction-sheet and supplier details to replace placeholders as the catalog matures.',
  galleryIntro:
    'A future-ready space for exterior views, interior details, colour options, and auction-backed presentation assets.',
  importAdvantageIntro:
    'An OEM page can explain the product. This section explains the buying process around it, with transparency and local advisory value built into the journey.',
  finalCtaTitle: 'Build a clearer landed-cost picture before you commit',
  finalCtaBody:
    'Once you have shortlisted the right grade, the next decision is budget clarity. Move into the calculator to estimate landed cost, or speak with us directly if you want help matching this vehicle to your priorities.',
  quickAdvisory: [
    'Compare each grade with a clearer view of comfort, styling, and urban practicality.',
    'Use the landed-cost calculator to turn shortlist decisions into budgeting clarity.',
    'Keep the structure ready for future supplier, media, and finance data as the catalog grows.',
  ],
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
    {
      title: 'Sri Lankan Market Focus',
      body: 'The editorial tone is built around local use cases, ownership logic, and import practicality rather than generic overseas brochure language.',
    },
  ],
  mediaPlaceholders: {
    primary: {
      label: 'Primary Gallery Placeholder',
      body: 'Exterior hero, interior preview, or verified supplier media can be inserted here later.',
      minHeightClass: 'min-h-[300px]',
    },
    secondary: [
      {
        label: 'Colour Options',
        body: 'Reserved for verified paint names and finish swatches.',
        minHeightClass: 'min-h-[137px]',
      },
      {
        label: 'Interior Media',
        body: 'Reserved for dashboard, seat layout, and cargo-area visuals.',
        minHeightClass: 'min-h-[137px]',
      },
    ],
  },
} as const;

const comparisonRowDefinitions: ComparisonRowDefinition[] = [
  {
    label: 'Grade',
    getValue: (grade) => grade.name,
  },
  {
    label: 'Engine CC',
    getValue: (grade) => `${grade.engineCC.toLocaleString()} cc`,
  },
  {
    label: 'Key Features',
    getValue: (grade) => summarizeKeyFeatures(grade),
  },
  {
    label: 'Convenience',
    getValue: (grade) => getConvenienceLevel(grade),
  },
  {
    label: 'Styling',
    getValue: (grade) => getStylingLevel(grade),
  },
  {
    label: 'Best For',
    getValue: (grade, vehicle) => stripBestForPrefix(getGradeBestFor(vehicle.name, grade)),
  },
];

function formatEngineRange(vehicle: VehicleCatalogItem) {
  const engineValues = Array.from(new Set(vehicle.grades.map((grade) => grade.engineCC))).sort((left, right) => left - right);

  if (engineValues.length === 1) {
    return `${engineValues[0].toLocaleString()} cc`;
  }

  return `${engineValues[0].toLocaleString()}-${engineValues[engineValues.length - 1].toLocaleString()} cc`;
}

function hasFeature(grade: VehicleGrade, pattern: RegExp) {
  return grade.features.some((feature) => pattern.test(feature));
}

function summarizeKeyFeatures(grade: VehicleGrade) {
  if (grade.features.length === 0) {
    return 'Not specified';
  }

  return grade.features.slice(0, 3).join(', ');
}

function getConvenienceLevel(grade: VehicleGrade) {
  return hasFeature(grade, /Power Windows|Keyless Entry|Push Start|AGS/i) ? 'Enhanced' : 'Standard';
}

function getStylingLevel(grade: VehicleGrade) {
  return hasFeature(grade, /LED|Custom Aero|Alloy|Leather/i) ? 'Enhanced' : 'Standard';
}

function getGradeBestFor(vehicleName: string, grade: VehicleGrade) {
  if (hasFeature(grade, /Manual Windows|Basic Audio/i)) {
    return `Best for buyers who want straightforward ${vehicleName.toLowerCase()} ownership with a value-first specification.`;
  }

  if (hasFeature(grade, /AGS|Power Windows|Keyless Entry|Push Start/i)) {
    return 'Best for daily urban use where convenience features matter as much as practicality.';
  }

  if (hasFeature(grade, /LED|Alloy|Leather|Custom Aero/i)) {
    return 'Best for buyers who want a more premium look and an upgraded day-to-day feel.';
  }

  return 'Best for practical use with a balanced specification approach.';
}

function stripBestForPrefix(text: string) {
  return text.replace(/^Best for /, '');
}

function getVehicleProfile(vehicle: VehicleCatalogItem) {
  const maxEngine = Math.max(...vehicle.grades.map((grade) => grade.engineCC));

  if (maxEngine <= 660) {
    return 'kei';
  }

  if (/roomy/i.test(vehicle.name)) {
    return 'family-box';
  }

  return 'general';
}

function buildNarrative(vehicle: VehicleCatalogItem): VehicleNarrative {
  const engineRange = formatEngineRange(vehicle);
  const profile = getVehicleProfile(vehicle);
  const hasConvenience = vehicle.grades.some((grade) => hasFeature(grade, /AGS|Power Windows|Keyless Entry|Push Start/i));

  const narrativeByProfile: Record<string, VehicleNarrative> = {
    kei: {
      positioning:
        'A compact utility-focused import built for dense city driving, commercial flexibility, and low running-cost ownership.',
      overviewTitle: `Why Choose the ${vehicle.name}`,
      overviewParagraphs: [
        `${vehicle.name} is a sensible choice for buyers who want maximum practicality from a compact footprint. Its kei-class dimensions make parking, lane changes, and daily errands easier in congested urban areas while still preserving useful cabin versatility.`,
        'For Sri Lankan buyers, this kind of package is especially appealing when the priority is predictable ownership cost, straightforward usability, and a body style that can work for family, trade, or mixed personal-business use.',
        "The grade spread also matters. Some versions stay focused on simple value, while others add convenience features that make day-to-day driving feel more comfortable without moving away from the vehicle's practical core.",
      ],
      practicalityLead:
        'The package is designed around real-world usefulness, with a boxy profile, easy entry, and a cabin layout that supports frequent loading, short urban trips, and mixed passenger needs.',
      practicalityNarrative: [
        'Buyers often need more than a spec sheet. They need to understand how a vehicle behaves during school runs, office commutes, loading groceries, carrying relatives, or simply navigating narrow urban roads without stress.',
        'This section is intentionally structured for future expansion with verified luggage measurements, seat configurations, and real cabin imagery while still giving you a useful decision-making framework today.',
      ],
      practicalityItems: [
        {
          title: 'Cabin Utility',
          body: 'An upright body and efficient footprint help create usable interior space for people, parcels, or everyday equipment.',
        },
        {
          title: 'Seat Flexibility',
          body: 'Selected grades indicate folding-seat practicality, making the vehicle easier to adapt between passenger and cargo use.',
        },
        {
          title: 'Urban Ease',
          body: 'Compact proportions support easier parking and low-stress maneuvering in tighter residential or commercial streets.',
        },
        {
          title: 'Family Friendliness',
          body: 'Simple ingress, manageable dimensions, and light-duty practicality make it suitable for routine daily use.',
        },
      ],
      performanceItems: [
        {
          label: 'Engine Class',
          value: `${engineRange} petrol`,
          note: 'Sized for efficient daily running and predictable city use.',
        },
        {
          label: 'Transmission Focus',
          value: hasConvenience ? 'AGS available on selected grades' : 'Transmission details to be expanded',
          note: 'Current grade data suggests an urban-friendly setup rather than performance tuning.',
        },
        {
          label: 'Efficiency Positioning',
          value: 'Cost-conscious daily ownership',
          note: 'A practical fit for buyers prioritizing manageable fuel and maintenance expectations.',
        },
        {
          label: 'Driving Character',
          value: 'Easy to place in traffic',
          note: 'The format suits routine commuting, errands, and lower-speed urban movement.',
        },
      ],
      safetyItems: [
        {
          title: 'Visibility',
          body: 'High seating and a practical body style generally support easier judgment in urban traffic and parking situations.',
        },
        {
          title: 'Convenience Access',
          body: 'Grade-dependent items such as keyless entry or power windows improve everyday usability where equipped.',
        },
        {
          title: 'Basic Technology',
          body: 'Current data confirms practical comfort features first, with scope to add full OEM specification detail later.',
        },
        {
          title: 'Spec Transparency',
          body: 'The page is structured to accommodate future verified safety and assistance data without overstating current information.',
        },
      ],
    },
    'family-box': {
      positioning:
        'A city-family compact with upright packaging, modern convenience potential, and easy everyday usability for Sri Lankan roads.',
      overviewTitle: `Why Choose the ${vehicle.name}`,
      overviewParagraphs: [
        `${vehicle.name} stands out by offering a practical family-oriented cabin within a compact exterior that remains easy to manage in urban conditions. It is the sort of vehicle that makes sense for buyers who want passenger comfort without stepping into a much larger body size.`,
        'For Sri Lankan use, that balance is valuable. The vehicle is easy enough for school runs, office commuting, and daily errands, while still presenting the convenience and styling upgrades many buyers expect from a modern Japanese import.',
        'Its grades also give buyers a clearer choice between straightforward value and a more premium presentation, which is exactly the kind of comparison an import advisory page should help you make before budgeting landed cost.',
      ],
      practicalityLead:
        'The focus here is efficient family packaging, with a layout that supports regular passenger use, everyday loading needs, and a more comfortable city-driving experience.',
      practicalityNarrative: [
        'A family-friendly import still needs to feel manageable in tight roads and routine traffic, not just spacious on paper. That balance is where this format is strongest.',
        'The structure below is ready for future verified cargo figures, seat-layout details, and real interior visuals without forcing another redesign later.',
      ],
      practicalityItems: [
        {
          title: 'Passenger Comfort',
          body: 'The upright silhouette suggests generous headroom and easy access for routine family travel and short urban trips.',
        },
        {
          title: 'Luggage Practicality',
          body: 'This body style is well suited to groceries, school bags, and day-to-day cargo without feeling oversized.',
        },
        {
          title: 'Urban Usability',
          body: 'Compact exterior dimensions help the vehicle remain approachable in tighter streets and parking environments.',
        },
        {
          title: 'Everyday Flexibility',
          body: 'The grade strategy blends convenience equipment and styling upgrades to suit different buyer priorities.',
        },
      ],
      performanceItems: [
        {
          label: 'Engine Class',
          value: `${engineRange} petrol`,
          note: 'Appropriately sized for city-family driving and regular daily duties.',
        },
        {
          label: 'Transmission Focus',
          value: 'Urban-oriented automatic convenience expected',
          note: 'Exact transmission detail can be inserted later once verified per grade.',
        },
        {
          label: 'Efficiency Positioning',
          value: 'Balanced daily efficiency',
          note: 'A practical middle ground for comfort, drivability, and routine fuel use.',
        },
        {
          label: 'Driving Character',
          value: 'Light, easy, family-friendly',
          note: 'The vehicle is positioned more around usability than aggressive performance.',
        },
      ],
      safetyItems: [
        {
          title: 'Convenience Technology',
          body: 'Current grade data points to useful ownership features such as push start and premium trim convenience items.',
        },
        {
          title: 'Visibility Support',
          body: 'A compact family format typically helps with parking confidence and day-to-day road judgment.',
        },
        {
          title: 'Driver Assistance Readiness',
          body: 'This layout is ready for future verified assistance-system and safety-package data from supplier records.',
        },
        {
          title: 'Ownership Confidence',
          body: 'The emphasis is on transparent specification guidance rather than overstated claims about unverified equipment.',
        },
      ],
    },
    general: {
      positioning:
        'A practical Japanese import built to balance everyday comfort, specification clarity, and dependable value.',
      overviewTitle: `Why Choose the ${vehicle.name}`,
      overviewParagraphs: [
        `${vehicle.name} is positioned as a sensible all-rounder for buyers who want a practical Japanese import with a clear specification story and dependable day-to-day usability.`,
        'That matters in the Sri Lankan market, where buyers often compare total landed cost against long-term convenience, cabin usefulness, and how confidently a vehicle fits into local urban driving routines.',
        'The current grade spread suggests meaningful differences in comfort and presentation, making this page a useful advisory starting point before deeper import and finance decisions are made.',
      ],
      practicalityLead:
        'The format prioritizes a balanced ownership experience, combining cabin usability, straightforward controls, and practical day-to-day flexibility.',
      practicalityNarrative: [
        'Practicality is more than dimensions on a catalog sheet. Buyers need to understand how the vehicle supports routine passenger use, carrying needs, and day-to-day local road conditions.',
        'This section keeps that conversation structured now, while remaining ready for future hard data and verified media.',
      ],
      practicalityItems: [
        {
          title: 'Cabin Use',
          body: 'Designed to support routine commuting, passenger needs, and normal everyday carrying duties.',
        },
        {
          title: 'Comfort Fit',
          body: 'The overall package is aimed at ease of use rather than complexity, which supports long-term ownership comfort.',
        },
        {
          title: 'Local Practicality',
          body: 'Its likely appeal comes from a blend of reasonable size, manageable running expectations, and accessible equipment levels.',
        },
        {
          title: 'Flexible Buying Logic',
          body: 'Different grades help buyers choose between simpler value and additional convenience or styling touches.',
        },
      ],
      performanceItems: [
        {
          label: 'Engine Class',
          value: `${engineRange} petrol`,
          note: 'Structured for practical use rather than headline performance.',
        },
        {
          label: 'Transmission Focus',
          value: 'To be confirmed by grade',
          note: 'Future supplier-linked data can make this section exact without changing the layout.',
        },
        {
          label: 'Efficiency Positioning',
          value: 'Ownership-conscious',
          note: 'The page is built around realistic advisory value rather than unverified claims.',
        },
        {
          label: 'Driving Character',
          value: 'Daily-use oriented',
          note: 'Suitable for mixed commuting, errands, and typical urban-road requirements.',
        },
      ],
      safetyItems: [
        {
          title: 'Safety Support',
          body: 'Verified grade-level safety equipment can be introduced later without restructuring the page system.',
        },
        {
          title: 'Driver Convenience',
          body: 'Current features suggest a focus on usability first, with additional grade differences shown clearly below.',
        },
        {
          title: 'Visibility & Control',
          body: 'The format is intended to surface practical ownership cues before exact OEM safety sheets are added.',
        },
        {
          title: 'Technology Readiness',
          body: 'This section is ready to absorb richer supplier or auction data as the catalog evolves.',
        },
      ],
    },
  };

  return narrativeByProfile[profile];
}

function buildTechnologyItems(vehicle: VehicleCatalogItem, fallbackSafetyItems: TextCardItem[]) {
  const features = vehicle.grades.flatMap((grade) => grade.features);
  const hasConvenience = features.some((feature) => /Keyless|Push Start|Power Windows|AGS/i.test(feature));
  const hasPremiumTrim = features.some((feature) => /Leather|Alloy|LED|Custom Aero/i.test(feature));
  const hasEntrySystem = features.some((feature) => /Keyless|Push Start/i.test(feature));

  return [
    fallbackSafetyItems[0],
    {
      title: 'Convenience Tech',
      body: hasConvenience
        ? 'Current grade data confirms practical comfort features that make daily ownership smoother.'
        : 'Convenience specification is currently basic in the dataset and ready for richer detail later.',
    },
    {
      title: 'Visibility',
      body: 'A compact Japanese import format typically prioritizes everyday visibility and approachable road manners for city use.',
    },
    {
      title: 'Driver Assistance',
      body: 'Future supplier-linked data can populate assistance systems here once confirmed from auction sheets or catalog records.',
    },
    {
      title: 'Entry System',
      body: hasEntrySystem
        ? 'Selected grades already indicate easier entry and start-up convenience.'
        : 'Entry-system detail is currently limited and can be expanded grade by grade.',
    },
    {
      title: 'Infotainment Comfort',
      body: hasPremiumTrim
        ? 'Higher trims suggest a stronger comfort and presentation focus, even where full media specification is still pending.'
        : 'This section is prepared for future audio, connectivity, and comfort-equipment detail.',
    },
  ];
}

function buildVehiclePageModel(vehicle: VehicleCatalogItem): VehiclePageModel {
  const narrative = buildNarrative(vehicle);
  const engineRange = formatEngineRange(vehicle);

  return {
    vehicle,
    engineRange,
    quickAdvisory: editorialCopy.quickAdvisory,
    narrative,
    snapshotItems: [
      {
        label: 'Body Purpose',
        value: 'Practical daily use with a clear focus on Sri Lankan import suitability.',
      },
      {
        label: 'Grade Spread',
        value: `${vehicle.grades.length} options ranging from core practicality to added convenience or styling.`,
      },
      {
        label: 'Import Advisory Fit',
        value: 'Suitable for buyers comparing usability, cost confidence, and spec clarity before committing.',
      },
    ],
    gradeCards: vehicle.grades.map((grade) => ({
      ...grade,
      bestFor: getGradeBestFor(vehicle.name, grade),
    })),
    comparisonRows: comparisonRowDefinitions.map((row) => ({
      label: row.label,
      values: vehicle.grades.map((grade) => row.getValue(grade, vehicle)),
    })),
    technologyItems: buildTechnologyItems(vehicle, narrative.safetyItems),
    importAdvantageItems: editorialCopy.importAdvantages,
    mediaPlaceholders: editorialCopy.mediaPlaceholders,
  };
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

function TextCardGrid({ items, columnsClass = 'md:grid-cols-2 xl:grid-cols-3' }: { items: ReadonlyArray<TextCardItem>; columnsClass?: string }) {
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

function GradeCard({ grade }: { grade: VehiclePageModel['gradeCards'][number] }) {
  return (
    <article className={`${classes.card} flex h-full flex-col p-7 sm:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={classes.label}>Grade Option</p>
          <h3 className="mt-4 text-[1.75rem] font-black tracking-[-0.03em] text-[#013667]">{grade.name}</h3>
        </div>
        <div className="rounded-full border border-[#013667]/14 px-4 py-1.5 text-sm font-bold text-[#013667]">
          {grade.engineCC.toLocaleString()} cc
        </div>
      </div>

      <ul className="mt-7 space-y-3.5 text-sm leading-7 text-[#111827]">
        {grade.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#013667]" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <p className="mt-7 border-t border-[#E4E9EE] pt-6 text-sm leading-7 text-[#111827]">
        <span className="font-bold text-[#013667]">Best for:</span> {grade.bestFor}
      </p>

      <Link href="/calculator" className={`${classes.primaryButton} mt-9 w-full`}>
        Calculate Landed Cost
      </Link>
    </article>
  );
}

function ComparisonTable({
  gradeNames,
  rows,
}: {
  gradeNames: string[];
  rows: VehiclePageModel['comparisonRows'];
}) {
  return (
    <BasicCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E4E9EE] bg-[#FFFFFF]">
              <th className="sticky left-0 bg-[#FFFFFF] px-6 py-5 font-bold uppercase tracking-[0.12em] text-[#344054]">
                Specification
              </th>
              {gradeNames.map((name) => (
                <th key={name} className="min-w-55 px-6 py-5 font-bold uppercase tracking-[0.12em] text-[#013667]">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[#EAEFF3] align-top last:border-b-0">
                <th className="sticky left-0 bg-[#FFFFFF] px-6 py-5 font-bold text-[#111827]">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${gradeNames[index]}`} className="px-6 py-5 leading-7 text-[#111827]">
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

function PracticalitySection({ narrative }: { narrative: VehicleNarrative }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div>
        <div className="max-w-3xl">
          <p className={classes.label}>Interior & Practicality</p>
          <h2 className={classes.title}>Built around everyday space and usability</h2>
          <p className={classes.body}>{narrative.practicalityLead}</p>
        </div>

        <BasicCard className="mt-10 p-7 sm:p-8">
          <div className="space-y-5 text-[15px] leading-8 text-[#111827]">
            {narrative.practicalityNarrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </BasicCard>
      </div>

      <TextCardGrid items={narrative.practicalityItems} columnsClass="sm:grid-cols-2" />
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
          {editorialCopy.finalCtaTitle}
        </h2>
        <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#111827]">{editorialCopy.finalCtaBody}</p>

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
  const vehicle = vehicles.find((item) => item.slug === slug);

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
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#111827]">{pageModel.narrative.positioning}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className={classes.pillBlue}>Chassis: {pageModel.vehicle.chassis}</div>
                <div className={classes.pillNeutral}>{pageModel.vehicle.grades.length} grade options</div>
                <div className={classes.pillNeutral}>Engine range {pageModel.engineRange}</div>
              </div>
            </div>

            <BasicCard className="p-7 sm:p-8">
              <p className={classes.label}>Quick Advisory</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-[#111827]">
                {pageModel.quickAdvisory.map((item) => (
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
          label="Editorial Overview"
          title={pageModel.narrative.overviewTitle}
          description={editorialCopy.overviewIntro}
          className={classes.firstSection}
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <BasicCard className="p-7 sm:p-8">
              <div className="space-y-5 text-[15px] leading-8 text-[#111827]">
                {pageModel.narrative.overviewParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </BasicCard>

            <SnapshotCard items={pageModel.snapshotItems} />
          </div>
        </SectionShell>

        <SectionShell
          label="Grades Overview"
          title={`Choose the right ${pageModel.vehicle.name} grade`}
          description={editorialCopy.gradesIntro}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {pageModel.gradeCards.map((grade) => (
              <GradeCard key={grade.name} grade={grade} />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          label="Grade Comparison"
          title="Compare the lineup side by side"
          description={editorialCopy.comparisonIntro}
        >
          <ComparisonTable
            gradeNames={pageModel.vehicle.grades.map((grade) => grade.name)}
            rows={pageModel.comparisonRows}
          />
        </SectionShell>

        <section className={classes.section}>
          <PracticalitySection narrative={pageModel.narrative} />
        </section>

        <SectionShell
          label="Performance & Efficiency"
          title="Structured around real-world drivability"
          description={editorialCopy.performanceIntro}
        >
          <StatGrid items={pageModel.narrative.performanceItems} />
        </SectionShell>

        <SectionShell
          label="Safety & Technology"
          title="Future-ready specification space with honest guidance"
          description={editorialCopy.safetyIntro}
        >
          <TextCardGrid items={pageModel.technologyItems} />
        </SectionShell>

        <SectionShell
          label="Gallery & Presentation"
          title="Prepared for colours, media, and verified visuals"
          description={editorialCopy.galleryIntro}
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
          description={editorialCopy.importAdvantageIntro}
        >
          <TextCardGrid items={pageModel.importAdvantageItems} columnsClass="sm:grid-cols-2" />
        </SectionShell>

        <FinalCta />
      </div>
    </main>
  );
}
