import { ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';
type NamePath = string | number | (string | number)[];

export default ({
  name,
  onChange,
  ...restProps
}: {
  name: NamePath;
  onChange: (e: Color) => void;
}) => {
  const onChangeImpl = (e: any) => {
    onChange(e.toHexString());
  };
  return (
    <ColorPicker
      onChange={onChangeImpl}
      {...restProps}
      presets={[
        {
          label: 'Recommended',
          colors: [
            '#000000',
            '#000000E0',
            '#000000A6',
            '#00000073',
            '#00000040',
            '#00000026',
            '#0000001A',
            '#00000012',
            '#0000000A',
            '#00000005',
            '#F5222D',
            '#FA8C16',
            '#FADB14',
            '#8BBB11',
            '#52C41A',
            '#13A8A8',
            '#1677FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96',
            '#F5222D4D',
            '#FA8C164D',
            '#FADB144D',
            '#8BBB114D',
            '#52C41A4D',
            '#13A8A84D',
            '#1677FF4D',
            '#2F54EB4D',
            '#722ED14D',
            '#EB2F964D'
          ]
        },
        {
          label: 'Recent',
          colors: []
        }
      ]}
    />
  );
};
