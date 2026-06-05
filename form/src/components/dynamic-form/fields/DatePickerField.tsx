import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function DatePickerField({
  value,
  format = 'YYYY/MM/DD',
  ...extraProps
}: {
  format?: string;
  value?: string;
}) {
  return (
    <DatePicker
      format={format}
      value={value ? dayjs(value) : null}
      {...extraProps}
    />
  );
}
