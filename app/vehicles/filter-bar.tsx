'use client';

import type { FilterGroup, VehicleFilterState } from './catalog-types';

type VehicleFilterBarProps = {
  groups: ReadonlyArray<FilterGroup>;
  selectedFilters: VehicleFilterState;
  onFilterChange: (groupKey: FilterGroup['key'], value: string) => void;
  introLabel: string;
  panelClassName: string;
  introClassName: string;
  gridClassName: string;
  groupLabelClassName: string;
  chipsClassName: string;
  chipClassName: string;
  activeChipClassName: string;
};

export function VehicleFilterBar({
  groups,
  selectedFilters,
  onFilterChange,
  introLabel,
  panelClassName,
  introClassName,
  gridClassName,
  groupLabelClassName,
  chipsClassName,
  chipClassName,
  activeChipClassName,
}: VehicleFilterBarProps) {
  return (
    <section className={panelClassName} aria-label="Catalog filters">
      <p className={introClassName}>{introLabel}</p>

      <div className={gridClassName}>
        {groups.map((group) => (
          <div key={group.label}>
            <p className={groupLabelClassName}>{group.label}</p>
            <div className={chipsClassName}>
              {group.options.map((option) => {
                const isActive = selectedFilters[group.key] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange(group.key, option.value)}
                    aria-pressed={isActive}
                    className={`${chipClassName} ${isActive ? activeChipClassName : ''}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
