import { useRef, useState } from 'react';
import { useIconConverter } from '../context/IconConverterContext';

export default function UploadPanel() {
  const { handleFile, fileName, image } = useIconConverter();
  const fileInputRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="panel">
      <h2>المصدر</h2>
      <div
        className={`dropzone ${isOver ? 'over' : ''}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="dz-icon">⌁</div>
        <div className="dz-title">اسحب صورة هنا أو اضغط للاختيار</div>
        <div className="dz-sub">PNG · JPG · SVG · WEBP</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          hidden
        />
      </div>

      {image && (
        <div className="fname">
          ✓ {fileName} ({image.naturalWidth}×{image.naturalHeight})
        </div>
      )}
    </div>
  );
}