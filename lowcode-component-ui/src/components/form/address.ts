import { FieldType } from "@brushes/form";
import { addressBasicConfig } from "@brushes/component-tool";

export const transformSubmitDataConfig = [
  {
    from: "addressDefault",
    to: "addressDefault",
    format: (value: any) => {
      return value ? 1 : 0;
    },
  },
];
export const addressFormField: FieldType[] = [
  {
    label: "收货人",
    name: "addressMember",
    type: "text",
    rules: [{ required: true }],
  },
  {
    label: "手机号码",
    name: "addressPhone",
    type: "text",
    rules: [
      {
        required: true,
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确手机号码",
      },
    ],
  },
  ...addressBasicConfig,
  {
    label: "设为默认",
    name: "addressDefault",
    type: "checkbox",
  },
];
