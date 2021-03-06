import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { ColorPickerPopover } from './ColorPickerPopover';
import { getColorDefinitionByName, getNamedColorPalette } from '../../utils/namedColorsPalette';
import { ColorSwatch } from './NamedColorsGroup';
import { flatten } from 'lodash';
import { GrafanaTheme } from '../../types';

const allColors = flatten(Array.from(getNamedColorPalette().values()));

describe('ColorPickerPopover', () => {
  const BasicGreen = getColorDefinitionByName('green');
  const BasicBlue = getColorDefinitionByName('blue');

  describe('rendering', () => {
    it('should render provided color as selected if color provided by name', () => {
      const wrapper = mount(<ColorPickerPopover color={BasicGreen.name} onChange={() => {}} />);
      const selectedSwatch = wrapper.find(ColorSwatch).findWhere(node => node.key() === BasicGreen.name);
      const notSelectedSwatches = wrapper.find(ColorSwatch).filterWhere(node => node.prop('isSelected') === false);

      expect(selectedSwatch.length).toBe(1);
      expect(notSelectedSwatches.length).toBe(allColors.length - 1);
      expect(selectedSwatch.prop('isSelected')).toBe(true);
    });

    it('should render provided color as selected if color provided by hex', () => {
      const wrapper = mount(<ColorPickerPopover color={BasicGreen.variants.dark} onChange={() => {}} />);
      const selectedSwatch = wrapper.find(ColorSwatch).findWhere(node => node.key() === BasicGreen.name);
      const notSelectedSwatches = wrapper.find(ColorSwatch).filterWhere(node => node.prop('isSelected') === false);

      expect(selectedSwatch.length).toBe(1);
      expect(notSelectedSwatches.length).toBe(allColors.length - 1);
      expect(selectedSwatch.prop('isSelected')).toBe(true);
    });
  });

  describe('named colors support', () => {
    const onChangeSpy = jest.fn();
    let wrapper: ReactWrapper;

    afterEach(() => {
      wrapper.unmount();
      onChangeSpy.mockClear();
    });

    it('should pass hex color value to onChange prop by default', () => {
      wrapper = mount(
        <ColorPickerPopover color={BasicGreen.variants.dark} onChange={onChangeSpy} theme={GrafanaTheme.Light} />
      );
      const basicBlueSwatch = wrapper.find(ColorSwatch).findWhere(node => node.key() === BasicBlue.name);

      basicBlueSwatch.simulate('click');

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(BasicBlue.variants.light);
    });

    it('should pass color name to onChange prop when named colors enabled', () => {
      wrapper = mount(
        <ColorPickerPopover
          enableNamedColors
          color={BasicGreen.variants.dark}
          onChange={onChangeSpy}
          theme={GrafanaTheme.Light}
        />
      );
      const basicBlueSwatch = wrapper.find(ColorSwatch).findWhere(node => node.key() === BasicBlue.name);

      basicBlueSwatch.simulate('click');

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(BasicBlue.name);
    });
  });
});
