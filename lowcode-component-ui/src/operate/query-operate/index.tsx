import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { ButtonComponent } from "../../basic";
import { TransformType, useFormImpl } from "@brushes/form";
import { Form } from "antd";

const QueryOperate = ({
  text,
  api,
  transformDataConfig = [],
  ...restProps
}: {
  api: string;
  text: string;
  transformDataConfig?: Array<TransformType>;
}) => {
  const form = Form.useFormInstance();
  const { handlerSubmit } = useFormImpl(form, () => {}, transformDataConfig);

  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  const onSubmit = (cb: any, value: any) => {
    cb();
    setModuleStore({
      params: { page: 1, ...value},
    });
  };

  return (
    <ButtonComponent
      text={text}
      onClick={handlerSubmit.bind(null, text, true, onSubmit)}
      {...restProps}
    ></ButtonComponent>
  );
};

export const QueryOperateComponent = HOCCodeWrapComponent(QueryOperate);
