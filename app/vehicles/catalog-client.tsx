'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { VehicleFilterBar } from './filter-bar';
import type { FilterGroup, NormalizedVehicleCatalogItem, VehicleFilterState } from './catalog-types';

type VehicleCatalogClientProps = {
  vehicles: NormalizedVehicleCatalogItem[];
  filterGroups: ReadonlyArray<FilterGroup>;
  panelClassName: string;
  filterBarClassName: string;
  filterIntroClassName: string;
  filterGridClassName: string;
  filterLabelClassName: string;
  filterChipsClassName: string;
  filterChipClassName: string;
  activeFilterChipClassName: string;
  gridClassName: string;
  cardClassName: string;
  cardImageShellClassName: string;
  cardImageFrameClassName: string;
  placeholderWrapClassName: string;
  placeholderIconClassName: string;
  placeholderTextClassName: string;
  cardBodyClassName: string;
  chassisBadgeClassName: string;
  cardTitleClassName: string;
  summaryClassName: string;
  priceRowClassName: string;
  priceLabelClassName: string;
  priceValueClassName: string;
  priceNoteClassName: string;
  cardActionsClassName: string;
  detailsButtonClassName: string;
  utilityButtonClassName: string;
  emptyStateClassName: string;
  filterIntroLabel: string;
  placeholderLabel: string;
  detailsCta: string;
  calculatorCta: string;
  priceLabel: string;
  priceNote: string;
  noResultsMessage: string;
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

const placeholderPrices: Record<string, string> = {
  'suzuki-every': 'From LKR 8.5M',
  'toyota-roomy': 'From LKR 10.9M',
};

function getInitialFilters(groups: ReadonlyArray<FilterGroup>): VehicleFilterState {
  return {
    fuelType: groups.find((group) => group.key === 'fuelType')?.options[0]?.value ?? 'all',
    bodyType: groups.find((group) => group.key === 'bodyType')?.options[0]?.value ?? 'all',
    drivetrain: groups.find((group) => group.key === 'drivetrain')?.options[0]?.value ?? 'all',
  };
}

function getEngineValues(vehicle: NormalizedVehicleCatalogItem) {
  const gradeValues = Array.from(
    new Set(vehicle.grades.map((grade) => grade.engineCC).filter((value): value is number => value !== null))
  ).sort((left, right) => left - right);

  if (gradeValues.length > 0) {
    return gradeValues;
  }

  return vehicle.engineCC !== null ? [vehicle.engineCC] : [];
}

function formatEngineSummary(vehicle: NormalizedVehicleCatalogItem) {
  const values = getEngineValues(vehicle);

  if (values.length === 0) {
    return 'Engine details pending';
  }

  if (values.length === 1) {
    return `${values[0].toLocaleString()} cc engine`;
  }

  return `${values[0].toLocaleString()}-${values[values.length - 1].toLocaleString()} cc engine range`;
}

function inferFuelType(vehicle: NormalizedVehicleCatalogItem) {
  if (vehicle.fuelType) {
    return vehicle.fuelType;
  }

  const name = vehicle.name.toLowerCase();

  if (name.includes('prius') || name.includes('note e-power')) {
    return 'Hybrid';
  }

  return 'Petrol';
}

function getEngineGroup(vehicle: NormalizedVehicleCatalogItem) {
  const values = getEngineValues(vehicle);

  if (values.length === 0) {
    return 'Specs pending';
  }

  const highestEngine = Math.max(...values);
  return highestEngine < 1000 ? 'Under 1000cc' : '1000-1500cc';
}

function buildVehicleCardModel(vehicle: NormalizedVehicleCatalogItem): VehicleCardModel {
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

function normalizeFilterValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function vehicleMatchesFilters(vehicle: NormalizedVehicleCatalogItem, filters: VehicleFilterState) {
  const fuelTypeMatches =
    filters.fuelType === 'all' || normalizeFilterValue(vehicle.fuelType).includes(filters.fuelType);
  const bodyTypeMatches =
    filters.bodyType === 'all' || normalizeFilterValue(vehicle.bodyType).includes(filters.bodyType);
  const drivetrainMatches =
    filters.drivetrain === 'all' ||
    vehicle.drivetrains.some((drivetrain) => normalizeFilterValue(drivetrain).includes(filters.drivetrain));

  return fuelTypeMatches && bodyTypeMatches && drivetrainMatches;
}

function VehiclePlaceholder({
  placeholderWrapClassName,
  placeholderIconClassName,
  placeholderTextClassName,
  placeholderLabel,
}: {
  placeholderWrapClassName: string;
  placeholderIconClassName: string;
  placeholderTextClassName: string;
  placeholderLabel: string;
}) {
  return (
    <div className={placeholderWrapClassName}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className={placeholderIconClassName} fill="none">
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
      <p className={placeholderTextClassName}>{placeholderLabel}</p>
    </div>
  );
}

function VehicleCard({
  vehicle,
  cardClassName,
  cardImageShellClassName,
  cardImageFrameClassName,
  placeholderWrapClassName,
  placeholderIconClassName,
  placeholderTextClassName,
  placeholderLabel,
  cardBodyClassName,
  chassisBadgeClassName,
  cardTitleClassName,
  summaryClassName,
  priceRowClassName,
  priceLabelClassName,
  priceValueClassName,
  priceNoteClassName,
  cardActionsClassName,
  detailsButtonClassName,
  utilityButtonClassName,
  detailsCta,
  calculatorCta,
  priceLabel,
  priceNote,
}: VehicleCatalogClientProps & { vehicle: VehicleCardModel }) {
  return (
    <article className={cardClassName}>
      <div className={cardImageShellClassName}>
        <div className={cardImageFrameClassName}>
          <VehiclePlaceholder
            placeholderWrapClassName={placeholderWrapClassName}
            placeholderIconClassName={placeholderIconClassName}
            placeholderTextClassName={placeholderTextClassName}
            placeholderLabel={placeholderLabel}
          />
        </div>
      </div>

      <div className={cardBodyClassName}>
        <div>
          <span className={chassisBadgeClassName}>Chassis {vehicle.chassis}</span>
          <h2 className={cardTitleClassName}>{vehicle.name}</h2>
        </div>

        <p className={summaryClassName}>
          {vehicle.engineSummary} · {vehicle.fuelType} · {vehicle.engineGroup}
        </p>

        <div className={priceRowClassName}>
          <p className={priceLabelClassName}>{priceLabel}</p>
          <p className={priceValueClassName}>{vehicle.priceFrom}</p>
          <p className={priceNoteClassName}>{priceNote}</p>
        </div>

        <div className={cardActionsClassName}>
          <Link href={`/vehicles/${vehicle.slug}`} className={`${detailsButtonClassName} flex-1`}>
            {detailsCta}
          </Link>
          <Link href="/calculator" className={`${utilityButtonClassName} flex-1`}>
            {calculatorCta}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function VehicleCatalogClient(props: VehicleCatalogClientProps) {
  const [selectedFilters, setSelectedFilters] = useState<VehicleFilterState>(() => getInitialFilters(props.filterGroups));

  const filteredVehicles = useMemo(
    () => props.vehicles.filter((vehicle) => vehicleMatchesFilters(vehicle, selectedFilters)),
    [props.vehicles, selectedFilters]
  );

  const vehicleCards = useMemo(() => filteredVehicles.map(buildVehicleCardModel), [filteredVehicles]);

  return (
    <>
      <VehicleFilterBar
        groups={props.filterGroups}
        selectedFilters={selectedFilters}
        onFilterChange={(groupKey, value) =>
          setSelectedFilters((currentFilters) => ({
            ...currentFilters,
            [groupKey]: value,
          }))
        }
        introLabel={props.filterIntroLabel}
        panelClassName={`${props.panelClassName} ${props.filterBarClassName}`}
        introClassName={props.filterIntroClassName}
        gridClassName={props.filterGridClassName}
        groupLabelClassName={props.filterLabelClassName}
        chipsClassName={props.filterChipsClassName}
        chipClassName={props.filterChipClassName}
        activeChipClassName={props.activeFilterChipClassName}
      />

      {vehicleCards.length > 0 ? (
        <section className={props.gridClassName}>
          {vehicleCards.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} {...props} />
          ))}
        </section>
      ) : (
        <section className={props.emptyStateClassName}>
          <p>{props.noResultsMessage}</p>
        </section>
      )}
    </>
  );
}
