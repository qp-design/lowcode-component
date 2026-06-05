import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Checkbox, Form } from "antd";
import { useEffect, useState } from "react";
import { post } from "@brushes/request";
import { useEditor } from "@brushes/component-core";
import { get } from "lodash";
import { useModuleContext } from "@brushes/component-core";

const Finance = ({
  padding,
  margin,
  dataPath = "",
  ...restProps
}: {
  dataPath?: string;
  padding: object;
  margin: object;
}) => {
  const form = Form.useFormInstance();
  const { isEnabled } = useEditor((state) => ({
    isEnabled: state.options.enabled,
  }));
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  const contractPmode = Form.useWatch("contractPmode", form);

  const [financeInfo, setFinanceInfo] = useState(10);
  useEffect(() => {
    (async () => {
      try {
        const data = await post(
          "/web/um/userDealer/queryDealerFinanceQualification.json",
        );
        const result = get(data, "dataObj.leftCredit", 0);
        setFinanceInfo(result);
      } catch (err) {}
    })();
  }, []);

  return (
    <>
      {(financeInfo && contractPmode === "0") || isEnabled ? (
        <div style={{ ...padding, ...margin, ...restProps }}>
          <Form.Item name="finance" valuePropName="checked" label={null}>
            <Checkbox
              onChange={(e) => {
                const target = e.target.checked;
                setModuleStore({ finance: target ? "true" : "" });
              }}
            >
              融资支付
            </Checkbox>
          </Form.Item>
        </div>
      ) : null}
    </>
  );
};

export const FinanceComponent = HOCCodeWrapComponent(Finance);
