import { FC, ReactNode, useEffect } from "react";
import { dynamicFormFields, FieldType } from "@brushes/form";
import { Button, Checkbox, Spin, Form } from "antd";
import { useLoginAndRegister } from "./hooks/useLoginAndReg";
import Protocol from "./protocol";
import classNames from "classnames";

interface LoginType {
  formConfig: Array<FieldType>;
  isNeedRemeber?: boolean | undefined;
  children: ReactNode;
  index?: number;
  name?: string;
  dataType?: string;
  protocol?: boolean;
  _callbackimpl?: (e?: any) => void;
  isNeedRegister: boolean;
  type?: string;
}

export const Login: FC<LoginType> = ({
  name,
  type,
  _callbackimpl,
  children,
  isNeedRegister,
  dataType,
  index,
  formConfig,
  isNeedRemeber,
  protocol,
}) => {
  const [form] = Form.useForm();
  const {
    buttonText,
    mode,
    actionImpl,
    onFinish,
    loading,
    LoginToRegisterImpl,
  } = useLoginAndRegister(isNeedRemeber, _callbackimpl, type);
  useEffect(() => {
    if (dataType?.includes("mode=register")) {
      LoginToRegisterImpl();
    }
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [index]);

  return (
    <div className="loginStyle">
      <div className="rPart">
        <div className="formWrap">
          <Form
            labelCol={{ span: 6 }}
            form={form}
            key={isNeedRemeber + mode}
            name={"normal_login" + mode + name}
            className="login-form"
            initialValues={isNeedRemeber ? { remember: true } : {}}
            onFinish={onFinish}
          >
            {dynamicFormFields(formConfig, form)}
            <div
              className={classNames(
                [true, false].includes(isNeedRemeber as boolean)
                  ? "bottom"
                  : "no-bottom",
              )}
            >
              <div
                className={classNames(
                  [true, false].includes(isNeedRemeber as boolean)
                    ? "forget"
                    : "",
                )}
              >
                {isNeedRemeber ? (
                  <>
                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>记住密码</Checkbox>
                    </Form.Item>
                    <a
                      className="login-form-forgot"
                      onClick={() => actionImpl("update")}
                    >
                      忘记密码
                    </a>
                  </>
                ) : null}
              </div>
              <Form.Item>
                <Spin spinning={loading}>
                  <Button
                    size={"large"}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    {buttonText}
                  </Button>
                </Spin>
              </Form.Item>
            </div>
            <Protocol
              isNeedRegister={isNeedRegister}
              children={children}
              actionImpl={actionImpl}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
