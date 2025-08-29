import { useRef } from "react";
import { Group } from "../types";
import "../style/GroupCard.css";

type Props = {
    initial: Group;
    onChange: (patch: Partial<Group>) => void;
};

export default function GroupCard({ initial, onChange }: Props) {
    const colorInputRef = useRef<HTMLInputElement>(null);

    const openColor = () => colorInputRef.current?.click();

    const update = (patch: Partial<Group>) => onChange(patch);

    return (
        <div className="gc-card">
            {/* Цвет */}
            <button
                className="gc-color"
                onClick={openColor}
                style={{ background: initial.color }}
            />
            <input
                ref={colorInputRef}
                type="color"
                className="gc-color-input"
                value={initial.color}
                onChange={(e) => update({ color: e.target.value as any })}
            />

            {/* Название */}
            <input
                className="gc-inplace gc-name"
                value={initial.name}
                maxLength={20}
                onChange={(e) => update({ name: e.target.value })}
            />

            <div className="gc-spacer" />

            {/* Места */}
            <input
                className="gc-inplace gc-number"
                type="number"
                min={0}
                max={999}
                value={initial.requiredSeats}
                onChange={(e) =>
                    update({ requiredSeats: Math.min(999, Number(e.target.value)) })
                }
            />

            {/* Ошибка */}
            {initial.error && (
                <div className="gc-badge" data-tooltip={initial.error.message}>
                    !
                </div>
            )}
        </div>
    );
}