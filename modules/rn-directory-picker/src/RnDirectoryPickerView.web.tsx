import * as React from 'react';

import { RnDirectoryPickerViewProps } from './RnDirectoryPicker.types';

export default function RnDirectoryPickerView(props: RnDirectoryPickerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
