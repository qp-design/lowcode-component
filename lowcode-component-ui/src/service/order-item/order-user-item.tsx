import { useComponentListData } from "@brushes/component-store-web";
import { Fragment, useEffect, useRef } from "react";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import {
  Container,
  Element,
  ModuleProvider,
  useModuleContext,
} from "@brushes/component-core";
import { Text } from "../../basic";
import { CardLRComponent } from "../../service";
import { createStyles } from "antd-style";
import { Empty } from "antd";
import { get } from "lodash";
import { ButtonList } from "../../operate";

const ShoppGoodItem2 = () => {
  return (
    <Element
      alignItems={"center"}
      flexDirection={"row"}
      canvas
      is={Container}
      id={"canvas_container"}
    >
      <Element
        width={300}
        alignItems={"center"}
        padding={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
          paddingTop: 5,
        }}
        canvas
        id="card-larc"
        is={Container}
      >
        <CardLRComponent height={100} />
      </Element>

      <Element
        canvas
        width={100}
        id={"price-title"}
        alignItems={"center"}
        justifyContent={"center"}
        is={Container}
        flexDirection={"row"}
      >
        <Text text={"￥"} color={"#f00"} fontSize={12} />
        <Text
          text={"￥"}
          color={"#f00"}
          fontSize={14}
          fontWeight={500}
          code={"pricesetNprice"}
        />
        <Text color={"#666"} fontWeight={500} text={" / "} />
        <Text
          text={"￥"}
          color={"#666"}
          fontWeight={500}
          code={"partsnameWeightunit"}
        />
      </Element>
    </Element>
  );
};

const useStyles = createStyles(({ token, css }) => {
  return {
    wrap: css`
      padding: 5px 0;
      .right-content {
        display: grid;
        font-size: 12px;
        align-items: center;
        grid-template-columns: repeat(4, 1fr);
        width: 760px;
        text-align: center;

        .padding-5 {
          padding-bottom: 5px;
        }

        .action {
          display: flex;
          flex-direction: column;

          button {
            font-size: 12px;
          }
        }
      }
    `,
  };
});

