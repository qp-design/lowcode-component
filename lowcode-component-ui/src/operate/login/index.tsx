import { FC, ReactNode, useMemo, useState } from "react";
import HeaderJsx from "./header";
import { Login as LoginJsx } from "./login";
import { loginWithAccount, loginWithCode } from "./config";
import Register from "./registerAndForget";
import loginContext from "./context";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => {
  return {
    loginComponent: css`
      .logo {
        width: 70px;
        position: fixed;
        bottom: 10px;
        right: 10px;
      }

      .ant-input-affix-wrapper {
        height: 40px;
        line-height: 40px;
      }

      .ant-drawer-body {
        padding: 0;
      }

      .ant-drawer-title {
        height: 30px;
        line-height: 30px;
        font-size: 18px;
      }

      .loginRoot {
        overflow: hidden;
        border-radius: 16px;
        background: #fff;
        // height: 420px;
        width: 450px;
        z-index: 199;

        .header {
          height: 70px;
          display: table-cell;
          vertical-align: bottom;

          span {
            margin-left: 50px;
            display: inline-block;
            cursor: pointer;
            list-style: none;
            flex: 1;
            font-size: 18px;
            font-weight: 500;
            color: #888;

            &.actived {
              color: #444;
              font-size: 26px;
            }

            &:nth-of-type(1) {
              margin-right: 40px;
            }
          }
        }
      }

      .loginStyle {
        .ant-checkbox + span {
          padding-right: 0;
        }

        .bottom {
          //margin-top: 40px;

          .ant-form-item {
            margin-bottom: 10px;
          }
        }

        .no-bottom {
          .ant-form-item {
            margin-bottom: 10px;
          }
        }

        .rPart {
          .login-form-forgot {
            position: relative;
            top: 5px;
          }

          // height: 300px;
          padding: 20px 40px 0;
          background-color: #fff;
          position: relative;

          .forget {
            display: flex;
            height: 35px;
            justify-content: space-between;
          }

          .login-form-button {
            font-weight: 500;
            width: 100%;
          }

          .formWrap {
            margin: 0 auto;
          }
        }
      }

      .bottom-protocol {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;

        label~div {
          width: 0 !important;
        }
      }
    `,
  };
});

const LoginWrap: FC<{
  children: ReactNode;
  type: string;
  data: string;
  protocol?: boolean;
  _callbackimpl?: (e: any) => void | undefined;
  isNeedRegister: boolean;
}> = ({
  _callbackimpl,
  isNeedRegister,
  children,
  type = "b2b",
  data,
  protocol = false,
}) => {
  const [index, setIndex] = useState<number>(0);
  const { styles } = useStyles();
  const formConfig = useMemo(() => {
    return index === 0 ? loginWithAccount : loginWithCode;
  }, [index]);
  return (
    <div className={styles.loginComponent}>
      <loginContext.OpenProvider>
        <div className={"loginRoot"}>
          <Register
            isNeedRegister={isNeedRegister}
            children={children}
            dataType={data}
          />
          <HeaderJsx
            index={index}
            setIndex={setIndex}
            menu={["密码登录", "验证码登录"]}
          />
          <LoginJsx
            type={type}
            _callbackimpl={_callbackimpl}
            isNeedRegister={isNeedRegister}
            dataType={data}
            index={index}
            children={children}
            isNeedRemeber={index === 0}
            protocol={protocol}
            formConfig={formConfig}
          />
        </div>
      </loginContext.OpenProvider>
    </div>
  );
};

export const LogoinComponent = HOCCodeWrapComponent(LoginWrap);
