import { Checkbox, FormInstance } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { NamePath } from '@/components';

export default function CheckboxGroupField({
  form,
  options = [],
  fieldNames = {
    label: 'label',
    value: 'value'
  },
  dependencySingle,
  dependencies,
  ...extraProps
}: {
  form: FormInstance;
  fieldNames?: {
    label?: string;
    value?: string;
  };
  options?:
    | Array<{ [v: string]: string | number }>
    | ((e: any) => Promise<any>);
  dependencies?: NamePath;
  dependencySingle?: NamePath;
}) {
  const [option, setOption] = useState<
    Array<{
      // @ts-ignore
      direction?: 'horizontal' | 'vertical';
      [v: string]: string | number;
    }>
  >([]);

  const value =
    dependencySingle || dependencies
      ? form.getFieldValue(dependencySingle ? dependencySingle : dependencies)
      : '';

  useEffect(() => {
    if (typeof options !== 'function') {
      setOption(options);
    }
  }, [options]);

  useEffect(() => {
    (async () => {
      try {
        const data = await (typeof options !== 'function'
          ? Promise.resolve(options)
          : options(value));
        setOption(data);
      } catch (e) {
        setOption([]);
      }
    })();
  }, [value]);
  const newOption = useMemo(() => {
    return option.map((item) => ({
      ...item,
      label: item[fieldNames.label || 'label'],
      value: item[fieldNames.value || 'value']
    }));
  }, [option]);

  return <Checkbox.Group {...extraProps} options={newOption}></Checkbox.Group>;
}
