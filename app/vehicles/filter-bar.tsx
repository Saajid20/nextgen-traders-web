'use client';

import { useState } from 'react';

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  label: string;
  options: FilterOption[];
};

type VehicleFilterBarProps = {
  groups: ReadonlyArray<FilterGroup>;
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
  introLabel,
  panelClassName,
  introClassName,
  gridClassName,
  groupLabelClassName,
  chipsClassName,
  chipClassName,
  activeChipClassName,
}: VehicleFilterBarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(groups.map((group) => [group.label, group.options[0]?.value ?? ''])),
  );

  return (
    <section className={panelClassName} aria-label="Catalog filters">
      <p className={introClassName}>{introLabel}</p>

      <div className={gridClassName}>
        {groups.map((group) => (
          <div key={group.label}>
            <p className={groupLabelClassName}>{group.label}</p>
            <div className={chipsClassName}>
              {group.options.map((option) => {
                const isActive = selectedFilters[group.label] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSelectedFilters((currentFilters) => ({
                        ...currentFilters,
                        [group.label]: option.value,
                      }))
                    }
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
