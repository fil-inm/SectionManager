import {Hex} from "../types";

export function randomPastel(): Hex {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.random() * 20;
    const lightness = 80 + Math.random() * 10;

    const s = saturation / 100;
    const l = lightness / 100;

    const k = (n: number) => (n + hue / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return hex.toUpperCase() as Hex;
}
