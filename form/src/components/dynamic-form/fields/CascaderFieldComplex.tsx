//@ts-nocheck
import { Cascader, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { NamePath } from '@/components';
import { set } from 'lodash';

export default function CascaderFieldComplex({
  dependencies,
  form,
  options = [],
  value,
  dependencySingle,
  fieldNames = {},
  ...extraProps
}: {
  dependencies?: NamePath;
  fieldNames?: any;
  form: FormInstance;
  value?: any;
  dependencySingle?: NamePath;
  options?:
    | Array<{ [v: string]: string | number }>
    | ((e: any) => Promise<any>);
}) {
  const [option, setOption] = useState<Array<{ [v: string]: string | number }>>(
    []
  );

  const v = dependencies
    ? dependencies.map((item) => form.getFieldValue(item) ?? '').join(',')
    : '';

  // 查找完整路径的函数
  // @ts-ignore
  const findPathByLeafCode = (options: Array<any>, code: string, path = []) => {
    for (let i = 0; i < options.length; i++) {
      const item = options[i];
      const currentPath = [...path, item[fieldNames?.value]];

      if (item[fieldNames?.value] === code) {
        return currentPath;
      }

      if (item[fieldNames?.children]) {
        // @ts-ignore
        const found = findPathByLeafCode(
          item[fieldNames?.children],
          code,
          currentPath
        );
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      try {
        let params = {};
        if (typeof options === 'function') {
          if (v === ',') {
            params = {};
          } else {
            const va = v.split(',');
            (dependencies || []).forEach((item, index) => {
              set(params, item, va[index]);
            });
          }
        }
        const data = await (typeof options !== 'function'
          ? Promise.resolve(options)
          : options(params));
        setOption(data);
      } catch (e) {
        setOption([]);
      }
    })();
  }, [v, options]);

  return (
    <Cascader
      value={findPathByLeafCode(option, value)}
      options={option}
      fieldNames={fieldNames}
      {...extraProps}
    />
  );
}
