import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useEffect, useMemo, useState } from "react";
import { post } from "@brushes/request";
import { get } from "lodash";
import { Empty, Tabs, Timeline } from "antd";

const Express = () => {
  const contractBillcode = useModuleContext(
    (s) => s.moduleStore.contractBillcode,
  );
  const [tab, setTab] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (!contractBillcode) {
          return;
        }
        const data = await post("/web/sg/sendgoods/querySendgoodsPage.json", {
          contractBillcode,
        });
        const list = get(data, "list", []);
        const requests = list.map((ccitem) => {
          const expressType = get(
            ccitem,
            "sgSendgoodsLogDomainList[0].expressCode",
            "",
          );
          const expressNo = get(
            ccitem,
            "sgSendgoodsLogDomainList[0].packageBillno",
            "",
          );
          return post("/web/wl/exporg/queryExpressInfo.json", {
            expressType: expressType,
            expressNo: expressNo,
            phone: ccitem.goodsReceiptPhone,
          });
        });
        const res = await Promise.all(requests);
        setTab(res.map((r) => JSON.parse(r.dataObj)));
      } catch (e) {}
    })();
  }, []);

  const items = useMemo(() => {
    return tab.map((item, index) => {
      return {
        key: index,
        label: `物流信息${index + 1}`,
        children: Array.isArray(item.data) ? (
          <Timeline
            mode="left"
            items={item.data.map((item) => ({
              label: item.time,
              children: item.context,
            }))}
          />
        ) : (
          <Empty description={item.message} />
        ),
      };
    });
  }, [tab]);

  return <Tabs defaultActiveKey="1" items={items} />;
};

export const ExpressComponent = HOCCodeWrapComponent(Express);
