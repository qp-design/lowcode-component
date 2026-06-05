import { FieldType } from "@brushes/form";
import { QjIcon } from "@brushes/share-resource";
import { FormInstance } from "antd";
import { code, userPhone } from "./resetForm";

export const loginPhone: Array<FieldType> = [
  {
    name: "loginName",
    type: "text",
    label: "",
    rules: [
      ({ setFieldValue }: FormInstance) => ({
        async validator(_: unknown, value: string) {
          if (/^1[3-9]\d{9}$/.test(value)) {
            setFieldValue("isDisabled", "");
            return Promise.resolve();
          } else {
            setFieldValue("isDisabled", true);
            return Promise.reject(new Error("输入正确的手机号码"));
          }
        },
      }),
    ],
    extraProps: {
      prefix: <QjIcon style={{ fontSize: "24px" }} name={"icon-user"} />,
      placeholder: "手机号",
      style: {
        height: 40,
      },
    },
  },
];

export const loginWithCode: Array<FieldType> = [
  ...userPhone,
  {
    name: "isDisabled",
    type: "text",
    label: "",
    style: { display: "none" },
  },
  ...code,
];
