/** Export helpers: only PDF (print) and JPEG */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

/** JPEG from an HTMLCanvasElement */
export function exportCanvasAsJpeg(canvas: HTMLCanvasElement, filename: string, quality = 0.92) {
  const url = canvas.toDataURL('image/jpeg', quality);
  downloadDataUrl(url, filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`);
}

/** Browser print dialog → user can "Save as PDF" */
export function exportAsPdf() {
  window.print();
}

/**
 * Render a DOM node to JPEG via temporary SVG foreignObject (no extra deps).
 * Best-effort for rider / list panels; complex CSS may vary by browser.
 */
export async function exportElementAsJpeg(el: HTMLElement, filename: string, quality = 0.92): Promise<void> {
  const rect = el.getBoundingClientRect();
  const width = Math.max(el.scrollWidth, Math.ceil(rect.width), 320);
  const height = Math.max(el.scrollHeight, Math.ceil(rect.height), 200);

  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.background = '#0b0f14';
  clone.style.color = '#e8eef7';
  clone.style.width = `${width}px`;
  clone.style.padding = '16px';
  clone.style.boxSizing = 'border-box';

  const serializer = new XMLSerializer();
  const wrapped = document.createElement('div');
  wrapped.appendChild(clone);
  // inline a minimal style for readability
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
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b0f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, width, height);
    exportCanvasAsJpeg(canvas, filename, quality);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
