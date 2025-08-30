// src/components/SectionBare.tsx
import type { RowSpec } from "../hooks/useSection";
import type { Hex, Align } from "../types";

type Props = {
    name: string;
    rows: RowSpec[];
    seatColors?: (Hex | null)[][];
    seatSize?: number;
    hGap?: number;
    showRowNums?: boolean;
    align?: Align;                // 👈 новое
};

export default function SectionBare({
                                        name, rows, seatColors,
                                        seatSize = 400,                // было 14 — сделаем крупнее
                                        hGap = 4,
                                        showRowNums = true,
                                        align = "center",
                                    }: Props) {
    const justify =
        align === "left" ? "flex-start" :
            align === "right" ? "flex-end" : "center";

    return (
        <div>
            {rows.map((row, r) => (
                <div key={r} style={{ marginTop: r === 0 ? 0 : row.vGap }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {showRowNums && (
                            <div style={{ width: 36, textAlign: "right", fontSize: 10, color: "#666" }}>
                                Ряд {rows.length  - r}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: hGap, justifyContent: justify, width: "100%" }}>
                            {Array.from({ length: row.seats }).map((_, c) => (
                                <div
                                    key={c}
                                    style={{
                                        width: seatSize,
                                        height: seatSize,
                                        borderRadius: 5,
                                        border: "1px solid #ddd",
                                        background: (seatColors?.[r]?.[c] ?? "#f1f1f1") as string,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}