import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { formatList, useOrderResult } from "@brushes/component-store-web";
import { ButtonComponent } from "../../basic";
import { useMemo } from "react";
import { get } from "lodash";
import { useFormImpl } from "@brushes/form";
import { Form, Modal, QRCode } from "antd";

const PayBuy = ({
  saveText,
  storeKey,
  transformSubmitDataConfig = [],
}: {
  storeKey: string;
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

  const { handlerSubmit } = useFormImpl(form, () => {}, transformDataConfig);

  const { onSubmit, loading, url, open, setOpen, title } =
    useOrderResult(storeKey);

  return (
    <>
      <Modal
        style={{ paddingTop: 45 }}
        width={205}
        onCancel={() => setOpen(false)}
        title={title.current}
        open={open}
        closeIcon={null}
        footer={null}
      >
        <QRCode value={url} />
      </Modal>
      <ButtonComponent
        width={180}
        height={46}
        text={saveText}
        onClick={handlerSubmit.bind(null, saveText, true, onSubmit)}
        // icon={<PayCircleOutlined />}
        size={"large"}
        disabled={false}
        loading={loading}
        type="primary"
      ></ButtonComponent>
    </>
  );
};

export const PayBuyComponent = HOCCodeWrapComponent(PayBuy);
