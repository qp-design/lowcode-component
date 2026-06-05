import { useImmutableCallback } from '@/util';
import { TransformType } from '../types';
import { cloneDeep, hasIn, omit, get, set } from 'lodash';

export const useDataComputed = (
  transformSubmitDataConfig: Array<TransformType> = []
) => {
  return useImmutableCallback(async (values: { [v: string]: unknown }) => {
    const forkTransformConfig = cloneDeep(transformSubmitDataConfig);
    while (forkTransformConfig.length > 0) {
      const {
        from,
        isDelete = false,
        to,
        format
      } = forkTransformConfig.shift() as TransformType;

      // flag为falsy类型需要检查不需要转化
      const flag = hasIn(values, from);
      if (!flag) {
        values = omit(values, from);
        continue;
      }

      const prevValue = get(values, from);
      const value = get(values, to);
      try {
        const computedValue = await format(prevValue, value);
        set(values, to, computedValue);
        if (isDelete) {
          values = omit(values, from);
        }
      } catch (err: any) {
        const msg = err.message || err.msg || '数据转化失败';
        throw new Error(msg);
      }
    }
    return values;
  });
};
