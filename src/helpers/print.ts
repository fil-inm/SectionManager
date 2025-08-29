import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Рисует 3 блока-секции на 1-м листе (A4 landscape) как 3 колонки,
 * а на 2-м листе (A4 portrait) — 3 блока-аннотации друг под другом.
 */
export async function printTwoPageAllSections(
    layoutEls: HTMLElement[],   // по одному на секцию: «схема с заголовком и подписями рядов»
    annoEls: HTMLElement[],     // по одному на секцию: «аннотация»
    filename = "Секции.pdf"
) {
    if (layoutEls.length === 0 || annoEls.length === 0) return;

    // --- страница 1: альбомная
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 8;                              // поля
    const colW = (pageW - margin * 2 - margin * 2) / 3; // 3 колонки + промежутки margin
    const topY = margin;

    // Сделаем снимки секций
    const layoutImgs = await Promise.all(
        layoutEls.map(el => html2canvas(el, { scale: 2, backgroundColor: "#ffffff" })
            .then(cv => ({
                data: cv.toDataURL("image/png"),
                w: cv.width,
                h: cv.height,
            })))
    );

    // Вписываем каждую в свою колонку по ширине, сохраняя пропорции
    layoutImgs.forEach((img, i) => {
        const targetW = colW;
        const targetH = img.h * (targetW / img.w);
        const x = margin + i * (colW + margin);
        const y = topY;
        pdf.addImage(img.data, "PNG", x, y, targetW, targetH, "", "FAST");
    });

    // --- страница 2: книжная
    pdf.addPage("a4", "portrait");
    const p2W = pdf.internal.pageSize.getWidth();
    const p2H = pdf.internal.pageSize.getHeight();
    const p2Margin = 12;

    // Снимки аннотаций
    const annoImgs = await Promise.all(
        annoEls.map(el => html2canvas(el, { scale: 2, backgroundColor: "#ffffff" })
            .then(cv => ({
                data: cv.toDataURL("image/png"),
                w: cv.width,
                h: cv.height,
            })))
    );

    // Укладываем все аннотации на один лист.
    // Масштабируем пропорционально по ширине, и если не помещаются по высоте — добавляем страницу.
    let y = p2Margin;
    for (const img of annoImgs) {
        const targetW = p2W - p2Margin * 2;
        const targetH = img.h * (targetW / img.w);

        if (y + targetH > p2H - p2Margin) {
            pdf.addPage("a4", "portrait");
            y = p2Margin;
        }
        pdf.addImage(img.data, "PNG", p2Margin, y, targetW, targetH, "", "FAST");
        y += targetH + 6; // небольшой отступ между блоками
    }

    pdf.save(filename);
}