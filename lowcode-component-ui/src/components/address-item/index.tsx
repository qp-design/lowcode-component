import { createStyles } from "antd-style";
import { useEffect, useMemo, useState } from "react";
import {
  Empty,
  Form,
  FormInstance,
  message,
  Popconfirm,
  Radio,
  Spin,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { Container, useModuleContext } from "@brushes/component-core";
import { Text } from "../../basic";
import { get, post } from "@brushes/request";
import { dynamicFormFields } from "@brushes/form";
import { useSearchParams } from "react-router-dom";
import {useSearchParamHook} from "@brushes/component-store-web";

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      display: grid;
      height: 40px;
      padding: 0 10px;
      border-radius: 4px;
      line-height: 40px;
      grid-template-columns: 1fr 300px;
      align-items: center;
      .operate {
        cursor: pointer;
        display: none;
      }
      &:hover {
        background: #f1f1f1;
        .operate {
          cursor: pointer;
          display: block;
        }
      }
    `,
  };
});

const ItemJsx = (item: any) => {
  return (
    <div style={{ flexGrow: 1 }}>
      {item.addressMember} {item.addressPhone} {item.provinceName}{" "}
      {item.cityName} {item.areaName} {item.addressDetail}
      {item.addressDefault === "1" && (
        <span
          style={{
            marginLeft: 10,
            fontSize: 12,
            padding: 2,
            color: "#f00",
            border: "solid 1px #f00",
            borderRadius: 4,
          }}
        >
          默认
        </span>
      )}
    </div>
  );
};

const ItemSelect = ({
  onChange,
  form,
  description,
  callbackName,
  storeKey,
  openKey,
  freight,
  ...restProps
}: {
  description?: string;
  freight: boolean;
  form: FormInstance;
  openKey: string;
  onChange: (e: any) => void;
  callbackName: string;
  storeKey: string;
}) => {
  const [memberBcode] = useSearchParamHook(['memberBcode']);
  const [loading, setLoading] = useState<boolean>(false);
  const retry = useModuleContext((s) => s.moduleStore[callbackName]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  let [searchParams] = useSearchParams();
  const addressList = useModuleContext((s) => s.moduleStore[storeKey]) || [];
  const { styles } = useStyles();

  useEffect(() => {
    const { addressId = "" } =
      (addressList || []).find((item: any) => {
        return item.addressDefault === "1";
      }) || {};

    if (addressId) {
      form.setFieldsValue({ addressId });
      // 在确认订单页面需要查询运费
      fetchFreight(addressId);
    }
  }, [addressList]);

  const deleteImpl = async (id: string) => {
    setLoading(true);
    const { msg } = await get("/web/um/address/deleteAddress.json", {
      addressId: id,
    });
    message.success(msg);
    setTimeout(async () => {
      await retry();
      setLoading(false);
    }, 500);
  };

  const updateAddress = async (id: string) => {
    setModuleStore({
      [openKey]: true,
      title: "编辑收货地址",
      formEditorId: id,
    });
  };

  const setDefaultAddress = async (code: string) => {
    setLoading(true);
    const { msg } = await get("/web/um/address/updateAddressDefault.json", {
      addressCode: code,
    });
    message.success(msg);
    setTimeout(async () => {
      await retry();
      setLoading(false);
    }, 500);
  };

  const fetchFreight = async (id: string) => {
    const item = addressList.find((item: any) => item.addressId === id) || {};
    const {
      provinceCode,
      addressMember,
      addressPhone,
      provinceName,
      cityName,
      areaName,
      addressDetail,
    } = item;

    if (
      !(
        searchParams.get("shoppingGoodsIdStr") ||
        searchParams.get("skuId") ||
        searchParams.get("skuIdStr")
      )
    ) {
      setModuleStore({
        _orderAddressInfo: {
          freight: 0,
          goodsReceiptMem: addressMember,
          goodsReceiptPhone: addressPhone,
          goodsReceiptArrdess: `${provinceName}-${cityName}-${areaName}-${addressDetail}`,
          areaCode: provinceCode,
        },
      });
      return;
    }
    setLoading(true);

    try {
      let appendParam: Record<string, any> = {};
      if (searchParams.get("shoppingGoodsIdStr")) {
        appendParam.shoppingGoodsIdStr = searchParams.get("shoppingGoodsIdStr");
      }
      if (searchParams.get("skuIdStr")) {
        appendParam.skuIdStr = searchParams.get("skuIdStr");
      }
      if (searchParams.get("skuId")) {
        appendParam.skuIdStr = JSON.stringify([
          {
            skuId: searchParams.get("skuId"),
            goodsNum: searchParams.get("goodsNum"),
          },
        ]);
      }
      const data = await post(`/web/oc/contract/calculateFreightFare.json`, {
        areaCode: provinceCode,
        ...appendParam,
      });

      setModuleStore({
        _orderAddressInfo: {
          freight: data.dataObj,
          goodsReceiptMem: addressMember,
          goodsReceiptPhone: addressPhone,
          goodsReceiptArrdess: `${provinceName}-${cityName}-${areaName}-${addressDetail}`,
          areaCode: provinceCode,
        },
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const changeImpl = async (
    e: RadioChangeEvent,
    onChange: (e: any) => void,
  ) => {
    onChange(e.target.value);
    await fetchFreight(e.target.value);
  };

  const children = useMemo(() => {
    return (
      <>
        {(addressList || []).map((item: any) => {
          return (
            <div className={styles.container} key={item.addressId}>
              {freight ? (
                <Radio value={item.addressId}>
                  <ItemJsx {...item} />
                </Radio>
              ) : (
                <ItemJsx {...item} />
              )}
              { !memberBcode && <div className={"operate"}>
                <Container
                  canvas
                  is={Container}
                  padding={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  flexDirection={"row"}
                >
                  <span
                    onClick={() => setDefaultAddress(item.addressCode)}
                    style={{
                      lineHeight: 1,
                      color: "#f00",
                      fontSize: 12,
                    }}
                  >
                    123设置默认地址
                  </span>
                  <span
                    onClick={() => updateAddress(item.addressId)}
                    style={{
                      lineHeight: 1,
                      color: "#f00",
                      fontSize: 12,
                    }}
                  >
                    修改地址
                  </span>
                  <Popconfirm
                    onConfirm={() => deleteImpl(item.addressId)}
                    title="删除"
                    description="确定要删除地址?"
                  >
                    <div>
                      <Text
                        color={"#f00"}
                        fontSize={12}
                        num={1}
                        text={"删除"}
                      />
                    </div>
                  </Popconfirm>
                  {/*</Element>*/}
                </Container>
              </div> }
            </div>
          );
        })}
      </>
    );
  }, [addressList, freight]);

  if (addressList.length === 0) {
    return <Empty description={description} />;
  }
  return (
    <Spin spinning={loading}>
      {freight ? (
        <Radio.Group
          style={{ width: "100%" }}
          {...restProps}
          onChange={(e) => changeImpl(e, onChange)}
        >
          {children}
        </Radio.Group>
      ) : (
        children
      )}
    </Spin>
  );
};
export const AddressItem = ({
  padding = {},
  freight = true,
  description,
  storeKey,
  openKey,
  callbackName,
  ...props
}: {
  padding?: object;
  callbackName: string;
  description?: string;
  storeKey: string;
  openKey: string;
  freight: boolean;
}) => {
  const form = Form.useFormInstance();

  return (
    <div
      style={{
        ...padding,
        ...props,
      }}
    >
      {dynamicFormFields(
        [
          {
            type: "slot",
            name: "addressId",
            rules: [{ required: true, message: "收货地址不能为空" }],
            value: "",
            extraProps: {
              render: ({
                onChange,
                form,
                ...restProps
              }: {
                form: FormInstance;
                onChange: (e: any) => void;
              }) => (
                <ItemSelect
                  freight={freight}
                  form={form}
                  description={description}
                  onChange={onChange}
                  storeKey={storeKey}
                  openKey={openKey}
                  callbackName={callbackName}
                  {...restProps}
                />
              ),
            },
          },
        ],
        form,
      )}
    </div>
  );
};
