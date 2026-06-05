import { useCallback, useMemo } from "react";
import { updateUmuserPw } from "qj-b2c-api";
import {
  saveUserPhoneForPla,
  uploadGoodsFile,
} from "@brushes/lowcode-component-api";
import loginContext from "../context";
import { useLoginHooks } from "./useLoginHooks";
import { get, isEmpty } from "lodash";
import { message } from "antd";
import { eventTracking } from "@brushes/component-store-web";
type ActionKey = "login" | "loginWithCode" | "register" | "update";

type ActionType = {
  [v in ActionKey]: (e: object) => void;
};

export function useLoginAndRegister(
  isNeedRemeber: boolean | undefined,
  _callbackimpl?: (e: any) => void | undefined,
  type?: string,
) {
  const dispatch = loginContext.useOpenDispatch();
  const { loginImpl, loginWithCodeImpl, setLoading, loading } = useLoginHooks(
    _callbackimpl,
    type,
  );
  const { buttonText, mode } = loginContext.useOpenValues();

  const submitImpl: ActionType = useMemo(
    () => ({
      login: loginImpl,
      loginWithCode: loginWithCodeImpl,
      register: registerImpl,
      update: updateImpl,
    }),
    [],
  );

  async function updateImpl(values: any) {
    setLoading(true);
    try {
      await updateUmuserPw(values);
      toLoginImpl();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function registerImpl(values: any) {
    try {
      setLoading(true);
      const { upFileArr = [], userinfoCorp } = values;
      if (!isEmpty(upFileArr)) {
        const file = get(upFileArr, "[0].originFileObj");
        const { fileUrl } = await uploadGoodsFile({ file });
        values.userinfoCert2Url = fileUrl;
        values.userinfoCompname = userinfoCorp;
        values.upFileArr = fileUrl;
      }

      const { msg, dataObj } = await saveUserPhoneForPla({
        userinfoJosn: JSON.stringify(values),
      });

      eventTracking("Register", dataObj);
      message.success(msg);
      toLoginImpl();
      // callback(data.dataObj, '/user/center');
    } catch (err) {
      console.log(51, err);
    } finally {
      setLoading(false);
    }
  }

  const onFinish = (values: any) => {
    let key = "";
    switch (isNeedRemeber) {
      case true:
        key = "login";
        break;
      case false:
        key = "loginWithCode";
        break;
      case undefined:
        key = mode;
        break;
    }
    submitImpl[key as ActionKey](values);
  };

  const updateToRegisterImpl = () => {
    dispatch({
      type: "open",
      payload: {
        mode: "update",
        to: "register",
        title: "修改密码",
        buttonText: "设置新密码",
        textInfo: "入驻申请",
      },
    });
  };

  const LoginToRegisterImpl = () => {
    dispatch({
      type: "open",
      payload: {
        mode: "register",
        to: "login",
        title: "入驻申请",
        buttonText: "立即注册",
        textInfo: "登录",
      },
    });
  };

  const toLoginImpl = () => {
    dispatch({
      type: "close",
      payload: {
        mode: undefined,
        to: "register",
        title: "修改密码",
        buttonText: "登录",
        textInfo: "入驻申请",
      },
    });
  };

  const actionImpl = useCallback((mode = "register") => {
    switch (mode) {
      case "update":
        updateToRegisterImpl();
        break;
      case "register":
        LoginToRegisterImpl();
        break;
      case "login":
        toLoginImpl();
        break;
    }
  }, []);

  return {
    LoginToRegisterImpl,
    buttonText,
    mode,
    actionImpl,
    onFinish,
    loading,
  };
}
