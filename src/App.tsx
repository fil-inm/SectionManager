import { useRef } from "react";
import SectionMap from "./components/SectionMap";
import { printTallThreeColsAutoWidth } from "./helpers/print"; // ✅ новый импорт

export default function App() {
    const A_scheme = useRef<HTMLDivElement>(null);
    const B_scheme = useRef<HTMLDivElement>(null);
    const C_scheme = useRef<HTMLDivElement>(null);
    const A_anno   = useRef<HTMLDivElement>(null);
    const B_anno   = useRef<HTMLDivElement>(null);
    const C_anno   = useRef<HTMLDivElement>(null);

    const handlePrint = async () => {
        const schemes = [A_scheme.current!, B_scheme.current!, C_scheme.current!] as [HTMLElement,HTMLElement,HTMLElement];
        const annos   = [A_anno.current!,   B_anno.current!,   C_anno.current!  ] as [HTMLElement,HTMLElement,HTMLElement];
        await printTallThreeColsAutoWidth(schemes, annos, "Карта мероприятия.pdf");
    };

    return (
        <div style={{ minHeight: "100svh" }}>
            <div style={{ width: "min(1300px,100%)", margin: "0 auto", padding: "24px 0 32px" }}>
                <h1 style={{ margin: "0 0 16px 0", textAlign: "center" }}>Карта рассадки</h1>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16, alignItems: "start" }}>
                    <SectionMap title="Партер" schemeRef={A_scheme} annoRef={A_anno} />
                    <SectionMap title="Балкон" schemeRef={B_scheme} annoRef={B_anno} />
                    <SectionMap title="Ложа"   schemeRef={C_scheme} annoRef={C_anno} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #cfd8dc",
                            background: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        🖨️ Распечатать
                    </button>
                </div>
            </div>
        </div>
    );
}