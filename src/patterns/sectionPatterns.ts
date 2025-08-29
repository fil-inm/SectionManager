import {SectionPatternId, SectionPattern} from "../types"

export const SECTION_PATTERNS: Record<SectionPatternId, SectionPattern> = {
    custom: {
        id: "custom",
        name: "Свой",
        align: "center",
        vGap: 8,
        rows: [],
    },

    "ФТЛ_КЗ_Левая": {
        id: "ФТЛ_КЗ_Левая",
        name: "Левая",
        align: "right",
        vGap: 8,
        rows: [
            13, 13, 12, 12, 12, 12, 12, 12, 11, 11,
            10, 10, 10, 10, 10, 9, 8, 7, 5,
        ],
    },

    "ФТЛ_КЗ_Центральная": {
        id: "ФТЛ_КЗ_Центральная",
        name: "Центральная",
        align: "center",
        vGap: 8,
        rows: [
            10, 10, 10, 20, 20, 19, 19, 19, 18,
            18, 18, 17, 17, 16, 16, 15, 15, 15, 14,
        ],
    },

    "ФТЛ_КЗ_Правая": {
        id: "ФТЛ_КЗ_Правая",
        name: "Правая",
        align: "left",
        vGap: 8,
        rows: [
            12, 12, 11, 11, 11, 11, 11, 11, 10,
            10, 9, 9, 9, 9, 9, 8, 7, 6, 5,
        ],
    },
};