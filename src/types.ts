export type Hex = `#${string}`;

export type Group = {
    id: string;
    name: string;
    color: Hex;
    requiredSeats: number;
    error: { message: string; color: Hex } | null;
};

export type RowSpec = { seats: number; vGap: number }; // vGap — вертикальный отступ сверху для ЭТОГО ряда (px)

export type SectionState = {
    id: string;
    name: string;
    rows: RowSpec[]; // массив (кол-во мест в ряду + вертикальный зазор до следующего ряда)
};

export type SectionType = "Партер" | "Балкон" | "Ложа";
