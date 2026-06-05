import { useState } from 'react';
import { NamePath, submitType, TransformType } from '../types';
import { FormInstance, message } from 'antd';
import { useImmutableCallback } from '@/util';
import { useDataComputed } from './useDataComputed';

export function useFormImpl(
  form: FormInstance,
  onSubmit: (...args: submitType) => void,
  transformSubmitDataConfig: Array<TransformType> = []
) {
  const [loading, setIsSubmitting] = useState<boolean>(false);
  const [inProgressStatus, setActionsStatus] = useState<{
    [v: string]: boolean;
  }>({});

  const computedSubmitValues = useDataComputed(transformSubmitDataConfig);

  const onFinish = useImmutableCallback(async (values: any) => {
    setIsSubmitting(true);
    try {
      const value = await computedSubmitValues(values);
      onSubmit(
        value,
        (msg) => {
          const { setFieldsValue, getFieldsValue } = form;
          setIsSubmitting(false);
          setFieldsValue(getFieldsValue()); // reset accountForm touched state
          if (msg) message.success(msg);
        },
        () => {
          setIsSubmitting(false);
        }
      );
    } catch (err: any) {
      // message.error(err.message);
      setIsSubmitting(false);
    }
  });

  const onFinishFailed = useImmutableCallback(
    ({ errorFields }: { errorFields: Array<{ name: NamePath }> }) => {
      form.scrollToField(errorFields[0].name);
    }
  );

  const resetHandler = useImmutableCallback(() => {
    form.resetFields();
    onFinish({});
  });

  const setActionInProgress = useImmutableCallback(
    (key: string, status: boolean) => {
      setActionsStatus((prev) => ({ ...prev, [key]: status }));
    }
  );

  const handlerSubmit = useImmutableCallback(
    (key: string, isNeedValidate: boolean, callback: Function) => {
      (async () => {
        setActionInProgress(key, true);
        try {
          let computedValue;
          if (isNeedValidate) {
            const values = await form.validateFields();
            computedValue = await computedSubmitValues(values);
          }
          callback(() => setActionInProgress(key, false), computedValue);
        } catch (err) {
          setActionInProgress(key, false);
        }
      })();
    }
  );

  return {
    onFinish,
    onFinishFailed,
    loading,
    resetHandler,
    handlerSubmit,
    inProgressStatus,
    computedSubmitValues
  };
}
