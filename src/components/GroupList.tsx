import GroupCard from "./GroupCard";
import type { Group } from "../types";
import "../style/GroupCard.css";

type Props = {
    groups: Group[];
    onChange: (next: Group[]) => void;
    onAdd: () => void;
};

export default function GroupList({ groups, onChange, onAdd }: Props) {
    const patch = (id: string, p: Partial<Group>) =>
        onChange(groups.map(g => (g.id === id ? { ...g, ...p } : g)));

    const move = (from: number, to: number) => {
        if (to < 0 || to >= groups.length || from === to) return;
        const next = groups.slice();
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        onChange(next);
    };

    const remove = (id: string) => {
        onChange(groups.filter(g => g.id !== id));
    };

    return (
        <div>
            <div className="gc-list" style={{ maxHeight: 360 }}>
                {groups.map((g, i) => (
                    <div key={g.id} className="gl-row">
                        <div className="gl-arrows">
                            <button
                                className="gl-arrow"
                                onClick={() => move(i, i - 1)}
                                disabled={i === 0}
                                title="Выше"
                            >↑</button>
                            <button
                                className="gl-arrow"
                                onClick={() => move(i, i + 1)}
                                disabled={i === groups.length - 1}
                                title="Ниже"
                            >↓</button>
                            <button
                                className="gl-delete"
                                onClick={() => remove(g.id)}
                                title="Удалить группу"
                            >✕</button>
                        </div>

                        <div className="gl-card">
                            <GroupCard initial={g} onChange={(p) => patch(g.id, p)} />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onAdd} className="gl-add">
                + Добавить группу
            </button>
        </div>
    );
}