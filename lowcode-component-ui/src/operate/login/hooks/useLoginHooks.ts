import { useState } from "react";
import { loginInByCode, loginOut, saveUmuserPhoneVCode } from "qj-b2c-api";
import { loginIn } from "@brushes/lowcode-component-api";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useModuleRootContext } from "@brushes/component-core";
import { crypto } from "@brushes/component-tool";

let key: string;
try {
  key = process.env.REACT_APP_SESSION_KEY || "saas-token";
} catch (err) {
  key = "saas-token";
}

interface DataType {
  dataObj: {
    [v: string]: any;
  };
}

export function useLoginHooks(_callbackimpl?: any, type?: string) {
  const navigator = useNavigate();
  const setModuleRootStore = useModuleRootContext((s) => s.setModuleRootStore);
  const [loading, setLoading] = useState<boolean>(false);
  async function loginImpl(values: any) {
    const code = values.verCode;
    const userPhone = values.userPhone;
    const params = _.omit(values, ["remember", "verCode", "userPhone"]);
    // params.passwd = crypto.encrypt(params.passwd)

    if (values.remember) {
      localStorage.setItem(values.loginName, btoa(values.passwd));
    } else {
      localStorage.removeItem(values.loginName);
    }
    setLoading(true);
    try {
      const data = (await loginIn({
        ...params,
        loginName: userPhone,
        code,
      })) as DataType;
      callbackImpl(data);
      // callback(data.dataObj);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  const callbackImpl = (data: DataType) => {
    const _userInfo = JSON.parse(_.get(data, "dataObj.userInfo", "{}"));
    const { ticketTokenid } = _userInfo;
    localStorage.setItem("saas-token", ticketTokenid);
    setModuleRootStore({
      _userInfo,
    });
    if (_callbackimpl) {
      _callbackimpl(data);
    } else {
      navigator("/index");
    }
  };
  async function loginWithCodeImpl(values: any) {
    setLoading(true);
    try {
      const userPhone = values.userPhone;
      const params = _.omit(values, ["userPhone"]);
      if (type === "b2c") {
        const data = (await saveUmuserPhoneVCode(values)) as DataType;
        callbackImpl(data);
        return;
      }
      const data = (await loginInByCode({
        ...params,
        loginName: userPhone,
      })) as DataType;
      callbackImpl(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function loginOutImpl(params = { oauthEnvCode: "out" }) {
    setLoading(true);
    try {
      await loginOut(params);
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  return {
    loginImpl,
    setLoading,
    loading,
    loginOutImpl,
    loginWithCodeImpl,
  };
}
