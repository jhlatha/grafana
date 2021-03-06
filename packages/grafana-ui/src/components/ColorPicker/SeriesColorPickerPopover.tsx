import React, { FunctionComponent } from 'react';

import { ColorPickerPopover } from './ColorPickerPopover';
import { ColorPickerProps } from './ColorPicker';
import { PopperContentProps } from '../Tooltip/PopperController';
import { Switch } from '../Switch/Switch';

export interface SeriesColorPickerPopoverProps extends ColorPickerProps, PopperContentProps {
  yaxis?: number;
  onToggleAxis?: () => void;
}

export const SeriesColorPickerPopover: FunctionComponent<SeriesColorPickerPopoverProps> = props => {
  const { yaxis, onToggleAxis, color, ...colorPickerProps } = props;

  return (
    <ColorPickerPopover
      {...colorPickerProps}
      color={color || '#000000'}
      customPickers={{
        yaxis: {
          name: 'Y-Axis',
          tabComponent: () => (
            <Switch
              key="yaxisSwitch"
              label="Use right y-axis"
              className="ColorPicker__axisSwitch"
              labelClass="ColorPicker__axisSwitchLabel"
              checked={yaxis === 2}
              onChange={() => {
                if (onToggleAxis) {
                  onToggleAxis();
                }
              }}
            />
          ),
        },
      }}
    />
  );
};

interface AxisSelectorProps {
  yaxis: number;
  onToggleAxis?: () => void;
}

interface AxisSelectorState {
  yaxis: number;
}

export class AxisSelector extends React.PureComponent<AxisSelectorProps, AxisSelectorState> {
  constructor(props: AxisSelectorProps) {
    super(props);
    this.state = {
      yaxis: this.props.yaxis,
    };
    this.onToggleAxis = this.onToggleAxis.bind(this);
  }

  onToggleAxis() {
    this.setState({
      yaxis: this.state.yaxis === 2 ? 1 : 2,
    });

    if (this.props.onToggleAxis) {
      this.props.onToggleAxis();
    }
  }

  render() {
    const leftButtonClass = this.state.yaxis === 1 ? 'btn-success' : 'btn-inverse';
    const rightButtonClass = this.state.yaxis === 2 ? 'btn-success' : 'btn-inverse';

    return (
      <div className="p-b-1">
        <label className="small p-r-1">Y Axis:</label>
        <button onClick={this.onToggleAxis} className={'btn btn-small ' + leftButtonClass}>
          Left
        </button>
        <button onClick={this.onToggleAxis} className={'btn btn-small ' + rightButtonClass}>
          Right
        </button>
      </div>
    );
  }
}
