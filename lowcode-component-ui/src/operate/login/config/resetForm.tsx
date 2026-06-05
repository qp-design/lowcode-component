import { dynamicFormFields, FieldType } from "@brushes/form";
import { QjIcon } from "@brushes/share-resource";
import { FormInstance } from "antd";
import {
  CodeComponent as CodeJsx,
  ImageCodeComponent as ImageJsx,
} from "@brushes/component-core";

import { checkUserPhoneThere } from "qj-b2c-api";

import { createStyles } from "antd-style";

const useStyle = createStyles(
  ({ token, css }, { height }: { height: number }) => {
    return {
      wrap: css`
        input[name="code"] {
          height: ${height}px;
        }
      `,
    };
  },
);

const Tu = ({ form, height = 40 }: { form: FormInstance; height?: number }) => {
  const { styles } = useStyle({ height });
  return (
    <div className={styles.wrap}>
      {dynamicFormFields(
        [
          {
            name: "code",
            type: "text",
            label: "",
            rules: [{ required: true, message: "请输入验证码" }],
            extraProps: {
              autoComplete: "off",
              shouldUpdate: (
                prevValue: { verCode: any },
                curValue: { verCode: any },
              ) => prevValue.verCode !== curValue.verCode,
              // prefix: <QjIcon style={{ fontSize: '24px' }} name={'icon-yanzhengma'} />,
              placeholder: "请输入验证码",
              addonAfter: <CodeJsx />,
              style: {
                height: 40,
              },
            },
          },
        ],
        form,
      )}
    </div>
  );
};
export const imgCode: Array<FieldType> = [
  {
    name: "verCode",
    type: "slot",
    label: "",
    extraProps: {
      shouldUpdate: (prevValue, curValue) =>
        prevValue.isDisabled !== curValue.isDisabled,
      //@ts-ignore
      render: ImageJsx,
    },
  },
];
export const code: Array<FieldType> = [
  ...imgCode,
  {
    name: "code",
    type: "slot",
    label: "",
    extraProps: {
      shouldUpdate: (prevValue, curValue) =>
        prevValue.verCode !== curValue.verCode,
      render: ({ form }) => {
        return <Tu form={form} />;
      },
    },
  },
];
export const forgetAndRegister: Array<FieldType> = [
  ...code,
  {
    name: "isDisabled",
    type: "text",
    label: "",
    style: { display: "none" },
  },
  {
    name: "userPwsswd",
    type: "password",
    label: "",
    rules: [
      {
        required: true,
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/,
        message: "密码必须是8-16位，且包含大小写字母、数字、特殊字符",
      },
    ],
    extraProps: {
      autoComplete: "off",
      // prefix: <QjIcon style={{ fontSize: '24px' }} name={'icon-mima'} />,
      placeholder: "请输入新密码",
      type: "password",
      style: {
        height: 40,
      },
    },
  },
];

export const userPhone: Array<FieldType> = [
  {
    name: "userPhone",
    type: "text",
    label: "",
    rules: [
      ({ setFieldValue }: FormInstance) => ({
        async validator(_: any, value: string) {
          if (/^1[3-9]\d{9}$/.test(value)) {
            try {
              // await checkUserPhoneThere({ userPhone: value });
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
      // prefix: <QjIcon style={{ fontSize: '24px' }} name={'icon-user'} />,
      placeholder: "手机号",
      style: {
        height: 40,
      },
    },
  },
];

export const userPhoneDefault: Array<FieldType> = [
  {
    name: "userPhone",
    type: "text",
    label: "",
    rules: [
      ({ setFieldValue }: FormInstance) => ({
        async validator(_: any, value: string) {
          if (/^1[3-9]\d{9}$/.test(value)) {
            try {
              await checkUserPhoneThere({ userPhone: value });
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
      disabled: true,
      autoComplete: "off",
      prefix: <QjIcon style={{ fontSize: "24px" }} name={"icon-user"} />,
      placeholder: "手机号",
      style: {
        height: 40,
      },
    },
  },
];

export const forgetConfig: Array<FieldType> = [
  ...userPhone,
  ...forgetAndRegister,
];
