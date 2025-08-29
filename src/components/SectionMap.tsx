// src/components/SectionMap.tsx
import { useMemo, useState } from "react";
import { useSection } from "../hooks/useSection";
import Section from "./Section";
import GroupList from "./GroupList";
import { randomPastel } from "../helpers/random";
import type { Group ,Hex} from "../types";
import { SECTION_PATTERNS, type SectionPatternName } from "../patterns/sectionPatterns";

function mkGroup(): Group {
    return { id: crypto.randomUUID(), name: "Без имени", color: randomPastel(), requiredSeats: 0, error: null };
}
function assignBottomUp(rows: { seats: number }[], groups: Group[]): (Hex | null)[][] {
    const mat: (Hex | null)[][] = rows.map(r => Array(r.seats).fill(null));
    const pos: { r: number; c: number }[] = [];
    for (let r = rows.length - 1; r >= 0; r--) for (let c = 0; c < rows[r].seats; c++) pos.push({ r, c });
    let i = 0;
    for (const g of groups) {
        let need = Math.max(0, Math.min(999, g.requiredSeats));
        while (need > 0 && i < pos.length) { const { r, c } = pos[i++]; if (mat[r][c] == null) { mat[r][c] = g.color as Hex; need--; } }
        if (i >= pos.length) break;
    }
    return mat;
}

type Props = {
    title: string;
    layoutRef?: React.MutableRefObject<HTMLDivElement | null>;
    annoRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export default function SectionMap({ title, layoutRef, annoRef }: Props) {
    const { section } = useSection({
        name: title,
        rows: [{ seats: 10, vGap: 8 }, { seats: 12, vGap: 8 }, { seats: 12, vGap: 8 }, { seats: 14, vGap: 10 }],
    });

    const [name, setName] = useState<string>(title);
    const [align, setAlign] = useState<"left" | "center" | "right">("center");
    const [rows, setRows] = useState(section.rows);
    const [pattern, setPattern] = useState<SectionPatternName>("Свой");
    const [groups, setGroups] = useState<Group[]>([mkGroup(), mkGroup()]);

    const seatColors = useMemo(() => assignBottomUp(rows, groups), [rows, groups]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, borderRadius: 12, background: "#fff", border: "1px solid #eaeaea" }}>
            <Section
                name={name}
                onNameChange={(s) => { setName(s); if (pattern !== "Свой") setPattern("Свой"); }}
                rows={rows}
                onRowsChange={(r) => { setRows(r); if (pattern !== "Свой") setPattern("Свой"); }}
                align={align}
                onAlignChange={setAlign}
                pattern={pattern}
                onPatternChange={setPattern}
                patterns={SECTION_PATTERNS}
                seatColors={seatColors}
                hGap={6}
            />
            <GroupList groups={groups} onChange={setGroups} onAdd={() => setGroups((p) => [...p, mkGroup()])} />

            {/* ПЕЧАТЬ: страница 1 (макет секции) */}
            <div
                ref={layoutRef}
                style={{ position: "fixed", left: -99999, top: 0, width: 800, padding: 16, background: "#fff", color: "#000" }}
            >
                <h2 style={{ margin: "0 0 8px 0" }}>{name}</h2>
                <Section
                    name={name}
                    onNameChange={() => {}}
                    rows={rows}
                    onRowsChange={() => {}}
                    align={align}
                    onAlignChange={() => {}}
                    pattern={pattern}
                    onPatternChange={() => {}}
                    patterns={SECTION_PATTERNS}
                    seatColors={seatColors}
                    hGap={6}
                />
            </div>

            {/* ПЕЧАТЬ: страница 2 (аннотация) */}
            <div
                ref={annoRef}
                style={{ position: "fixed", left: -99999, top: 0, width: 800, padding: 16, background: "#fff", color: "#000" }}
            >
                <h2 style={{ margin: "0 0 8px 0" }}>{name}</h2>
                <h3 style={{ margin: "0 0 8px 0" }}>Аннотация</h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6, fontSize: 14 }}>
                    {groups.map((g) => (
                        <li key={g.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 12, height: 12, borderRadius: 999, border: "1px solid #ddd", background: g.color, display: "inline-block" }} />
                            <span style={{ fontWeight: 600, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {g.name || "Без имени"}
              </span>
                            <span style={{ marginLeft: "auto" }}>мест: {g.requiredSeats}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}