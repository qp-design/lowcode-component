import {
  dynamicFormFields,
  FieldType,
  submitFunType,
  useFormImpl,
} from "@brushes/form";
import { useEffect, useMemo, useRef, useState } from "react";
import { Form, Button, message } from "antd";
import { post, get } from "@brushes/request";
import { useModuleContext } from "@brushes/component-core";
import { addressFormField, transformSubmitDataConfig } from "./address";
import { isEmpty } from "lodash";

type FormType = {
  background: string;
  formConfig: FieldType[];
  padding: number;
  grid: number;
  api: string;
  callbackName?: string;
  activeModule: string;
  saveText?: string;
  type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
  formName?: string;
  openKey?: string;
  layout: "horizontal" | "vertical" | "inline";
};

export const FormJsx = ({
  layout,
  grid,
  activeModule,
  formName,
  openKey,
  callbackName,
  api,
  type,
  saveText,
}: FormType) => {
  const [form] = Form.useForm();
  const retry = useModuleContext((s) => s.moduleStore[callbackName || ""]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const transformConfig = useRef([]);
  const formEditorId = useModuleContext((s) => s.moduleStore.formEditorId);
  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (formEditorId) {
      (async () => {
        const data = await get("/web/um/address/getAddress.json", {
          addressId: formEditorId,
        });
        data.addressDefault =
          data.addressDefault !== "1" ? "" : data.addressDefault;
        setInitialValues(data);
      })();
    }
  }, [formEditorId]);

  const newFormConfig = useMemo(() => {
    if (activeModule === "address") {
      transformConfig.current = transformSubmitDataConfig;
      return addressFormField;
    }
    return [];
    // return formConfig.map(item => {
    //   const { type } = item;
    //   console.log(25, item);
    //   if(type === 'slot') {
    //     return {
    //       ...item,
    //       // shouldUpdate: (prevValues: any, curValues: any) => prevValues['skuNo'] !== curValues['skuNo'],
    //       render() {
    //         return (
    //           <Element
    //             canvas
    //             id={'react_context'}
    //             custom={{form}}
    //             is={InnerFormComponent}
    //           >
    //           </Element>
    //         )
    //       }
    //     };
    //   }
    //   return item
    // })
  }, [activeModule]);

  const onSubmit: submitFunType = async (values, suc, error) => {
    if (formEditorId) {
      const { msg } = await post("/web/um/address/updateAddress.json", {
        ...values,
        addressId: formEditorId,
      });
      message.success(msg);
    } else {
      const { msg } = await post(api, values);
      message.success(msg);
    }
    if (callbackName) {
      await retry();
    }
    if (openKey) {
      setModuleStore({
        [openKey]: false,
      });
    }
    suc();
  };

  const { loading, onFinish, onFinishFailed } = useFormImpl(
    form,
    onSubmit,
    transformConfig.current,
  );

  if (formEditorId && isEmpty(initialValues)) {
    return null;
  }

  return (
    <Form
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      name={formName}
      layout={layout}
    >
      <div
        style={{
          display: "grid",
          gridColumnGap: layout === "vertical" ? 10 : 0,
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
        }}
      >
        {dynamicFormFields(newFormConfig, form)}
      </div>
      <Button loading={loading} type={type} htmlType="submit">
        {saveText}
      </Button>
    </Form>
  );
};
