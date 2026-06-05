import { ConfigProvider, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { Element } from "@brushes/component-core";
import { Container } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { createStyles } from "antd-style";
import { AccountBuyComponent } from "../../operate";
import { useSearchParamHook } from "@brushes/component-store-web";

const useStyle = createStyles(({ token, prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(
          135deg,
          ${token.colorPrimary},
          ${token.colorBgTextActive}
        );
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const FormWrap = ({
  formName = "basic",
  padding,
  margin,
  disabled,
  layout = "horizontal",
}: any) => {
  const { styles } = useStyle();
  const [form] = useForm();
  const [mode] = useSearchParamHook(["mode"]);
  return (
    <div
      style={{
        ...padding,
        ...margin,
      }}
    >
      <Form
        {...{
          layout,
          form,
          disabled: mode === disabled,
          name: formName,
        }}
      >
        <Element
          canvas
          text={"表单内容放置区域"}
          is={Container}
          id={"form-container-address"}
        ></Element>

        <Form.Item label={layout !== "vertical" ? " " : ""} colon={false}>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton,
            }}
          >
            <Element
              justifyContent="flex-end"
              flexDirection={"row"}
              canvas
              text={"表单按钮放置区域"}
              id={"button-submit"}
              is={Container}
            >
              <AccountBuyComponent
                saveText={"提交订单"}
                transformSubmitDataConfig={[
                  {
                    type: "file",
                    name: "",
                  },
                ]}
              />
            </Element>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
};

export const FormComponent = HOCCodeWrapComponent(FormWrap);
