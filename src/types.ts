export type Hex = `#${string}`;

export type Group = {
    id: string;
    name: string;
    color: Hex;
    requiredSeats: number;
    error: { message: string; color: Hex } | null;
};


export type Align = "left" | "center" | "right";

export type SectionPatternId =
    | "custom"
    | "ФТЛ_КЗ_Левая"
    | "ФТЛ_КЗ_Центральная"
    | "ФТЛ_КЗ_Правая";

export type SectionPattern = {
    id: SectionPatternId;
    name: string;
    align: Align;
    vGap: number;
    rows: number[];
};
