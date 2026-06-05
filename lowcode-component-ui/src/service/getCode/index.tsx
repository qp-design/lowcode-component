import { dynamicFormFields, FieldType } from "@brushes/form";
import { GetVercode, CodeJsx } from "./common";
import { Form, FormInstance } from "antd";
import { HOCCodeWrapComponent } from "@brushes/core-transform";

export const imgCode: Array<FieldType> = [
  {
    name: "verCode",
    type: "slot",
    label: "",
    extraProps: {
      shouldUpdate: (prevValue, curValue) =>
        prevValue.isDisabled !== curValue.isDisabled,
      render: GetVercode,
    },
  },
];
const code: Array<FieldType> = [
  {
    name: "oldUserPhone",
    type: "text",
    label: "当前手机号",
    rules: [
      { required: true, message: "请输入正确手机号", pattern: /^1[3-9]\d{9}$/ },
    ],
    extraProps: {
      autoComplete: "off",
      placeholder: "手机号",
    },
  },
  {
    name: "newUserPhone",
    type: "text",
    label: "新的手机号",
    rules: [
      ({ setFieldValue }: FormInstance) => ({
        async validator(_: any, value: string) {
          if (/^1[3-9]\d{9}$/.test(value)) {
            try {
              setFieldValue("isDisabled", "");
              return Promise.resolve();
            } catch (e) {
              setFieldValue("isDisabled", true);
              return Promise.reject(e);
            }
          } else {
            setFieldValue("isDisabled", true);
            return Promise.reject(new Error("输入正确的手机号码"));
          }
        },
      }),
    ],
    extraProps: {
      autoComplete: "off",
      placeholder: "手机号",
    },
  },
  {
    name: "isDisabled",
    type: "text",
    label: "",
    style: { display: "none" },
  },
  ...imgCode,
  {
    name: "code",
    type: "slot",
    label: "",
    extraProps: {
      shouldUpdate: (prevValue, curValue) =>
        prevValue.verCode !== curValue.verCode,
      render: ({ form }) => {
        return (
          <>
            {dynamicFormFields(
              [
                {
                  name: "code",
                  type: "text",
                  label: "验证码",
                  rules: [{ required: true, message: "请输入验证码" }],
                  extraProps: {
                    autoComplete: "off",
                    shouldUpdate: (prevValue, curValue) =>
                      prevValue.verCode !== curValue.verCode,
                    placeholder: "请输入验证码",
                    addonAfter: <CodeJsx codeKey={"newUserPhone"} />,
                  },
                },
              ],
              form,
            )}
          </>
        );
      },
    },
  },
];

const GetCode = () => {
  const form = Form.useFormInstance();
  return <>{dynamicFormFields(code, form)}</>;
};

export const GetCodeComponent = HOCCodeWrapComponent(GetCode);
