import '@src/NewTab.css';
import { t } from '@extension/i18n';
import { PROJECT_URL_OBJECT, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner, ToggleButton } from '@extension/ui';

const NewTab = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const logo = isLight ? 'new-tab/logo_horizontal.svg' : 'new-tab/logo_horizontal_dark.svg';

  const goGithubSite = () => chrome.tabs.create(PROJECT_URL_OBJECT);

  return (
    <div
      className={cn(
        'relative flex h-screen w-screen flex-col overflow-hidden font-sans',
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-gray-900 text-slate-50',
      )}>
      {/* Main Content Area - kept minimal to avoid "covering" the screen with clutter */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md space-y-4 text-center opacity-30 transition-opacity duration-700 hover:opacity-100">
          <h1 className="text-4xl font-light tracking-tight">New Tab</h1>
          <p className="text-lg font-light">Focus on what matters.</p>
        </div>
      </main>

      {/* Bottom Toolbar */}
      <footer
        className={cn(
          'absolute inset-x-0 bottom-0 z-50 flex h-16 items-center justify-between px-6',
          'border-t backdrop-blur-xl transition-colors duration-300',
          isLight ? 'border-slate-200/60 bg-white/70' : 'border-gray-800/60 bg-gray-900/70',
        )}>
        {/* Left: Branding */}
        <div className="flex items-center gap-4">
          <img
            src={chrome.runtime.getURL(logo)}
            className="h-6 w-auto opacity-80 transition-opacity hover:opacity-100"
            alt="logo"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={goGithubSite}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              isLight
                ? 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100',
            )}>
            GitHub
          </button>

          <div className="mx-1 h-4 w-px bg-current opacity-10" />

          <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
        </div>
      </footer>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <LoadingSpinner />), ErrorDisplay);
