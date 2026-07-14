import { useIconConverter } from '../context/IconConverterContext';

const BG_OPTIONS = [
  { key: 'transparent', label: 'شفافة' },
  { key: 'white', label: 'أبيض' },
  { key: 'black', label: 'أسود' },
];

export default function ControlsPanel() {
  const { ALL_SIZES, selectedSizes, toggleSize, background, setBackground } =
    useIconConverter();

  return (
    <div className="panel">
      <h2>الخيارات</h2>

      <div className="field">
        <label>المقاسات المطلوبة (px)</label>
        <div className="sizes">
          {ALL_SIZES.map((size) => (
            <div
              key={size}
              className={`chip ${selectedSizes.has(size) ? 'on' : ''}`}
              onClick={() => toggleSize(size)}
            >
              {size}×{size}
            </div>
          ))}
        </div>
      </div>

      <div className="field">
        <label>خلفية المعاينة</label>
        <div className="bg-toggle">
          {BG_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className={`swatch swatch-${opt.key} ${
                background === opt.key ? 'on' : ''
              }`}
              title={opt.label}
              onClick={() => setBackground(opt.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}