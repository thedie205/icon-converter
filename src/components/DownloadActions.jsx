import { useIconConverter } from '../context/IconConverterContext';

export default function DownloadActions() {
  const { image, downloadIco, downloadAllPng, isBuildingIco } =
    useIconConverter();

  return (
    <div className="actions">
      <button
        className="primary"
        disabled={!image || isBuildingIco}
        onClick={downloadIco}
      >
        {isBuildingIco ? 'جارٍ التحضير...' : 'تنزيل .ICO (مقاسات متعددة)'}
      </button>
      <button className="ghost" disabled={!image} onClick={downloadAllPng}>
        تنزيل كل المقاسات (PNG)
      </button>
    </div>
  );
}