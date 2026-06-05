import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { ButtonComponent } from "../../basic";
import { post } from "@brushes/request";
import { useMemo, useState } from "react";
import { message } from "antd";
import { useModuleRootContext } from "@brushes/component-core";
import { isEmpty } from "lodash";
import { useNavigateImpl } from "@brushes/component-tool";

const Logout = ({ text, defaultValue, ...props }: any) => {
  const { navigator } = useNavigateImpl();
  const setModuleRootStore = useModuleRootContext((s) => s.setModuleRootStore);
  const _userInfo = useModuleRootContext((s) => s.rootStore._userInfo);
  const [loading, setLoading] = useState(false);
  const valueText = useMemo(() => {
    return isEmpty(_userInfo) ? defaultValue : text;
  }, [_userInfo]);
  const logoutImpl = async () => {
    if (isEmpty(_userInfo)) {
      navigator("/login");
    } else {
      try {
        setLoading(true);
        const { msg } = await post("/web/ml/mlogin/loginOut.json");
        message.success(msg);
        localStorage.clear();
        setModuleRootStore({
          _userInfo: {},
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <ButtonComponent
      {...props}
      text={valueText}
      onClick={logoutImpl}
      loading={loading}
    ></ButtonComponent>
  );
};

export const LogoutComponent = HOCCodeWrapComponent(Logout);
