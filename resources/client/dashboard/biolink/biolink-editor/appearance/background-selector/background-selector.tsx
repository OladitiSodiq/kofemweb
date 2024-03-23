import clsx from 'clsx';
import {Trans} from '@common/i18n/trans';
import {ImageIcon} from '@common/icons/material/Image';
import {FormatColorFillIcon} from '@common/icons/material/FormatColorFill';
import {GradientIcon} from '@common/icons/material/Gradient';
import {ReactElement, ReactNode, useState} from 'react';
import {ColorBackgroundTab} from '@app/dashboard/biolink/biolink-editor/appearance/background-selector/color-background-tab';
import {GradientBackgroundTab} from '@app/dashboard/biolink/biolink-editor/appearance/background-selector/gradient-background-tab';
import {ImageBackgroundTab} from '@app/dashboard/biolink/biolink-editor/appearance/background-selector/image-background-tab/image-background-tab';
import {SelectedBackground} from '@app/dashboard/biolink/biolink-editor/appearance/background-selector/selected-background';
import {
  biolinkEditorState,
  useBiolinkEditorStore,
} from '@app/dashboard/biolink/biolink-editor/biolink-editor-store';
import {appearanceHeaderClassnames} from '@app/dashboard/biolink/biolink-editor/appearance/header-classnames';

export interface BgSelectorTabProps<T extends SelectedBackground> {
  value?: T;
  onChange?: (value: T | null) => void;
  className?: string;
}

const TabMap: Record<
  'color' | 'gradient' | 'image',
  (value: BgSelectorTabProps<any>) => ReactElement
> = {
  color: ColorBackgroundTab,
  gradient: GradientBackgroundTab,
  image: ImageBackgroundTab,
};
type TabName = keyof typeof TabMap;

interface BackgroundSelectorProps {
  className?: string;
}
export function BackgroundSelector({className}: BackgroundSelectorProps) {
  const value = useBiolinkEditorStore(s => s.appearance?.bgConfig);

  const [activeTab, setActiveTab] = useState<TabName>(() => {
    if (value?.type === 'color') return 'color';
    if (value?.type === 'gradient') return 'gradient';
    return 'color';
  });

  const Tab = TabMap[activeTab];

  return (
    <div className={className}>
      <h2 className={appearanceHeaderClassnames.h2}>
        <Trans message="Background" />
      </h2>
      <TypeSelector activeTab={activeTab} onTabChange={setActiveTab} />
      <Tab
        value={activeTab === value?.type ? value : undefined}
        onChange={newValue => {
          biolinkEditorState().updateAppearance({bgConfig: newValue});
        }}
        className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] items-start gap-14"
      />
    </div>
  );
}

interface TypeSelectorProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}
function TypeSelector({activeTab, onTabChange}: TypeSelectorProps) {
  return (
    <div className="my-20 flex items-center gap-20 border-b pb-20">
      <TypeButton
        isActive={activeTab === 'color'}
        icon={<FormatColorFillIcon />}
        title={<Trans message="Flat color" />}
        onClick={() => {
          onTabChange('color');
        }}
      />
      <TypeButton
        isActive={activeTab === 'gradient'}
        icon={<GradientIcon />}
        title={<Trans message="Gradient" />}
        onClick={() => {
          onTabChange('gradient');
        }}
      />
      <TypeButton
        isActive={activeTab === 'image'}
        icon={<ImageIcon />}
        title={<Trans message="Image" />}
        onClick={() => {
          onTabChange('image');
        }}
      />
    </div>
  );
}

interface TypeButtonProps {
  isActive: boolean;
  icon: ReactNode;
  title: ReactNode;
  onClick?: () => void;
}
function TypeButton({isActive, icon, title, onClick}: TypeButtonProps) {
  return (
    <div role="button" className="block" onClick={onClick}>
      <div
        className={clsx(
          'mx-auto mb-8 flex h-50 w-50 items-center justify-center rounded-panel border text-muted',
          isActive && 'border-primary ring',
        )}
      >
        {icon}
      </div>
      <div className="text-center text-sm text-primary">{title}</div>
    </div>
  );
}
