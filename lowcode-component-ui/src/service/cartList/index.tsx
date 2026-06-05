import classNames from "classnames";
import { Container, useModuleContext, Element } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { debounce } from "lodash";
import { post } from "@brushes/request";
import { useStyles2, useStyles } from "./style";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Checkbox, InputNumber, message, Popconfirm, Spin } from "antd";
import { Fragment, useMemo, useRef, useState } from "react";
import { fixPrice } from "@brushes/component-tool";
import { ButtonComponent, Text } from "../../basic";
import {
  useComponentListData,
  useGetCarNum, useSearchParamHook,
} from "@brushes/component-store-web";
import { CartPromotionComponent } from "../../service";
import { useNavigate } from "react-router-dom";

const config = ["商品信息", "单价", "数量", "小计", "操作"];

const GooodTypeInfo = ({ dataState }: { dataState: string | number }) => {
  console.log(85, dataState);
  switch (+dataState) {
    case 3:
      return <div className={"state-info"}>商品已失效</div>;
    case 1:
      return <div className={"state-info"}>商品库存不足</div>;
    case 2:
      return <div className={"state-info"}>商品已下架</div>;
    default:
      return "";
  }
};

const ShoppGoodItem = ({
  item,
  callbackName,
}: {
  item: any;
  callbackName: string;
}) => {
  const { styles } = useStyles2();
  const [loading, setLoading] = useState(false);
  const retry = useModuleContext((s) => s.moduleStore[callbackName]);

  const updateSelect = debounce(async (e: any) => {
    try {
      setLoading(true);
      const { msg } = await post(
        "/web/oc/shopping/updateShoppingGoodsCheckState.json",
        {
          shoppingGoodsIdStr: item.shoppingGoodsId,
          shoppingCode: item.shoppingCode,
          checkState: e.target.checked ? 0 : 1,
        },
      );
      message.success(msg);
      retry();
      setLoading(false);
    } catch (err) {
      message.error(err);
      setLoading(false);
    }
  }, 500);

  const updateNum = debounce(async (e: number) => {
    setLoading(true);
    const { msg } = await post("/web/oc/shopping/updateShoppingGoodsNum.json", {
      shoppingGoodsId: item.shoppingGoodsId,
      amount: e,
      goodWeight: 0,
    });
    message.success(msg);
    retry();
    setLoading(false);
  }, 500);

  const deleteImpl = debounce(async () => {
    setLoading(true);
    const { msg } = await post("/web/oc/shopping/deleteShoppingGoods.json", {
      shoppingGoodsId: item.shoppingGoodsId,
    });
    message.success(msg);
    retry();
    setLoading(false);
  }, 500);

  return (
    <Spin spinning={loading}>
      <div className={styles.wrap}>
        <div className={"large"}>
          <div className={"checkbox-item"}>
            <Checkbox
              disabled={item.dataState !== 0}
              checked={!item.shoppingGoodsCheck && item.dataState === 0}
              onChange={updateSelect}
            ></Checkbox>
          </div>
          <div className="img-border">
            <img src={item.dataPic} width={80} height={80} />
            <GooodTypeInfo dataState={item.dataState} />
          </div>
          <div className="content">
            <div className="title">{item.goodsName}</div>
            <p>条码：{item.skuBarcode}</p>
          </div>
        </div>
        <div style={{ color: "#f00", fontFamily: "QJHEITI" }}>
          <span style={{ fontSize: 12 }}>￥</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {item.pricesetNprice}
          </span>
          <span style={{ color: "#666" }}> / {item.partsnameWeightunit}</span>
        </div>
        <div style={{ fontFamily: "QJHEITI" }}>
          <InputNumber onChange={updateNum} value={item.goodsCamount} />
        </div>
        <div style={{ fontFamily: "QJHEITI" }}>
          <span style={{ fontSize: 12 }}>￥</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {fixPrice(item.pricesetNprice * item.goodsCamount)}
          </span>
        </div>
        <div>
          <Popconfirm
            title="删除"
            onConfirm={deleteImpl}
            description="确定删除所选商品?"
          >
            <Button
              size={"large"}
              danger
              type={"link"}
              icon={<DeleteOutlined />}
            ></Button>
          </Popconfirm>
        </div>
      </div>
    </Spin>
  );
};

