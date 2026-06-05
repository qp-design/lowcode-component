import { Checkbox } from 'antd';

export default function CheckboxField({
  label,
  ...extraProps
}: {
  label?: string;
}) {
  return <Checkbox {...extraProps}>{label}</Checkbox>;
}
