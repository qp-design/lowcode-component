import { formConfig, transformSubmitDataConfig } from "./config";
import { DynamicForm, submitFunType } from "@brushes/form";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { post } from "@brushes/request";
import { message } from "antd";
import { useMemo } from "react";
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

  const buttonText = useMemo(() => {
      return "新增出库单";
  }, []);

  const submit: submitFunType = async (value, suc, error) => {
    try {
      const { msg } = await post(
        "/web/wh/opstore/saveOpstoreStr.json",
        { whOpstoreDomainStr: JSON.stringify({
                ...value,
                storeGoodsType: 1,
                opstoreDir: 0,
                storeType: 0,
                storeGoodsBtype: 10
        }) },
      );
      message.success(msg);
      suc();
      navigate(-1);
    } catch (err) {
      error(err);
    }
  };

  return (
      <div className={styles.wrap} style={{ ...padding, ...margin }}>
        <DynamicForm
          name={"addInquiryForm"}
          transformSubmitDataConfig={transformSubmitDataConfig}
          onSubmit={submit}
          fields={formConfig(storeKey, openKey)}
          saveText={buttonText}
        />
      </div>
  );
};

export const AddDeliveryComponent = HOCCodeWrapComponent(Custom);
