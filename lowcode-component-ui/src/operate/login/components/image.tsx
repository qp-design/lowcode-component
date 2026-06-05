import { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { dynamicFormFields } from "@brushes/form";
import { createStyles } from "antd-style";

const useStyle = createStyles(
  ({ token, css }, { height }: { height: number }) => {
    return {
      wrap: css`
        input[name="verCode"] {
          height: ${height}px;
        }
      `,
    };
  },
);
const ImageJsx = ({ height = 40 }: { height?: number }) => {
  const { styles } = useStyle({ height });
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
    const { loginName, userPhone, userinfoConPhone } = getFieldsValue();
    const value = loginName || userPhone || userinfoConPhone;
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
  console.log(37, height);
  return (
    <div className={styles.wrap}>
      {dynamicFormFields(
        [
          {
            name: "verCode",
            type: "text",
            label: "",
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
                      style={{ width: 90, height: height - 2 }}
                    />
                  ) : (
                    <div style={{ width: 90, height: height - 2 }}></div>
                  )}
                </Spin>
              ),
              style: {
                height,
              },
            },
          },
        ],
        form,
      )}
    </div>
  );
};

export default ImageJsx;
