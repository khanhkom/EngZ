import { withErrorBoundary, withSuspense, useStorage } from '@extension/shared';
import { settingsStorage } from '@extension/storage';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
  Settings,
  Globe,
  Layout,
} from '@extension/ui';
import { Label } from '@extension/ui/lib/components/ui/label';
import { NativeSelect } from '@extension/ui/lib/components/ui/select-native';
import { Switch } from '@extension/ui/lib/components/ui/switch';
import type { DEFAULT_SETTINGS } from '@extension/storage';

const Options = () => {
  const settings = useStorage(settingsStorage);

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSetting = async (key: keyof typeof DEFAULT_SETTINGS, value: any) => {
    await settingsStorage.updateSetting(key, value);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      await settingsStorage.resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-900">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Saladict Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">Customize your dictionary experience</p>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle>Language & Dictionary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="target-lang">Target Language</Label>
              <NativeSelect
                id="target-lang"
                value={settings.targetLanguage}
                onChange={e => updateSetting('targetLanguage', e.target.value)}>
                <option value="vi">Vietnamese (Tiếng Việt)</option>
                <option value="en">English</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="es">Spanish (Español)</option>
              </NativeSelect>
              <p className="text-xs text-slate-500">Language you want to translate words into.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="default-dict">Default Dictionary</Label>
              <NativeSelect
                id="default-dict"
                value={settings.defaultDictionary}
                onChange={e => updateSetting('defaultDictionary', e.target.value)}>
                <option value="google">Google Translate</option>
                <option value="bing">Bing Translator</option>
                <option value="cambridge">Cambridge Dictionary</option>
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        {/* Behavior */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-green-500" />
              <CardTitle>Behavior & Interface</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Floating Icon</Label>
                <p className="text-xs text-slate-500">Show icon when selecting text</p>
              </div>
              <Switch checked={settings.showFloatingIcon} onCheckedChange={c => updateSetting('showFloatingIcon', c)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Pronunciation</Label>
                <p className="text-xs text-slate-500">Automatically play audio when looking up</p>
              </div>
              <Switch
                checked={settings.autoPronunciation}
                onCheckedChange={c => updateSetting('autoPronunciation', c)}
              />
            </div>

            <div className="grid gap-2 pt-2">
              <Label htmlFor="panel-pos">Panel Position</Label>
              <NativeSelect
                id="panel-pos"
                value={settings.panelPosition}
                onChange={e => updateSetting('panelPosition', e.target.value)}>
                <option value="auto">Auto (Near Text)</option>
                <option value="above">Above Selection</option>
                <option value="below">Below Selection</option>
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingSpinner />), () => <div>Error loading options</div>);
