import { useRef } from "react";
import SectionMap from "./components/SectionMap";
import { printTwoPageAllSections } from "./helpers/print";

export default function App() {
    // по 2 ref на каждую секцию: layout+anno
    const A_layout = useRef<HTMLDivElement>(null);
    const B_layout = useRef<HTMLDivElement>(null);
    const C_layout = useRef<HTMLDivElement>(null);

    const A_anno   = useRef<HTMLDivElement>(null);
    const B_anno   = useRef<HTMLDivElement>(null);
    const C_anno   = useRef<HTMLDivElement>(null);

    const handlePrintAll = async () => {
        const layouts = [A_layout.current, B_layout.current, C_layout.current].filter(Boolean) as HTMLElement[];
        const annos   = [A_anno.current,   B_anno.current,   C_anno.current  ].filter(Boolean) as HTMLElement[];
        await printTwoPageAllSections(layouts, annos, "Схема_и_аннотация.pdf");
    };

    return (
        <div style={{ minHeight: "100svh" }}>
            <div
                style={{
                    width: "min(1300px, 100%)",
                    margin: "0 auto",          // центрируем
                    padding: "24px 0 32px",    // только сверху/снизу
                }}
            >
                <h1 style={{ margin: "0 0 16px 0", textAlign: "center" }}>
                    Карта рассадки
                </h1>

                {/* три секции в ряд */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 16,
                        alignItems: "start",
                        width: "100%",
                    }}
                >
                    <SectionMap title="Партер" layoutRef={A_layout} annoRef={A_anno} />
                    <SectionMap title="Балкон" layoutRef={B_layout} annoRef={B_anno} />
                    <SectionMap title="Ложа"   layoutRef={C_layout} annoRef={C_anno} />
                </div>

                {/* кнопка по центру */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <button
                        onClick={handlePrintAll}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid #cfd8dc",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontSize: 15,
                        }}
                    >
                        🖨️ Распечатать всё (2 листа PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}