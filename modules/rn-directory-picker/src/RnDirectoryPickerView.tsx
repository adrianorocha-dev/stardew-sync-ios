import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { RnDirectoryPickerViewProps } from './RnDirectoryPicker.types';

const NativeView: React.ComponentType<RnDirectoryPickerViewProps> =
  requireNativeViewManager('RnDirectoryPicker');

export default function RnDirectoryPickerView(props: RnDirectoryPickerViewProps) {
  return <NativeView {...props} />;
}
