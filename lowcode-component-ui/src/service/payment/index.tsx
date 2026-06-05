import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { dynamicFormFields } from "@brushes/form";
import {Button, Form, FormInstance} from "antd";
import { useComponentListData } from "@brushes/component-store-web";
import {useMemo, useRef} from "react";

const PaymentService = ({
  padding,
  margin,
  formItemCode,
  dataPath = "",
  optionsName,
  optionsKey,
  storeKey,
  type = 'radioGroup',
  ...restProps
}: {
  type: string;
  dataPath?: string;
  formItemCode: string;
  optionsName: string;
  optionsKey: string;
  storeKey: string;
  padding: object;
  margin: object;
}) => {
  const form = Form.useFormInstance();
  const options = useComponentListData(dataPath, storeKey);
  const checkValue = useRef(null);

  return (
    <div style={{ ...padding, ...margin, ...restProps }}>
      {dynamicFormFields(
        [
          type === 'radioGroup' ? {
            name: formItemCode,
            label: "支付方式",
            type,
            rules: [{ required: true }],
            extraProps: {
              options,
              fieldNames: {
                label: optionsName,
                value: optionsKey
              },
              // optionsName,
              // optionsKey,
            },
          } : {
            name: formItemCode,
            label: "",
            type: "slot",
            extraProps: {
              render() {
                const computedOptions = options.map(item => {
                  return {
                    label: ["01", "02"].includes(item.fchannelCode) ? `${item[optionsName]}(余额: ${item.faccountAmount})` : item[optionsName],
                    value: item[optionsKey],
                  }
                })
                const singleChange = (e) => {
                  checkValue.current = e.target.value;
                }

                return (
                    <div style={{display: 'flex'}}>
                      { dynamicFormFields(
                        [{
                          name: formItemCode,
                          label: "支付方式",
                          type,
                          rules: [{ required: true }],
                          extraProps: {
                            onChange(value) {
                              const v =  value.filter(item => ['01', '02', checkValue.current].includes(item))
                              form.setFieldValue(formItemCode, v)
                            },
                            options: computedOptions.map(item => ({
                              ...item,
                              onChange: singleChange
                            })),
                          },
                        }], form)
                      }
                    </div>
                )
              },
            },
          },
          {
            name: "paywd",
            label: "支付密码",
            type: "opt",
            rules: [{ required: true }],
            extraProps: {
              mask: "*",
              dependencies: ["fchannelCode"],
            },
            calIsVisible: (form: FormInstance) => {
              return (form?.getFieldValue("fchannelCode") || []).some(item => ["01", "02"].includes(item))
            },
          },
          {
            name: "contractEcurl",
            label: "附件上传",
            type: "upload",
            rules: [{ required: true }],
            extraProps: {
              text: "",
              accept: '.jpg,.jpeg,.png,.pdf',
              listType: "picture-card",
              dependencies: ["contractPmode"],
              suffixicon: "只能上传jpg/png/pdf文件，且不超过5mb",
            },
            calIsVisible: (form: FormInstance) =>
              form?.getFieldValue("contractPmode") === "1",
          },
        ],
        form,
      )}
    </div>
  );
};

export const PaymentServiceComponent = HOCCodeWrapComponent(PaymentService);
