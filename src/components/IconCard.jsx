import { useEffect, useRef } from 'react';
import { useIconConverter } from '../context/IconConverterContext';

export default function IconCard({ size }) {
  const { drawIconCanvas, downloadSinglePng, background } = useIconConverter();
  const displayRef = useRef(null);

  useEffect(() => {
    const sourceCanvas = drawIconCanvas(size);
    const displayCanvas = displayRef.current;
    if (!displayCanvas) return;

    displayCanvas.width = size;
    displayCanvas.height = size;
    const ctx = displayCanvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(sourceCanvas, 0, 0);
  }, [size, drawIconCanvas]);

  const displaySize = Math.min(size, 96);

  return (
    <div className="cell">
      <div className="stage" style={{ height: displaySize + 14 }}>
        <canvas
          ref={displayRef}
          className={`preview ${background === 'transparent' ? 'checker' : ''}`}
          style={{ width: displaySize, height: displaySize }}
        />
      </div>
      <div className="dim-line">
        <div className="tick" />
        <div className="dim-track" />
        <div className="tick" />
      </div>
      <div className="label">
        <b>{size}</b>×{size} px
      </div>
      <button className="dl-btn" onClick={() => downloadSinglePng(size)}>
        PNG ↓
      </button>
    </div>
  );
}