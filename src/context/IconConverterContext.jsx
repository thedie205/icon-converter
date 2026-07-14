import { createContext, useContext, useState, useCallback } from 'react';

const ALL_SIZES = [16, 24, 32, 48, 64, 128, 256, 512];
const DEFAULT_SIZES = [16, 32, 48, 128, 256];

const IconConverterContext = createContext(null);

export function IconConverterProvider({ children }) {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('icon');
  const [selectedSizes, setSelectedSizes] = useState(new Set(DEFAULT_SIZES));
  const [background, setBackground] = useState('transparent');
  const [isBuildingIco, setIsBuildingIco] = useState(false);

  // --- رفع الصورة ---
  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'icon');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  // --- تبديل مقاس (تفعيل/تعطيل) ---
  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
  }, []);

  // --- رسم الصورة داخل canvas بمقاس معيّن ---
  const drawIconCanvas = useCallback((size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (background === 'white') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);
    } else if (background === 'black') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, size, size);
    }

    if (!image) return canvas;

    const iw = image.naturalWidth;
    const ih = image.naturalHeight;
    const scale = Math.min(size / iw, size / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (size - dw) / 2;
    const dy = (size - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, dx, dy, dw, dh);

    return canvas;
  }, [image, background]);

  // --- تنزيل أي Blob كملف ---
  const downloadBlob = useCallback((blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  // --- تنزيل مقاس واحد كـ PNG ---
  const downloadSinglePng = useCallback((size) => {
    const canvas = drawIconCanvas(size);
    canvas.toBlob((blob) => {
      downloadBlob(blob, `${fileName}-${size}x${size}.png`);
    });
  }, [drawIconCanvas, downloadBlob, fileName]);

  // --- تنزيل كل المقاسات المختارة كـ PNG منفصلة ---
  const downloadAllPng = useCallback(async () => {
    const sorted = [...selectedSizes].sort((a, b) => a - b);
    for (const size of sorted) {
      const canvas = drawIconCanvas(size);
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          downloadBlob(blob, `${fileName}-${size}x${size}.png`);
          resolve();
        });
      });
      await new Promise((r) => setTimeout(r, 150));
    }
  }, [selectedSizes, drawIconCanvas, downloadBlob, fileName]);

  // --- تحويل canvas إلى بايتات PNG خام ---
  const canvasToPngBytes = useCallback(async (canvas) => {
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }, []);

  // --- بناء ملف ICO يدويًا (header + directory + بيانات PNG) ---
  const buildIco = useCallback(async (sizes) => {
    const frames = [];
    for (const size of sizes) {
      const canvas = drawIconCanvas(size);
      const bytes = await canvasToPngBytes(canvas);
      frames.push({ size, bytes });
    }

    const headerSize = 6;
    const dirEntrySize = 16;
    const dirSize = dirEntrySize * frames.length;
    let dataOffset = headerSize + dirSize;

    const totalSize = dataOffset + frames.reduce((sum, f) => sum + f.bytes.length, 0);
    const out = new Uint8Array(totalSize);
    const view = new DataView(out.buffer);

    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, frames.length, true);

    frames.forEach((f, i) => {
      const entryOffset = headerSize + i * dirEntrySize;
      const dim = f.size >= 256 ? 0 : f.size;

      out[entryOffset + 0] = dim;
      out[entryOffset + 1] = dim;
      out[entryOffset + 2] = 0;
      out[entryOffset + 3] = 0;
      view.setUint16(entryOffset + 4, 1, true);
      view.setUint16(entryOffset + 6, 32, true);
      view.setUint32(entryOffset + 8, f.bytes.length, true);
      view.setUint32(entryOffset + 12, dataOffset, true);

      out.set(f.bytes, dataOffset);
      dataOffset += f.bytes.length;
    });

    return out;
  }, [drawIconCanvas, canvasToPngBytes]);

  // --- تنزيل ملف ICO كامل ---
  const downloadIco = useCallback(async () => {
    const sorted = [...selectedSizes].filter((s) => s <= 256).sort((a, b) => a - b);
    if (sorted.length === 0) {
      alert('ملف ICO يدعم مقاسات حتى 256×256. اختر مقاسًا ضمن هذا النطاق.');
      return;
    }
    setIsBuildingIco(true);
    try {
      const bytes = await buildIco(sorted);
      const blob = new Blob([bytes], { type: 'image/x-icon' });
      downloadBlob(blob, `${fileName}.ico`);
    } finally {
      setIsBuildingIco(false);
    }
  }, [selectedSizes, buildIco, downloadBlob, fileName]);

  const value = {
    ALL_SIZES,
    image,
    fileName,
    selectedSizes,
    background,
    isBuildingIco,
    setBackground,
    handleFile,
    toggleSize,
    drawIconCanvas,
    downloadSinglePng,
    downloadAllPng,
    downloadIco,
  };

  return (
    <IconConverterContext.Provider value={value}>
      {children}
    </IconConverterContext.Provider>
  );
}

export function useIconConverter() {
  const ctx = useContext(IconConverterContext);
  if (!ctx) {
    throw new Error('useIconConverter must be used inside an IconConverterProvider');
  }
  return ctx;
}