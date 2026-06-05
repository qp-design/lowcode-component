import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useSaveOperate } from "@brushes/component-store-web";
import { ButtonComponent } from "../../basic";
import { TransformType, useFormImpl } from "@brushes/form";
import { Form } from "antd";
import { noop } from "lodash";
import { useApiParam, useStoreApiParam } from "@brushes/component-tool";

const SaveOperate = ({
  text,
  _callbackimpl,
  api,
  preKey = "",
  retryKey = "retry",
  paramsStore,
  paramsStoreKey = "",
  params,
  transformDataConfig = [],
  openKey,
  ...restProps
}: {
  params?: Array<{ key: string; value: string }>;
  preKey?: string;
  retryKey?: string;
  _callbackimpl?: (e?: any) => void;
  openKey: string;
  api: string;
  text: string;
  paramsStore?: Array<{ key: string; value: string }>;
  paramsStoreKey?: string;
  transformDataConfig?: Array<TransformType>;
}) => {
  const form = Form.useFormInstance();
  const retry = useModuleContext((s) => s.moduleStore[retryKey]) || noop;
  const resetProps = useApiParam(params);
  const storeParams = useStoreApiParam(paramsStore, paramsStoreKey);
  const { handlerSubmit, inProgressStatus } = useFormImpl(
    form,
    () => {},
    transformDataConfig,
  );

  const { onSubmit } = useSaveOperate(
    api,
    openKey,
    retry,
    resetProps,
    preKey,
    storeParams,
    _callbackimpl,
  );

  return (
    <ButtonComponent
      loading={inProgressStatus[text]}
      text={text}
      onClick={handlerSubmit.bind(null, text, true, onSubmit)}
      {...restProps}
    ></ButtonComponent>
  );
};

export const SaveOperateComponent = HOCCodeWrapComponent(SaveOperate);
