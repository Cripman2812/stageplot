/**
 * Minimal, dependency-free PDF writer.
 *
 * Why this exists: `window.print()` (the old export path) depends on the
 * platform's native print pipeline. Inside a Capacitor WebView (Android/iOS
 * APK build) there is often no print pipeline wired up at all, so the old
 * "PDF / Print" button silently did nothing on mobile. This module builds an
 * actual, valid .pdf file byte-for-byte in JS and hands back a Blob — no
 * browser print dialog, no external dependency, no network access. It works
 * identically in a desktop browser tab and inside the Capacitor WebView.
 *
 * Approach: each page is a single embedded JPEG (DCTDecode XObject) drawn to
 * fill the page inside a margin. Tall content is sliced into multiple pages.
 */

type PdfPageImage = {
  /** raw JPEG bytes (no data-url prefix) */
  bytes: Uint8Array;
  /** pixel size of the JPEG */
  widthPx: number;
  heightPx: number;
};

const PT_PER_IN = 72;
// A4 in points, matches print stylesheets already used for the web view
const A4_PORTRAIT: [number, number] = [595.28, 841.89];
const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Concatenate byte chunks while tracking offsets, so we can build a valid xref table. */
class ByteWriter {
  private chunks: Uint8Array[] = [];
  private len = 0;
  private enc = new TextEncoder();
  offsetOf(id: number) {
    return this.objectOffsets[id];
  }
  private objectOffsets: Record<number, number> = {};

  get length() {
    return this.len;
  }

  writeText(s: string) {
    const b = this.enc.encode(s);
    this.chunks.push(b);
    this.len += b.length;
  }

  writeBytes(b: Uint8Array) {
    this.chunks.push(b);
    this.len += b.length;
  }

  startObject(id: number) {
    this.objectOffsets[id] = this.len;
    this.writeText(`${id} 0 obj\n`);
  }

  endObject() {
    this.writeText('endobj\n');
  }

  toBlob(mime = 'application/pdf'): Blob {
    return new Blob(this.chunks as BlobPart[], { type: mime });
  }
}

/**
 * Build a multi-page PDF from a list of JPEG data-URLs, one image per page.
 * Images are fit (contain) inside the page with a small margin, centered.
 */
export function buildPdfFromJpegDataUrls(
  jpegDataUrls: string[],
  opts: { orientation?: 'portrait' | 'landscape'; marginPt?: number } = {}
): Blob {
  if (!jpegDataUrls.length) throw new Error('No pages to export');
  const [pageW, pageH] = opts.orientation === 'landscape' ? A4_LANDSCAPE : A4_PORTRAIT;
  const margin = opts.marginPt ?? 24;

  const images: PdfPageImage[] = jpegDataUrls.map((durl) => {
    const bytes = dataUrlToBytes(durl);
    const size = readJpegSize(bytes);
    return { bytes, widthPx: size.width, heightPx: size.height };
  });

  const w = new ByteWriter();
  w.writeText('%PDF-1.4\n');

  const pageCount = images.length;
  // Object numbering: 1 = catalog, 2 = pages, then per page: (image, contentStream, page)
  const catalogId = 1;
  const pagesId = 2;
  let nextId = 3;
  const pageIds: number[] = [];
  const imageIds: number[] = [];
  const contentIds: number[] = [];

  for (let i = 0; i < pageCount; i++) {
    imageIds.push(nextId++);
    contentIds.push(nextId++);
    pageIds.push(nextId++);
  }

  // Catalog
  w.startObject(catalogId);
  w.writeText(`<< /Type /Catalog /Pages ${pagesId} 0 R >>\n`);
  w.endObject();

  // Pages (parent) — written after we know kids, but PDF allows forward refs, so ok to write now
  w.startObject(pagesId);
  w.writeText(
    `<< /Type /Pages /Count ${pageCount} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>\n`
  );
  w.endObject();

  for (let i = 0; i < pageCount; i++) {
    const img = images[i];
    // Fit image into page minus margins, preserving aspect ratio
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;
    const scale = Math.min(availW / img.widthPx, availH / img.heightPx);
    const drawW = img.widthPx * scale;
    const drawH = img.heightPx * scale;
    const x = (pageW - drawW) / 2;
    const y = (pageH - drawH) / 2;

    // Image XObject
    w.startObject(imageIds[i]);
    w.writeText(
      `<< /Type /XObject /Subtype /Image /Width ${img.widthPx} /Height ${img.heightPx} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`
    );
    w.writeBytes(img.bytes);
    w.writeText('\nendstream\n');
    w.endObject();

    // Content stream: draw image scaled+positioned via CTM
    const content = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(
      2
    )} cm\n/Im${i} Do\nQ\n`;
    w.startObject(contentIds[i]);
    w.writeText(`<< /Length ${content.length} >>\nstream\n${content}endstream\n`);
    w.endObject();

    // Page
    w.startObject(pageIds[i]);
    w.writeText(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(
        2
      )}] ` +
        `/Resources << /XObject << /Im${i} ${imageIds[i]} 0 R >> >> /Contents ${contentIds[i]} 0 R >>\n`
    );
    w.endObject();
  }

  // xref table
  const allIds = [catalogId, pagesId, ...imageIds.flatMap((_, i) => [imageIds[i], contentIds[i], pageIds[i]])];
  const maxId = Math.max(...allIds);
  const xrefOffset = w.length;
  w.writeText(`xref\n0 ${maxId + 1}\n0000000000 65535 f \n`);
  for (let id = 1; id <= maxId; id++) {
    const off = w.offsetOf(id);
    if (off === undefined) {
      w.writeText('0000000000 00000 f \n');
    } else {
      w.writeText(`${String(off).padStart(10, '0')} 00000 n \n`);
    }
  }
  w.writeText(
    `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  );

  return w.toBlob();
}

/** Read width/height straight out of JPEG SOF markers (no Image() round trip needed). */
function readJpegSize(bytes: Uint8Array): { width: number; height: number } {
  let i = 2; // skip SOI
  const len = bytes.length;
  while (i < len) {
    if (bytes[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = bytes[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
    const isSOF =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSOF) {
      const height = (bytes[i + 5] << 8) | bytes[i + 6];
      const width = (bytes[i + 7] << 8) | bytes[i + 8];
      return { width, height };
    }
    i += 2 + segLen;
  }
  throw new Error('Could not read JPEG dimensions');
}

/** Cross-platform "save this blob" — object-URL + anchor works in both browser tabs and Capacitor WebViews. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // give the WebView a moment to start the download/save before revoking
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Slice a tall canvas into consecutive page-height chunks (for long tables/riders). */
export function sliceCanvasIntoPages(
  canvas: HTMLCanvasElement,
  maxPageHeightPx: number
): HTMLCanvasElement[] {
  if (canvas.height <= maxPageHeightPx) return [canvas];
  const pages: HTMLCanvasElement[] = [];
  let y = 0;
  while (y < canvas.height) {
    const h = Math.min(maxPageHeightPx, canvas.height - y);
    const pc = document.createElement('canvas');
    pc.width = canvas.width;
    pc.height = h;
    const ctx = pc.getContext('2d')!;
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    pages.push(pc);
    y += h;
  }
  return pages;
}
