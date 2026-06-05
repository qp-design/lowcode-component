import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { dynamicFormFields, FieldType } from "@brushes/form";
import { Form, FormInstance } from "antd";
import { useMemo } from "react";

type DynamicFormProps =
  | Array<FieldType>
  | ((e: FormInstance) => Array<FieldType>);

const DynamicComponent = ({
  formConfig = [],
}: {
  formConfig: DynamicFormProps;
}) => {
  const form = Form.useFormInstance();

  const formConfigList = useMemo(() => {
    return typeof formConfig === "function" ? formConfig(form) : formConfig;
  }, [formConfig]);

  return (
    <div className={"diy-form-item"} style={{ padding: "5px 0" }}>
      {dynamicFormFields(formConfigList, form)}
    </div>
  );
};

export const DynamicFormComponent = HOCCodeWrapComponent(DynamicComponent);
