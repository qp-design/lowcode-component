//@ts-nocheck
import { DatePicker } from 'antd';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
export default function RangePickerField({
  value = '',
  format = 'YYYY/MM/DD',
  ...extraProps
}) {
  const newValue = useMemo(() => {
    if (Array.isArray(value)) {
      const [a, b] = value;
      return [dayjs(a), dayjs(b)];
    }
  }, [value]);

  return <RangePicker value={newValue} format={format} {...extraProps} />;
}
