import { dynamicFormFields, FieldType } from "@brushes/form";
import { FormInstance } from "antd";
import { addressBasicConfig } from "@brushes/component-tool";
import CodeJsx from "../components/code";
import ImageJsx from "../components/image";

export const registerConfig: Array<FieldType> = [
  {
    name: "userinfoType",
    type: "select",
    label: "用户类型",
    rules: [
      {
        required: true,
        message: "输选择用户类型",
      },
    ],
    extraProps: {
      options: [
        {
          label: "个人",
          value: 1,
        },
        {
          label: "企业",
          value: 2,
        },
      ],
      placeholder: "输入采购商名称",
    },
  },
  {
    name: "userinfoCorp",
    type: "text",
    label: "会员名称",
    rules: [
      {
        required: true,
        message: "输入会员名称",
      },
    ],
    extraProps: {
      placeholder: "输入会员名称",
    },
  },
  {
    name: "userinfoCon",
    type: "text",
    label: "联系人",
    rules: [
      {
        required: true,
        message: "输入联系人",
      },
    ],
    extraProps: {
      placeholder: "输入联系人",
    },
  },
  {
    label: "邀请码",
    name: "userinfoInvite",
    type: "text",
  },
  {
    name: "userinfoConPhone",
    type: "text",
    label: "手机号",
    rules: [
      { required: true, message: "输入正确的手机号码" },
      ({ setFieldValue }: FormInstance) => ({
        async validator(_: unknown, value: string) {
          if (/^1[3-9]\d{9}$/.test(value)) {
            setFieldValue("isDisabled", "");
            // await getPhoneForPlaRegSc({ userPhone: value });
            return Promise.resolve();
          } else {
            setFieldValue("isDisabled", true);
            return Promise.reject();
          }
        },
      }),
    ],
    extraProps: {
      placeholder: "手机号",
    },
  },
  {
    name: "isDisabled",
    type: "text",
    label: "",
    style: { display: "none" },
  },
  {
    name: "verCode",
    type: "slot",
    label: "图形验证码",
    extraProps: {
      shouldUpdate: (prevValue, curValue) =>
        prevValue.isDisabled !== curValue.isDisabled,
      render: () => <ImageJsx height={32} />,
    },
  },
  {
    name: "code",
    type: "slot",
    label: "短信验证码",
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
                  label: "",
                  rules: [{ required: true, message: "请输入验证码" }],
                  extraProps: {
                    autoComplete: "off",
                    shouldUpdate: (
                      prevValue: { verCode: any },
                      curValue: { verCode: any },
                    ) => prevValue.verCode !== curValue.verCode,
                    placeholder: "请输入验证码",
                    addonAfter: <CodeJsx height={30} />,
                    style: {
                      height: 30,
                    },
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
  {
    name: "userPwsswd",
    type: "text",
    label: "密码",
    rules: [
      {
        required: true,
        message: "输入密码",
      },
    ],
    extraProps: {
      type: "password",
      placeholder: "输入密码",
    },
  },
  {
    name: "userPwsswdAgin",
    type: "text",
    label: "确认密码",
    rules: [
      {
        required: true,
        message: "输入确认密码",
      },
    ],
    extraProps: {
      type: "password",
      placeholder: "输入确认密码",
    },
  },
  ...addressBasicConfig,
  {
    label: "备注信息",
    name: "userinfoRemark",
    type: "text",
  },
  {
    label: "邮箱账号",
    name: "emailCode",
    type: "text",
  },
  {
    label: "资质文件",
    name: "upFileArr",
    type: "upload",
    calIsVisible: (form) => form.getFieldValue("userinfoType") === 2,
    rules: [{ required: true, message: "不能为空" }],
    // rules: [
    //     ({ getFieldValue } : FormInstance) => ({
    //         required: getFieldValue('userinfoType') === 2,
    //         message: '不能为空',
    //     }),
    // ],
    extraProps: {
      dependencies: ["userinfoType"],
      listType: "picture-card",
      text: "上传图片",
      max: 1,
      suffixicon: (
        <span style={{ fontSize: 12, color: "#999" }}>
          建议上传1Mb以内的图片
        </span>
      ),
    },
  },
];