export const OldItemInfo = ({ record }: { record: any }) => {
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  useEffect(() => {
    setModuleStore({
      _skuInfo: record,
    });
  }, [record]);

  return (
    <>
      <div className={"right-content"}>
        <Element
          justifyContent="center"
          flexDirection={"rows"}
          id={"dataBmoney"}
          canvas
          is={Container}
        >
          <Text fontSize={14} storeKey={"_skuInfo"} code={"dataBmoney"}></Text>
        </Element>
        <Element
          justifyContent="center"
          flexDirection={"column"}
          id={"contractType_1"}
          canvas
          is={Container}
        >
          <Element
            justifyContent="center"
            flexDirection={"rows"}
            id={"contractType"}
            canvas
            is={Container}
          >
            <Text className={"padding-5"} text={"订单类型："}></Text>
            <Text
              storeKey={"_skuInfo"}
              text={"--"}
              transformData={"dataType"}
              localScheme={[
                { label: "普通订单", value: "00" },
                { label: "积分订单", value: "06" },
                { label: "秒杀订单", value: "26" },
                { label: "询报价订单", value: "36" },
              ]}
              code={"contractType"}
            ></Text>
          </Element>
          <Element
            justifyContent="center"
            flexDirection={"rows"}
            id={"contractPmode"}
            canvas
            is={Container}
          >
            <Text text={"付款类型："}></Text>
            <Text
              storeKey={"_skuInfo"}
              text={"--"}
              transformData={"dataType"}
              localScheme={[
                { label: "在线支付", value: "0" },
                { label: "货到付款", value: "3" },
                { label: "线下支付", value: "1" },
              ]}
              code={"contractPmode"}
            ></Text>
          </Element>
        </Element>
        <Element
          justifyContent="center"
          flexDirection={"row"}
          id={"dataState_123"}
          canvas
          is={Container}
        >
          <Text
            storeKey={"_skuInfo"}
            text={"--"}
            transformData={"dataType"}
            localScheme={[
              { label: "待付款", value: "1,19" },
              { label: "待发货", value: "2" },
              { label: "待收货", value: "3" },
              { label: "已完成", value: "5" },
              { label: "已取消", value: "-1" },
            ]}
            code={"dataState"}
          ></Text>
        </Element>
        <div>
          <Element is={Container} canvas id="operate-ids">
            <ButtonList
              buttonList={[
                {
                  name: "查看",
                  type: "link",
                  fontSize: 12,
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
                {
                  name: "立即支付",
                  type: "link",
                  fontSize: 12,
                  dataState: "1",
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
                {
                  name: "取消",
                  api: "/web/oc/contract/cancelContractC.json",
                  type: "render",
                  paramKey: "contractId",
                  storeKey: "_skuInfo",
                  callbackName: "orderQueryRetry",
                  value: "contractId",
                  fontSize: 12,
                  dataState: "0,30,1,19",
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
                {
                  name: "查看物流",
                  type: "link",
                  fontSize: 12,
                  dataState: "3",
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
                {
                  name: "确认收货",
                  api: "/web/oc/contract/confirmReceive.json",
                  type: "render",
                  paramKey: "contractBillcode",
                  storeKey: "_skuInfo",
                  callbackName: "orderQueryRetry",
                  value: "contractBillcode",
                  fontSize: 12,
                  dataState: "3",
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
                {
                  name: "申请退单",
                  type: "link",
                  fontSize: 12,
                  dataState: "2,3",
                  padding: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingTop: 0,
                  },
                },
              ]}
            />
          </Element>
        </div>
      </div>
    </>
  );
};

export const ShopItemGoodInnerJsx = ({ dataPath, item }: any) => {
  const list = get(item, dataPath, []);
  return (
    <>
      {(list || []).map((item, index) => {
        return (
          <Fragment key={index}>
            <ModuleProvider moduleStore={{ _skuInfo: item }}>
              <ShoppGoodItem2 />
            </ModuleProvider>
          </Fragment>
        );
      })}
    </>
  );
};

export const OrderTitle = ({ item }: any) => {
  return (
    <ModuleProvider moduleStore={{ _skuInfo: item }}>
      <Element
        flexDirection={"row"}
        is={Container}
        canvas
        id={"item-contractBillcode"}
      >
        <Text fontSize={12} text={"订单号："}></Text>
        <Text module={"moduleStore"} code={"contractBillcode"}></Text>
      </Element>
      <Element
        justifyContent="flex-end"
        flexDirection={"row"}
        is={Container}
        canvas
        id={"shop-item-good-code"}
      >
        <Text fontSize={12} text={"下单时间："}></Text>
        <Text
          transformData={"time"}
          format={"YYYY-MM-DD HH:mm:ss"}
          module={"moduleStore"}
          code={"contractPaydate"}
        ></Text>
      </Element>
    </ModuleProvider>
  );
};

const ShoppItemGood = ({
  callbackName,
  description,
  dataPath,
  storeKey,
  padding,
  margin,
  borderRadius,
}: any) => {
  const list = useComponentListData(dataPath, storeKey);
  const { styles } = useStyles();
  const retry = useModuleContext((s) => s.moduleStore[callbackName]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  if (!list.length) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 30,
          ...margin,
        }}
      >
        <Empty description={description} />
      </div>
    );
  }
  return (
    <div className={styles.wrap}>
      {list.map((item, index) => {
        return (
          <Fragment key={item.contractBillcode}>
            <div
              style={{
                padding: "5px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <OrderTitle item={item} />
            </div>
            <div
              className={"item-wrap"}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                ...margin,
                ...padding,
                borderRadius,
              }}
            >
              <div style={{ width: 400 }}>
                <ShopItemGoodInnerJsx dataPath={"goodsList"} item={item} />
              </div>
              <ModuleProvider
                moduleStore={{
                  [callbackName]: retry,
                  setParentStore: setModuleStore,
                }}
              >
                <OldItemInfo record={item} />
              </ModuleProvider>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export const OrderItemGood = HOCCodeWrapComponent(ShoppItemGood);

{
  /*<Element*/
}
{
  /*    canvas*/
}
{
  /*    id={'shop-item-good'}*/
}
{
  /*    is={Container}*/
}
{
  /*    flexDirection={'row'}*/
}
{
  /*    justifyContent={'space-between'}*/
}
{
  /*    padding={{paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5}}*/
}
{
  /*    alignItems={'center'}*/
}
{
  /*>*/
}
{
  /*    <Element is={Container} canvas id={'shop-item-good-type'}>*/
}
{
  /*        <Element flexDirection={'row'} is={Container} canvas id={'shop-item-good-code'}>*/
}
{
  /*            <Text text={'订单类型：'}></Text>*/
}
{
  /*            <Text code={'contractBillcode'}></Text>*/
}
{
  /*        </Element>*/
}
{
  /*        <Element flexDirection={'row'} is={Container} canvas id={'shop-item-good-code'}>*/
}
{
  /*            <Text text={'付款类型：'}></Text>*/
}
{
  /*            <Text code={'contractBillcode'}></Text>*/
}
{
  /*        </Element>*/
}
{
  /*    </Element>*/
}
{
  /*    <Element justifyContent={'center'} is={Container} canvas id={'shop-item-good-type'}>*/
}
{
  /*        <Text code={'contractBillcode'}></Text>*/
}
{
  /*    </Element>*/
}
{
  /*    <Element justifyContent={'center'} is={Container} canvas id={'shop-item-good-code'}>*/
}

{
  /*    </Element>*/
}
{
  /*</Element>*/
}
