import { useEffect, useState } from "react";
import { useModuleContext } from "@brushes/component-core";
import { isEmpty } from "lodash";
import { post } from "@brushes/request";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { NumberComponent } from "../number";

function UR(props: any) {
  const [value, setValue] = useState("");
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const _contractGoodsList = useModuleContext(
    (s) => s.moduleStore._contractGoodsList,
  ); //商品信息
  useEffect(() => {
    (async () => {
      if (!isEmpty(_contractGoodsList)) {
        let result: Array<any> = [];
        _contractGoodsList.forEach((item) => {
          result.push({
            packageList: [
              {
                contractGoodsList: item,
              },
            ],
          });
        });
        const data = await post(
          "/web/ur/userrights/getTotalDiscountPrice.json",
          { rsSkuListStr: JSON.stringify(result) },
        );
        setValue(data.dataObj.totalDiscountPrice);
        if (data.dataObj.totalDiscountPrice > 0) {
          setModuleStore({
            _ocDiscount: [
              {
                contractSettlBlance: "UR",
                contractSettlPmoney: data.dataObj.totalDiscountPrice,
                contractSettlOpno: data.dataObj.contractSettlOpno,
              },
            ],
          });
        }
      }
    })();
  }, [_contractGoodsList]);

  return <NumberComponent {...props} value={value} />;
}

export const URComponent = HOCCodeWrapComponent(UR);
