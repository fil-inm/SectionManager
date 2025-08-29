// src/hooks/useGroup.ts
import { useState } from "react";
import {Hex, Group} from "../types"

export function useGroup(initial?: Partial<Group>) {
    const [group, setGroup] = useState<Group>({
        id: initial?.id ?? crypto.randomUUID(),
        name: initial?.name ?? "Группа",
        color: initial?.color ?? "#4caf50",
        requiredSeats: initial?.requiredSeats ?? 0,
        error: initial?.error ?? null,
    });

    // «методы» (как у класса)
    const setName = (name: string) => setGroup(g => ({ ...g, name }));
    const setColor = (color: Hex) => setGroup(g => ({ ...g, color }));
    const setRequiredSeats = (n: number) =>
        setGroup(g => ({
            ...g,
            requiredSeats: n < 0 ? 0 : Math.floor(n),
            error: n < 0 ? { message: "Мест не может быть < 0", color: "#f44336" } : null,
        }));
    const setError = (message: string, color: Hex = "#f44336") =>
        setGroup(g => ({ ...g, error: { message, color } }));
    const clearError = () => setGroup(g => ({ ...g, error: null }));

    return {
        group,          // текущее состояние (как поля класса)
        setName,
        setColor,
        setRequiredSeats,
        setError,
        clearError,
    };
}