import { useMemo } from "react";
import type { RowSpec } from "../hooks/useSection";
import type { SectionPatternName } from "../patterns/sectionPatterns";
import "../style/Section.css";

type Align = "left" | "center" | "right";

type Props = {
    name: string;
    onNameChange: (s: string) => void;

    rows: RowSpec[];
    onRowsChange: (rows: RowSpec[]) => void;

    align: Align;
    onAlignChange: (a: Align) => void;

    // паттерны
    pattern: SectionPatternName;
    onPatternChange: (p: SectionPatternName) => void;
    patterns: Record<SectionPatternName, number[]>;

    seatColors?: (string | null)[][];
    hGap?: number;
};

export default function Section({
                                    name, onNameChange,
                                    rows, onRowsChange,
                                    align, onAlignChange,
                                    pattern, onPatternChange, patterns,
                                    seatColors, hGap = 6,
                                }: Props) {
    const justify =
        align === "left" ? "flex-start" :
            align === "right" ? "flex-end" : "center";

    const totals = useMemo(() => ({
        rows: rows.length,
        seats: rows.reduce((s, r) => s + r.seats, 0),
    }), [rows]);

    // ——— Паттерны ———
    const applyPattern = (p: SectionPatternName) => {
        onPatternChange(p);
        if (p === "Свой") return; // ничего не меняем — остаётся текущее
        const vGap = rows[0]?.vGap ?? 8;
        const next = patterns[p].map(n => ({ seats: n, vGap }));
        onRowsChange(next);
    };

    // Любое ручное изменение → переключаемся на "Свой"
    const markCustom = () => { if (pattern !== "Свой") onPatternChange("Свой"); };

    // ——— Ряды + места ———
    const addRow = () => {
        markCustom();
        const lastV = rows.length ? rows[rows.length - 1].vGap : 8;
        onRowsChange([...rows, { seats: 1, vGap: lastV }]);
    };

    const removeRow = (i: number) => {
        markCustom();
        onRowsChange(rows.filter((_, idx) => idx !== i));
    };

    const addSeat = (i: number) => {
        markCustom();
        onRowsChange(rows.map((r, idx) => idx === i ? { ...r, seats: r.seats + 1 } : r));
    };

    const removeSeat = (i: number, c: number) => {
        markCustom();
        onRowsChange(rows.map((r, idx) => {
            if (idx !== i) return r;
            if (c >= r.seats) return r;
            return { ...r, seats: Math.max(0, r.seats - 1) };
        }));
    };

    return (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10, background: "#fdfdfd" }}>
            {/* Хедер */}
            <div className="sec-header">
                <input className="sec-input" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Название секции" />

                {/* Выравнивание */}
                <button className={`sec-btn ${align==="left"?"active":""}`}  onClick={() => onAlignChange("left")}  title="Влево">⟸</button>
                <button className={`sec-btn ${align==="center"?"active":""}`}onClick={() => onAlignChange("center")}title="По центру">⟷</button>
                <button className={`sec-btn ${align==="right"?"active":""}`} onClick={() => onAlignChange("right")} title="Вправо">⟹</button>

                {/* Паттерны */}
                <select
                    className="sec-input"
                    value={pattern}
                    onChange={(e) => applyPattern(e.target.value as any)}
                    style={{ minWidth: 220 }}
                    title="Паттерн рядов"
                >
                    {Object.keys(patterns).map((k) => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>

                <button className="sec-btn" onClick={addRow}>+ ряд</button>

                <div className="sec-counters">
                    <span>рядов: <b>{totals.rows}</b></span>
                    <span>всего мест: <b>{totals.seats}</b></span>
                </div>
            </div>

            {/* Ряды */}
            <div>
                {rows.map((row, r) => (
                    <div key={r} style={{ marginTop: r === 0 ? 0 : row.vGap }}>
                        {/* Заголовок ряда: удалить по ховеру */}
                        <div className="sec-rowHeader">
                            <div className="sec-rowTitle" onClick={() => removeRow(r)}>Ряд {rows.length - r}</div>
                            <div style={{ marginLeft: "auto", color:"#666" }}>мест в ряду: <b>{row.seats}</b></div>
                        </div>

                        {/* Линия мест: удаление по ховеру, плюс-место справа */}
                        <div className="sec-line" style={{ justifyContent: justify, gap: hGap }}>
                            {Array.from({ length: row.seats }).map((_, c) => {
                                const color = seatColors?.[r]?.[c] ?? "#f1f1f1";
                                return (
                                    <div
                                        key={c}
                                        className="sec-seat"
                                        title={`Удалить место ${c + 1}`}
                                        style={{ background: seatColors ? (seatColors[r]?.[c] ?? "#f1f1f1") : color }}
                                        onClick={() => removeSeat(r, c)}
                                    />
                                );
                            })}
                            {/* синяя «+» справа, не считается местом */}
                            <button className="sec-seatAdd" title="Добавить место" onClick={() => addSeat(r)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}