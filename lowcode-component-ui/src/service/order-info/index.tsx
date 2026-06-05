import { Container, Element, useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Text } from "../../basic";
import {
  useOrderGood,
  useOrderInfo,
  useSearchParamHook,
} from "@brushes/component-store-web";
import { fixPrice } from "@brushes/component-tool";
import { useEffect, useMemo } from "react";
import { NumberComponent, URComponent } from "../../service";

const OrderInfo = ({
  storeKey,
  padding,
  margin,
  contractType = "06",
  ...props
}: {
  contractType: string;
  storeKey: string;
  padding: object;
  margin: object;
}) => {
  useOrderGood(storeKey);
  const [goodsType] = useSearchParamHook(["goodsType"]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  // const [payMoney, setPayMoney] = useState(0)
  const isOnlyFreight = useMemo(() => {
    return contractType.split(",").includes(goodsType || "");
  }, [goodsType, contractType]);

  const {
    couponMoney,
    shoppingCountPrice,
    creditType,
    creditMoney,
    totalMoney,
    comDisMoney,
    goodsCamount,
    rebMoney,
    freightValue,
    ur,
    points,
  } = useOrderInfo();

  useEffect(() => {
    if (isOnlyFreight) {
      // setPayMoney(freightValue);
      setModuleStore({
        _freight: freightValue,
        _payMoney: freightValue,
      });
    } else {
      const sum =
        shoppingCountPrice -
        creditMoney -
        couponMoney +
        freightValue -
        ur -
        points;
      const result = sum > 0 ? sum : 0;
      // setPayMoney(result);
      setModuleStore({
        _freight: freightValue,
        _payMoney: result,
        _rebMoney: rebMoney,
      });
    }
  }, [
    shoppingCountPrice,
    creditMoney,
    couponMoney,
    freightValue,
    ur,
    points,
    rebMoney,
  ]);

  return (
    <div style={{ ...padding, ...margin, ...props }}>
      <Container
        alignItems={"center"}
        margin={{ marginBottom: 10 }}
        justifyContent={"flex-end"}
        flexDirection={"row"}
      >
        <Text color={"#666"} fontSize={14} text={"商品总件数："}></Text>
        <Text
          text={goodsCamount}
          textAlign={"right"}
          width={120}
          color={"#f00"}
        ></Text>
      </Container>
      <Container
        alignItems={"center"}
        margin={{ marginBottom: 10 }}
        justifyContent={"flex-end"}
        flexDirection={"row"}
      >
        <Text color={"#666"} fontSize={14} text={"商品总金额："}></Text>
        <Text
          text={fixPrice(totalMoney)}
          textAlign={"right"}
          width={120}
          color={"#f00"}
          code={"totalNum"}
        ></Text>
      </Container>
      {!isOnlyFreight && (
        <Container
          alignItems={"center"}
          margin={{ marginBottom: 10 }}
          justifyContent={"flex-end"}
          flexDirection={"row"}
        >
          <Text color={"#666"} fontSize={14} text={"优惠金额："}></Text>
          <Text
            text={fixPrice(comDisMoney + couponMoney, "-")}
            textAlign={"right"}
            width={120}
            color={"#f00"}
          ></Text>
        </Container>
      )}
      {creditType ? (
        <Container
          alignItems={"center"}
          margin={{ marginBottom: 10 }}
          justifyContent={"flex-end"}
          flexDirection={"row"}
        >
          <Text color={"#666"} fontSize={14} text={"授信付款："}></Text>
          <Text
            text={fixPrice(creditMoney, "-")}
            textAlign={"right"}
            width={120}
            color={"#f00"}
          ></Text>
        </Container>
      ) : null}
      <Element is={Container} id={"REB"} canvas>
        <Container
          canvas
          alignItems={"center"}
          margin={{ marginBottom: 10 }}
          justifyContent={"flex-end"}
          flexDirection={"row"}
        >
          <Text canvas color={"#666"} fontSize={14} text={"返利金额："}></Text>
          <Element width={120} is={Container} canvas id={"ur-money"}>
            <NumberComponent
              color={"#f00"}
              fontSize={14}
              textAlign={"right"}
              prefix={"-"}
              storeKey={"_rebMoney"}
            />
          </Element>
        </Container>
      </Element>
      <Element is={Container} id={"UR"} canvas>
        <Container
          canvas
          alignItems={"center"}
          margin={{ marginBottom: 10 }}
          justifyContent={"flex-end"}
          flexDirection={"row"}
        >
          <Text
            canvas
            color={"#666"}
            fontSize={14}
            text={"会员权益优惠："}
          ></Text>
          <Element width={120} is={Container} canvas id={"ur-money"}>
            <URComponent />
          </Element>
        </Container>
      </Element>
      <Element
        canvas
        id={"freight"}
        is={Container}
        alignItems={"center"}
        margin={{ marginBottom: 10 }}
        justifyContent={"flex-end"}
        flexDirection={"row"}
      >
        <Container
          alignItems={"center"}
          margin={{ marginBottom: 10 }}
          justifyContent={"flex-end"}
          flexDirection={"row"}
        >
          <Text color={"#666"} fontSize={14} text={"运费："}></Text>
          <Element width={120} is={Container} canvas id={"freight-money"}>
            <NumberComponent
              fontSize={14}
              storeKey={"_freight"}
              textAlign={"right"}
              width={120}
              color={"#f00"}
            ></NumberComponent>
          </Element>
        </Container>
      </Element>
      <Element
        canvas
        id={"pay"}
        is={Container}
        alignItems={"center"}
        margin={{ marginBottom: 10 }}
        justifyContent={"flex-end"}
        flexDirection={"row"}
      >
        <Text color={"#666"} fontSize={14} text={"应付总额："}></Text>
        <Element width={120} is={Container} canvas id={"ur-money"}>
          <NumberComponent
            fontSize={14}
            storeKey={"_payMoney"}
            textAlign={"right"}
            width={120}
            color={"#f00"}
          ></NumberComponent>
        </Element>
      </Element>
      <Element
        canvas
        is={Container}
        id={"account-info-tips1"}
        margin={{ marginBottom: 10 }}
        justifyContent={"flex-end"}
        flexDirection={"row"}
      >
        <Text
          fontSize={12}
          color={"#999"}
          text={
            "(使用优惠后，商品优惠后单价之和可能与总价产生尾差，结算金额以付款时最终总价为准。)"
          }
        ></Text>
      </Element>
    </div>
  );
};

export const OrderInfoComponent = HOCCodeWrapComponent(OrderInfo);
