// src/components/SectionMap.tsx
import {useMemo, useState} from "react";
import {useSection} from "../hooks/useSection";
import Section from "./Section";
import GroupList from "./GroupList";
import {randomPastel} from "../helpers/random";
import type {Group, Hex, Align, SectionPattern, SectionPatternId} from "../types";
import {SECTION_PATTERNS} from "../patterns/sectionPatterns";
import SectionBare from "./SectionBare";

function mkGroup(): Group {
    return {
        id: crypto.randomUUID(),
        name: "Без имени",
        color: randomPastel(),
        requiredSeats: 0,
        error: null,
    };
}

function assignBottomUp(rows: { seats: number }[], groups: Group[]): (Hex | null)[][] {
    const mat: (Hex | null)[][] = rows.map(r => Array(r.seats).fill(null));
    const pos: { r: number; c: number }[] = [];
    for (let r = rows.length - 1; r >= 0; r--) {
        for (let c = 0; c < rows[r].seats; c++) pos.push({ r, c });
    }
    let i = 0;
    for (const g of groups) {
        let need = Math.max(0, Math.min(999, g.requiredSeats));
        while (need > 0 && i < pos.length) {
            const { r, c } = pos[i++];
            if (mat[r][c] == null) {
                mat[r][c] = g.color as Hex;
                need--;
            }
        }
    }
    return mat;
}

type Props = {
    title: string;
    schemeRef?: React.MutableRefObject<HTMLDivElement | null>; // вместо layoutRef
    annoRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export default function SectionMap({title, schemeRef, annoRef}: Props) {
    const {section} = useSection({
        name: title,
        rows: [
            {seats: 10, vGap: 8},
            {seats: 12, vGap: 8},
            {seats: 12, vGap: 8},
            {seats: 14, vGap: 10},
        ],
    });

    const [name, setName] = useState<string>(title);
    const [align, setAlign] = useState<Align>("center");
    const [rows, setRows] = useState(section.rows);
    const [pattern, setPattern] = useState<SectionPatternId>("custom"); // ← было "Свой"
    const [groups, setGroups] = useState<Group[]>([mkGroup(), mkGroup()]);

    const seatColors = useMemo(() => assignBottomUp(rows, groups), [rows, groups]);

    const markCustom = () => {
        if (pattern !== "custom") setPattern("custom"); // ← сравниваем с id
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 12,
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #eaeaea",
            }}
        >
            <Section
                name={name}
                onNameChange={(s) => {
                    setName(s);
                    markCustom();
                }}
                rows={rows}
                onRowsChange={(r) => {
                    setRows(r);
                    markCustom();
                }}
                align={align}
                onAlignChange={(a) => {
                    setAlign(a);
                    markCustom();
                }}
                pattern={pattern}
                onPatternChange={setPattern} // в самом Section пусть applyPattern подставляет name/align/rows
                patterns={SECTION_PATTERNS as Record<SectionPatternId, SectionPattern>}
                seatColors={seatColors}
                hGap={6}
            />

            <GroupList
                groups={groups}
                onChange={setGroups}
                onAdd={() => setGroups((p) => [...p, mkGroup()])}
            />

            <div
                ref={schemeRef}
                style={{
                    position: "fixed", left: -99999, top: 0,
                    width: 1200,                   // было 800 — даём больше «холст» для html2canvas
                    padding: 16, background: "#fff", color: "#000"
                }}
            >
                <div style={{fontSize: 18, fontWeight: 800, marginBottom: 8}}>{name}</div>
                <SectionBare
                    name={name}
                    rows={rows}
                    seatColors={seatColors}
                    seatSize={20}                  // печатаем крупнее
                    hGap={5}
                    align={align}                  // 👈 сохраняем выравнивание
                />
            </div>

            <div
                ref={annoRef}
                style={{
                    position: "fixed", left: -99999, top: 0,
                    width: 1200,                   // тоже шире
                    padding: 16, background: "#fff", color: "#000"
                }}
            >
                <div style={{fontSize: 20, fontWeight: 800, textTransform: "uppercase", marginBottom: 12}}>
                    {name}
                </div>
                <div style={{display: "grid", gap: 12}}>
                    {groups.map(g => (
                        <div key={g.id} style={{display: "flex", alignItems: "center", gap: 14}}>
        <span style={{
            width: 26, height: 26, borderRadius: 999, border: "1px solid #aaa",
            background: g.color, display: "inline-block"
        }}/>
                            <div style={{
                                fontSize: 16,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {g.name || "Без имени"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}