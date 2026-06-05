import { formConfig, transformSubmitDataConfig } from "./config";
import { DynamicForm, submitFunType } from "@brushes/form";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { post, get as getIo } from "@brushes/request";
import { message, Spin } from "antd";
import { useSearchParamHook } from "@brushes/component-store-web";
import { useEffect, useMemo, useRef, useState } from "react";
import { isEmpty, get } from "lodash";
import { useModuleContext } from "@brushes/component-core";
import { createStyles } from "antd-style";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles(({ token, css }) => {
  return {
    wrap: css`
      .ant-space-item button {
        padding: 18px 20px;
        margin-left: -15px;
      }
    `,
  };
});

const Custom = ({
  storeKey,
  openKey,
  padding = {},
  margin = {},
}: {
  padding: object;
  margin: object;
  storeKey: string;
  openKey: string;
}) => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const appendRef = useRef({});
  const [auctionEnrollCode, mode] = useSearchParamHook([
    "auctionEnrollCode",
    "mode",
  ]);
  const [loading, setLoading] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  useEffect(() => {
    (async () => {
      if (auctionEnrollCode) {
        setLoading(true);
        const data = await getIo(
          "/web/eq/eqAuctionEnroll/readEqAuctionEnroll.json",
          { auctionEnrollCode },
        );
        setModuleStore({
          [storeKey]: get(data, "dataObj.eqAuctionGoodsDomainList", []),
        });
        appendRef.current = {
          ...data.dataObj,
          auctionEnrollType: 1,
          dataState: 0,
        };
        setInitialValue(data.dataObj);
        setLoading(false);
      }
    })();
  }, []);

  const buttonText = useMemo(() => {
    if (mode === "preview") {
      return "";
    }
    if (mode === "editor") {
      return "编辑询价单";
    }
    if (mode === "add") {
      return "创建询价单";
    }
  }, [mode]);

  const submit: submitFunType = async (value, suc, error) => {
    if (auctionEnrollCode) {
      return update(value, suc, error);
    }
    try {
      const { msg } = await post(
        "/web/eq/eqAuctionEnroll/createEqAuctionEnroll.json",
        { eqAuctionEnrollStr: JSON.stringify(value) },
      );
      message.success(msg);
      suc();
      navigate(-1);
    } catch (err) {
      error(err);
    }
  };

  const update: submitFunType = async (value, suc, error) => {
    try {
      const { msg } = await post(
        "/web/eq/eqAuctionEnroll/updateEqAuctionEnroll.json",
        {
          eqAuctionEnrollStr: JSON.stringify({
            ...appendRef.current,
            ...value,
            auctionEnrollCode,
          }),
        },
      );
      message.success(msg);
      suc();
      navigate(-1);
    } catch (err) {
      error(err);
    }
  };

  if (auctionEnrollCode && isEmpty(initialValue)) {
    return null;
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.wrap} style={{ ...padding, ...margin }}>
        <DynamicForm
          disabled={mode === "preview"}
          initialValues={initialValue}
          name={"addInquiryForm"}
          transformSubmitDataConfig={transformSubmitDataConfig}
          onSubmit={submit}
          fields={formConfig(storeKey, openKey)}
          saveText={buttonText}
          otherAction={
            mode === "preview"
              ? [
                  {
                    key: "fanhui",
                    name: "返回",
                    disabled: false,
                    callback: () => {
                      navigate(-1);
                    },
                    isNeedValidate: false,
                  },
                ]
              : []
          }
        />
      </div>
    </Spin>
  );
};

export const AddInquiryComponent = HOCCodeWrapComponent(Custom);
