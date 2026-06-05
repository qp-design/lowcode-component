import { Cascader, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { NamePath } from '@/components';

export default function CascaderField({
  dependencies,
  form,
  options = [],
  dependencySingle,
  ...extraProps
}: {
  dependencies?: NamePath;
  form: FormInstance;
  dependencySingle?: NamePath;
  options?:
    | Array<{ [v: string]: string | number }>
    | ((e: any) => Promise<any>);
}) {
  const [option, setOption] = useState<Array<{ [v: string]: string | number }>>(
    []
  );
  const value =
    dependencySingle || dependencies
      ? form.getFieldValue(dependencySingle ? dependencySingle : dependencies)
      : '';
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
  return <Cascader options={option} {...extraProps} />;
}
