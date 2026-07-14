import { IconConverterProvider } from './context/IconConverterContext';
import UploadPanel from './components/UploadPanel';
import ControlsPanel from './components/ControlsPanel';
import PreviewGrid from './components/PreviewGrid';
import DownloadActions from './components/DownloadActions';

function App() {
  return (
    <IconConverterProvider>
      <div className="wrap">
        <header>
          <div className="eyebrow">أداة تحويل — PNG / ICO</div>
          <h1>صورة ← أيقونة</h1>
          <p className="sub">
            ارفع صورة واحصل على مجموعة كاملة من الأيقونات بجميع المقاسات
            القياسية، جاهزة كملفات PNG منفصلة أو كملف ICO واحد.
          </p>
        </header>

        <div className="grid">
          <div className="left-col">
            <UploadPanel />
            <ControlsPanel />
            <DownloadActions />
          </div>
          <PreviewGrid />
        </div>

        <footer>يعمل بالكامل داخل المتصفح — لا يتم رفع أي صورة إلى أي خادم</footer>
      </div>
    </IconConverterProvider>
  );
}

export default App;