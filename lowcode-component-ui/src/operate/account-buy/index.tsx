import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { formatList, useOrderPay } from "@brushes/component-store-web";
import { ButtonComponent } from "../../basic";
import { useMemo } from "react";
import { get } from "lodash";
import { useFormImpl } from "@brushes/form";
import { Form } from "antd";

const AccountBuy = ({
  selfPickupKey = "",
  saveText,
  transformSubmitDataConfig = [],
}: {
  selfPickupKey?: string;
  saveText: string;
  transformSubmitDataConfig?: Array<{
    type: string;
    name: string;
  }>;
}) => {
  const form = Form.useFormInstance();

  const transformDataConfig = useMemo(() => {
    return transformSubmitDataConfig.map((item) => {
      const func = get(formatList, item.type, formatList["basic"]);
      return func(item.name);
    });
  }, [transformSubmitDataConfig]);

  const { handlerSubmit, inProgressStatus } = useFormImpl(form, () => {}, transformDataConfig);
  const { onSubmit, loading } = useOrderPay(selfPickupKey);

  return (
    <ButtonComponent
      width={180}
      height={46}
      text={saveText}
      onClick={handlerSubmit.bind(null, saveText, true, onSubmit)}
      // icon={<PayCircleOutlined />}
      size={"large"}
      disabled={false}
      loading={inProgressStatus[saveText] || loading}
      type="primary"
    ></ButtonComponent>
  );
};

export const AccountBuyComponent = HOCCodeWrapComponent(AccountBuy);