const ShoppGood = ({ shoppingGoodsList, callbackName }: any) => {
  return (
    <>
      {shoppingGoodsList.map((item, index) => {
        return (
          <ShoppGoodItem callbackName={callbackName} item={item} key={index} />
        );
      })}
    </>
  );
};

const CartCommon = ({ callbackName, dataPath, storeKey }: any) => {
  const list = useComponentListData(dataPath, storeKey);
  return (
    <>
      {list.map((item) => (
        <div key={item.channelCode}>
          <div className={"memberBname"}>111{item.memberCname}</div>
          <>
            {item.shoppingpackageList.map((c: any, index: number) => (
              <Fragment key={index}>
                {c.promotionName && (
                  <CartPromotionComponent
                    disNextMsg={c.disNextMsg}
                    pbName={c.pbName}
                    shoppingCode={c.shoppingCode}
                    promotionCode={c.promotionCode}
                    pbCode={c.pbCode}
                    promotionName={c.promotionName}
                  ></CartPromotionComponent>
                )}
                <ShoppGood
                  callbackName={callbackName}
                  shoppingGoodsList={c.shoppingGoodsList}
                />
              </Fragment>
            ))}
          </>
        </div>
      ))}
    </>
  );
};

export const NoNeedCartCommon = HOCCodeWrapComponent(CartCommon);

