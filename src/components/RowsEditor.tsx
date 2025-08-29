// src/components/RowsEditor.tsx
import { useEffect, useState } from "react";
import type { RowSpec } from "../hooks/useSection";

type Props = {
    value: RowSpec[];                 // текущие ряды
    onChange: (rows: RowSpec[]) => void;
    label?: string;
};

export default function RowsEditor({ value, onChange, label = "Ряды" }: Props) {
    const [text, setText] = useState(
        value.map(r => String(r.seats)).join("\n")
    );
    const [vGap, setVGap] = useState(value[0]?.vGap ?? 8);

    // синхрон снаружи (если поменяли извне)
    useEffect(() => {
        setText(value.map(r => String(r.seats)).join("\n"));
        if (value.length) setVGap(value[0].vGap);
    }, [value]);

    const parse = (s: string) => {
        const nums = s
            .replace(/,/g, "\n")
            .split(/\s+/)
            .map(t => t.trim())
            .filter(Boolean)
            .map(x => Math.max(1, Math.floor(Number(x))))
            .filter(n => Number.isFinite(n));
        return nums.map(n => ({ seats: n, vGap }));
    };

    return (
        <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#555" }}>{label}</label>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={"Например:\n10\n12\n12\n14"}
                rows={6}
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 13,
                    lineHeight: 1.4,
                }}
            />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 13, color: "#555" }}>Отступ между рядами (vGap):</label>
                <input
                    type="number"
                    min={0}
                    value={vGap}
                    onChange={e => setVGap(Math.max(0, Number(e.target.value)))}
                    style={{ width: 80, padding: 6, borderRadius: 8, border: "1px solid #e0e0e0" }}
                />
                <button
                    onClick={() => onChange(parse(text))}
                    style={{
                        marginLeft: "auto",
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #cfd8dc",
                        background: "#f9f9f9",
                        cursor: "pointer",
                    }}
                >
                    Применить
                </button>
            </div>
        </div>
    );
}