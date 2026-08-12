import { buildPdfFromJpegDataUrls, saveBlob, sliceCanvasIntoPages } from './pdf';

/** Export helpers: real PDF file generation + JPEG. No window.print() —
 * Capacitor's Android/iOS WebView has no print pipeline wired up by default,
 * so that path silently did nothing on mobile. Everything below produces an
 * actual downloadable file instead. */

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** JPEG from an HTMLCanvasElement */
export function exportCanvasAsJpeg(canvas: HTMLCanvasElement, filename: string, quality = 0.92) {
  const url = canvas.toDataURL('image/jpeg', quality);
  downloadDataUrl(url, filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`);
}

/** Real, standalone PDF from an HTMLCanvasElement (e.g. the stage plot or a 3D snapshot). */
export function exportCanvasAsPdf(canvas: HTMLCanvasElement, filename: string) {
  const isWide = canvas.width >= canvas.height;
  const pages = sliceCanvasIntoPages(canvas, canvas.width * (isWide ? 0.75 : 1.4142) * 3);
  const jpegs = pages.map((p) => p.toDataURL('image/jpeg', 0.92));
  const blob = buildPdfFromJpegDataUrls(jpegs, { orientation: isWide ? 'landscape' : 'portrait' });
  saveBlob(blob, filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * Render a DOM node to a canvas via a temporary SVG foreignObject (no extra
 * deps). This rasterizes exactly what's on screen — including Turkish
 * characters and any layout — so there's no font-embedding/encoding step to
 * get wrong. Used as the source for both JPEG and PDF export.
 */
async function renderElementToCanvas(el: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  const rect = el.getBoundingClientRect();
  const width = Math.max(el.scrollWidth, Math.ceil(rect.width), 320);
  const height = Math.max(el.scrollHeight, Math.ceil(rect.height), 200);

  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.background = '#0b0f14';
  clone.style.color = '#e8eef7';
  clone.style.width = `${width}px`;
  clone.style.padding = '16px';
  clone.style.boxSizing = 'border-box';

  const wrapped = document.createElement('div');
  wrapped.appendChild(clone);
  const style = document.createElement('style');
  style.textContent = `
    * { font-family: system-ui, sans-serif; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid #333; padding: 4px 6px; text-align: left; }
    h3 { margin: 0 0 8px; font-size: 14px; }
    .card { margin-bottom: 12px; padding: 10px; border: 1px solid #333; border-radius: 8px; }
  `;
  wrapped.insertBefore(style, wrapped.firstChild);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${wrapped.innerHTML}</div>
    </foreignObject>
  </svg>`;

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b0f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

/** Best-effort JPEG export of a DOM node (rider / list panels). */
export async function exportElementAsJpeg(el: HTMLElement, filename: string, quality = 0.92): Promise<void> {
  const canvas = await renderElementToCanvas(el);
  exportCanvasAsJpeg(canvas, filename, quality);
}

/**
 * Real PDF export of a DOM node. Tall content (long channel lists, riders)
 * is automatically split across multiple A4 pages instead of being cut off.
 */
export async function exportElementAsPdf(el: HTMLElement, filename: string): Promise<void> {
  const canvas = await renderElementToCanvas(el);
  // ~A4 portrait aspect at the canvas's pixel width defines one page's height
  const pageHeightPx = Math.round(canvas.width * (841.89 / 595.28));
  const pages = sliceCanvasIntoPages(canvas, pageHeightPx);
  const jpegs = pages.map((p) => p.toDataURL('image/jpeg', 0.92));
  const blob = buildPdfFromJpegDataUrls(jpegs, { orientation: 'portrait' });
  saveBlob(blob, filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