const CartFooter = ({
  storeKey,
  dataPath,
  callbackName,
}: {
  storeKey: string;
  dataPath: string;
  callbackName: string;
}) => {
  const navigator = useNavigate();
  const [memberBcode] = useSearchParamHook(['memberBcode']);
  const { getGoodsList } = useGetCarNum();
  const list = useComponentListData(dataPath, storeKey);
  const orderIds = useRef([]);
  const selectIds = useRef([]);
  const retry = useModuleContext((s) => s.moduleStore[callbackName]);
  const { styles } = useStyles2();
  const isAllChecked = useRef(false);
  const [loading, setLoading] = useState(false);
  const totalInfo = useMemo(() => {
    let money = 0;
    let num = 0;
    let disMoney = 0;
    let attrs: any[] = [];
    orderIds.current = [];
    selectIds.current = [];
    isAllChecked.current = true;
    list.forEach((item) => {
      item.shoppingpackageList.forEach((c) => {
        if (!attrs.includes(c.promotionCode)) {
          disMoney += c.disMoney || 0;
          attrs.push(c.promotionCode);
        }
        c.shoppingGoodsList.forEach((citem) => {
          if (+citem.dataState === 0) {
            orderIds.current.push(citem.shoppingGoodsId);
            if (citem.shoppingGoodsCheck === 0) {
              selectIds.current.push(citem.shoppingGoodsId);
              money += citem.goodsCamount * citem.pricesetNprice;
              num += citem.goodsCamount;
            }
            if (citem.shoppingGoodsCheck === 1) {
              isAllChecked.current = false;
            }
          }
        });
      });
    });

    return {
      totalMoney: money,
      totalNum: num,
      disMoney,
    };
  }, [list]);
  const updateSelect = debounce(async (e: any) => {
    try {
      setLoading(true);
      const { msg } = await post(
        "/web/oc/shopping/updateShoppingGoodsCheckState.json",
        {
          shoppingGoodsIdStr: orderIds.current.join(","),
          checkState: e.target.checked ? 0 : 1,
        },
      );
      message.success(msg);
      retry();
      setLoading(false);
    } catch (err) {
      message.error(err);
      setLoading(false);
    }
  }, 500);

  const deleteImpl = debounce(async () => {
    if (selectIds.current.length === 0) {
      message.info("选择需要删除的商品");
      return;
    }
    setLoading(true);

    const { msg } = await post("/web/oc/shopping/deleteShoppingGoods.json", {
      shoppingGoodsId: selectIds.current.join(","),
    });
    message.success(msg);
    getGoodsList();
    retry();
    setLoading(false);
  }, 500);

  const add = async () => {
    try {
      if (selectIds.current.length === 0) {
        message.info("请选择商品");
        return;
      }
      await post("/web/oc/shopping/checkShoppingToContractSalequota.json", {
        shoppingGoodsIdStr: JSON.stringify(selectIds.current)
      })
      if(memberBcode) {
        navigator(`/businessAccount?menuName=确认订单&memberBcode=${memberBcode}&shoppingGoodsIdStr=[${selectIds.current.join(",")}]`);
      } else {
        navigator(`/account?shoppingGoodsIdStr=[${selectIds.current.join(",")}]`);
      }
    } catch (error) {

    }
  };
  if (list.length === 0) {
    return null;
  }
  return (
    <Spin spinning={loading}>
      <div className={styles.wrap} style={{ marginBottom: 0 }}>
        <div className={"large"}>
          <div>
            <Checkbox
              checked={isAllChecked.current}
              onChange={updateSelect}
            ></Checkbox>
          </div>
          <div>全选</div>
          <Popconfirm
            title="删除"
            onConfirm={deleteImpl}
            description="确定删除所选商品?"
          >
            <div style={{ cursor: "pointer" }}>删除选择的商品</div>
          </Popconfirm>
        </div>
        <div style={{ color: "#f00", fontFamily: "QJHEITI" }}>
          <span style={{ fontSize: 12 }}>已选 </span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {totalInfo.totalNum}
          </span>
          <span style={{ fontSize: 12 }}> 件商品</span>
        </div>
        <div style={{ fontFamily: "QJHEITI" }}>
          <span style={{ fontSize: 12 }}>优惠金额 </span>
          <span style={{ fontSize: 12, color: "#f00" }}>￥</span>
          <span
            style={{
              fontSize: 14,
              color: "#f00",
              fontFamily: "QJHEITI",
              fontWeight: 500,
            }}
          >
            {fixPrice(totalInfo.disMoney)}
          </span>
        </div>
        <div style={{ fontFamily: "QJHEITI" }}>
          <span style={{ fontSize: 12 }}>合计(不含运费)</span>
          <span style={{ fontSize: 12, color: "#f00" }}>￥</span>
          <span
            style={{
              fontSize: 14,
              color: "#f00",
              fontFamily: "QJHEITI",
              fontWeight: 500,
            }}
          >
            {fixPrice(
              totalInfo.totalMoney - totalInfo.disMoney > 0
                ? totalInfo.totalMoney - totalInfo.disMoney
                : 0,
            )}
          </span>
        </div>
        <div>
          <ButtonComponent
            onClick={add}
            type={"primary"}
            size={"large"}
            danger
            icon={<ShoppingCartOutlined />}
            text={"立即购买"}
          />
        </div>
      </div>
    </Spin>
  );
};

export const NoNeedCartFooter = HOCCodeWrapComponent(CartFooter);

const CartList = ({
  dataPath,
  storeKey,
  description,
  ...props
}: {
  dataPath: string;
  storeKey: string;
  description?: string;
}) => {
  const { styles } = useStyles();
  // if(list.length > 0){
  return (
    <div style={{ border: "solid 1px #efefef", borderRadius: 10 }}>
      <Element canvas is={Container} id={`cart-list`}>
        <ul className={styles.title}>
          {config.map((item, index) => (
            <Text
              color={"#1A1A1A"}
              fontSize={14}
              height={48}
              textAlign={"center"}
              lineHeight={"48px"}
              className={classNames({
                large: item === "商品信息",
              })}
              key={index}
              text={item}
            />
          ))}
        </ul>
        <Element
          is={Container}
          id={"cart-common"}
          canvas
          text={"购物车卡片放置区域"}
        ></Element>
        {/*<div className={styles.wrapContent}>*/}
        {/*<NoNeedCartCommon callbackName={'cartQueryRetry'} storeKey={storeKey} dataPath={dataPath} />*/}
        {/*</div>*/}
        <NoNeedCartFooter
          dataPath={dataPath}
          callbackName={"cartQueryRetry"}
          storeKey={storeKey}
        />
      </Element>
    </div>
  );
  // }
};

export const CartListComponent = HOCCodeWrapComponent(CartList);
