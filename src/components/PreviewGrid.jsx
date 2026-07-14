import { useIconConverter } from '../context/IconConverterContext';
import IconCard from './IconCard';

export default function PreviewGrid() {
  const { image, selectedSizes } = useIconConverter();
  const sorted = [...selectedSizes].sort((a, b) => a - b);

  return (
    <div className="panel">
      <h2>ورقة المقاسات</h2>

      {!image && (
        <div className="spec-empty">لا توجد صورة بعد — ارفع صورة لعرض المعاينات</div>
      )}

      {image && sorted.length === 0 && (
        <div className="spec-empty">اختر مقاسًا واحدًا على الأقل</div>
      )}

      {image && sorted.length > 0 && (
        <div className="spec-grid">
          {sorted.map((size) => (
            <IconCard key={size} size={size} />
          ))}
        </div>
      )}
    </div>
  );
}