// print.ts — лёгкая версия (JPEG + авто-ориентация + кап ширины + меньший SCALE)
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SCALE = 2.2;          // было 3 — уменьшили
const MARGIN_PX = 32;
const GUTTER_PX = 24;
const GAP_PX = 40;
const MIN_COL_W = 520;      // можно 480–560
const MAX_TOTAL_WIDTH = 2200; // 🔥 кап ширины страницы (подбери под себя)

type Snap = { dataUrl: string; widthPx: number; heightPx: number };

function makeOffscreenBox() {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.left = "-100000px";
    box.style.top = "0";
    box.style.zIndex = "-1";
    box.style.overflow = "visible";
    box.style.display = "block";
    document.body.appendChild(box);
    return box;
}

const raf2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

async function snapshotOffscreenAtWidthJPEG(el: HTMLElement, widthPx: number, quality = 0.82): Promise<Snap> {
    // @ts-ignore
    if (document.fonts?.ready) await (document as any).fonts.ready;

    const box = makeOffscreenBox();
    const clone = el.cloneNode(true) as HTMLElement;

    clone.style.width = `${widthPx}px`;
    clone.style.maxWidth = `${widthPx}px`;
    clone.style.height = "";
    clone.style.maxHeight = "none";
    clone.style.transform = "none";
    clone.style.overflow = "visible";
    clone.style.display = "block";

    box.appendChild(clone);
    await raf2();

    const rect = clone.getBoundingClientRect();
    const w = Math.max(1, Math.ceil(rect.width));
    const h = Math.max(1, Math.ceil(rect.height));

    const canvas = await html2canvas(clone, {
        scale: SCALE,
        backgroundColor: "#fff",
        useCORS: true,
        imageTimeout: 0,
    });

    document.body.removeChild(box);

    // 🔥 JPEG вместо PNG
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return { dataUrl, widthPx: w, heightPx: h };
}

export async function printTallThreeColsAutoWidth(
    topElems: [HTMLElement, HTMLElement, HTMLElement],
    bottomElems: [HTMLElement, HTMLElement, HTMLElement],
    filename = "Map_light.pdf"
) {
    // 1) измеряем «натуральные» ширины, чтобы подобрать ширину колонок с капом
    const probeBox = makeOffscreenBox();
    const mkProbe = (el: HTMLElement) => {
        const c = el.cloneNode(true) as HTMLElement;
        c.style.width = "max-content";
        c.style.maxWidth = "none";
        c.style.height = "";
        c.style.maxHeight = "none";
        c.style.display = "inline-block";
        probeBox.appendChild(c);
        return c;
    };
    const probesTop = topElems.map(mkProbe);
    const probesBot = bottomElems.map(mkProbe);
    await raf2();

    const naturalW = [0,1,2].map(i => {
        const wt = Math.ceil(probesTop[i].getBoundingClientRect().width);
        const wb = Math.ceil(probesBot[i].getBoundingClientRect().width);
        return Math.max(wt, wb, MIN_COL_W);
    });
    document.body.removeChild(probeBox);

    // 2) предварительный расчёт ширины страницы и кап
    const prelimCols = naturalW[0] + naturalW[1] + naturalW[2];
    const prelimW = MARGIN_PX + prelimCols + 2*GUTTER_PX + MARGIN_PX;
    const scaleDown = prelimW > MAX_TOTAL_WIDTH ? (MAX_TOTAL_WIDTH / prelimW) : 1;

    const colW = naturalW.map(w => Math.floor(w * scaleDown));

    // 3) снимки при итоговой ширине колонок (JPEG)
    const tops = await Promise.all([0,1,2].map(i => snapshotOffscreenAtWidthJPEG(topElems[i], colW[i])));
    const bots = await Promise.all([0,1,2].map(i => snapshotOffscreenAtWidthJPEG(bottomElems[i], colW[i])));

    const topRowH = Math.max(...tops.map(t => t.heightPx));
    const botRowH = Math.max(...bots.map(b => b.heightPx));

    const totalCols = colW[0] + colW[1] + colW[2];
    const pageW = Math.ceil(MARGIN_PX + totalCols + 2*GUTTER_PX + MARGIN_PX);
    const pageH = Math.ceil(MARGIN_PX + topRowH + GAP_PX + botRowH + MARGIN_PX);

    const isLandscape = pageW > pageH;
    const pdf = new jsPDF({ unit: "px", format: [pageW, pageH], orientation: isLandscape ? "landscape" : "portrait" });

    // 4) размещение
    const x0 = MARGIN_PX;
    const x1 = x0 + colW[0] + GUTTER_PX;
    const x2 = x1 + colW[1] + GUTTER_PX;
    const X = [x0, x1, x2];
    const topY = MARGIN_PX;
    const botY = MARGIN_PX + topRowH + GAP_PX;

    // Водяной знак (опционально, лёгкий текст — веса почти не добавляет)
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(14);
    pdf.setTextColor(120);
    pdf.text("Created with the support of Mikhail Silaev (@fil_inm)", pageW/2, pageH-16, { align: "center" });

    // 5) рендер картинок с сжатием JPEG внутри PDF
    for (let i = 0; i < 3; i++) {
        const t = tops[i], b = bots[i];

        const xiTop = Math.round(X[i] + (colW[i] - t.widthPx) / 2);
        const yiTop = Math.round(topY + (topRowH - t.heightPx) / 2);
        pdf.addImage(t.dataUrl, "JPEG", xiTop, yiTop, t.widthPx, t.heightPx, undefined, "FAST"); // 🔥

        const xiBot = Math.round(X[i] + (colW[i] - b.widthPx) / 2);
        const yiBot = Math.round(botY + (botRowH - b.heightPx) / 2);
        pdf.addImage(b.dataUrl, "JPEG", xiBot, yiBot, b.widthPx, b.heightPx, undefined, "FAST"); // 🔥
    }

    pdf.save(filename);
}