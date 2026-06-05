import { useEffect, useState } from "react";
import { Form, Spin } from "antd";
// import './image.css'
import { dynamicFormFields } from "@brushes/form";

export const GetVercode = () => {
  const form = Form.useFormInstance();
  const isDisabled = form.getFieldValue("isDisabled");
  const [loading, setLoading] = useState(false);
  const [verImg, setVerImg] = useState("");

  useEffect(() => {
    // const userPhone = form.getFieldValue('userPhone');
    if (isDisabled === "") {
      fetchCode();
    }
  }, [isDisabled]);

  const fetchCode = () => {
    setLoading(true);
    const { getFieldsValue } = form;
    const { loginName, userPhone } = getFieldsValue();
    const value = loginName || userPhone;
    fetch(`/web/ml/mlogin/getVerCode.img?userPhone=${value}`)
      .then((code) => {
        return code;
      })
      .then((res) => res.arrayBuffer())
      .then((res) => {
        const imgUrl =
          "data:image/png;base64," +
          window.btoa(String.fromCharCode(...new Uint8Array(res)));
        setVerImg(imgUrl);
      })
      .catch((error: any) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {dynamicFormFields(
        [
          {
            name: "verCode",
            type: "text",
            label: "图形验证码",
            style: { width: "100%" },
            rules: [{ required: true, message: "请输入" }],
            extraProps: {
              autoComplete: "off",
              placeholder: "请输入",
              addonAfter: (
                <Spin spinning={loading}>
                  {verImg ? (
                    <img
                      src={verImg}
                      onClick={fetchCode}
                      style={{ width: 90, height: 30 }}
                    />
                  ) : (
                    <div style={{ width: 90, height: 30 }}></div>
                  )}
                </Spin>
              ),
            },
          },
        ],
        form,
      )}
    </>
  );
};
