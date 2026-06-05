import { useEffect, useState } from "react";
import { DynamicForm, submitFunType } from "@brushes/form";
import { orderItemConfig, transformSubmitDataConfig } from "./config";
import { post } from "@brushes/request";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { message } from "antd";
import { useOrderNum } from "@brushes/component-store-web";
import { useModuleContext } from "@brushes/component-core";

const RefundJsx = ({
  openKey,
  callbackName,
}: {
  openKey: string;
  callbackName: string;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [res, setRes] = useState({});
  const contractBillcode = useModuleContext(
    (s) => s.moduleStore.contractBillcode,
  );
  const dataState = useModuleContext((s) => s.moduleStore.dataState);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const retry = useModuleContext((s) => s.moduleStore[callbackName]);
  const { getOrderBadge } = useOrderNum();
  useEffect(() => {
    if (contractBillcode) {
      init(contractBillcode);
    }
  }, [contractBillcode]);

  const init = async (contractBillcode: string, flag: boolean) => {
    setLoading(true);
    const data = await post("/web/oc/contract/getContractByCode.json", {
      contractBillcode,
    });
    const { goodsList } = data;
    data.ocRefundGoodsBeanList = goodsList.map((item: any) => {
      return {
        ...item,
        contractGoodsArefnum: item.contractGoodsArefnum || 0,
        refundGoodsNum: item.goodsCamount - item.contractGoodsArefnum,
      };
    });
    setRes(data);
    setLoading(false);
  };

  const onSubmit: submitFunType = async (value, suc, error) => {
    try {
      let goodsNum = 0;
      value.ocRefundGoodsBeanList = value.ocRefundGoodsBeanList.map(
        (item: any) => {
          goodsNum += item.goodsCamount;
          return item;
        },
      );
      const { msg } = await post("/web/oc/refund/saveRefundForPlat.json", {
        params: JSON.stringify({
          goodsNum,
          contractBillcode,
          ...value,
        }),
      });
      message.success(msg);
      suc();
      setTimeout(() => {
        setModuleStore({
          [openKey]: false,
        });
        retry();
        getOrderBadge();
      }, 200);
    } catch (err) {
      error(err);
    }
  };

  if (loading) {
    return null;
  }
  return (
    <DynamicForm
      transformSubmitDataConfig={transformSubmitDataConfig}
      layout={"vertical"}
      initialValues={res}
      onSubmit={onSubmit}
      saveText={"保存"}
      fields={orderItemConfig(dataState)}
    />
  );
};

export const RefundComponent = HOCCodeWrapComponent(RefundJsx);
