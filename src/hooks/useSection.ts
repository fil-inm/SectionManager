// src/hooks/useSection.ts
export type RowSpec = {
    seats: number;  // сколько мест в ряду
    vGap: number;   // вертикальный отступ от предыдущего ряда
};

export type SectionState = {
    id: string;
    name: string;
    rows: RowSpec[];
};

export function useSection(initial?: Partial<SectionState>) {
    const section: SectionState = {
        id: initial?.id ?? crypto.randomUUID(),
        name: initial?.name ?? "Секция",
        rows: initial?.rows ?? [
            { seats: 10, vGap: 8 },
            { seats: 12, vGap: 8 },
            { seats: 12, vGap: 8 },
            { seats: 14, vGap: 8 },
        ],
    };

    const setName = (name: string) => ({ ...section, name });
    const setRow = (i: number, patch: Partial<RowSpec>) => ({
        ...section,
        rows: section.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    });
    const addRow = (seats = 10, vGap = 8) => ({
        ...section,
        rows: [...section.rows, { seats, vGap }],
    });
    const removeRow = (i: number) => ({
        ...section,
        rows: section.rows.filter((_, idx) => idx !== i),
    });

    return { section, setName, setRow, addRow, removeRow };
}