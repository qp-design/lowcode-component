import { Element } from "@brushes/component-core";
import { Container, useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { DividerComponent, FormComponent, Text } from "../../basic";
import { Statistic } from "antd";
import { useMemo } from "react";

const { Timer } = Statistic;

export const TimerJsx = ({
  storeKey,
  finishKey,
  code,
  format = "D 天 H 时 m 分 s 秒",
}: {
  storeKey: string;
  finishKey?: string;
  code: string;
  format: string;
}) => {
  const store = useModuleContext((s) => s.moduleStore[storeKey]) || {};
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const value = useMemo(() => {
    if (code) {
      return +store[code];
    }
  }, [store, code]);
  const onFinish = () => {
    if (finishKey) {
      setModuleStore({
        [finishKey]: true,
      });
    }
  };
  return (
    <Timer onFinish={onFinish} type="countdown" format={format} value={value} />
  );
};

export const TimerComponent = HOCCodeWrapComponent(TimerJsx);
const PayService = () => {
  return (
    <>
      <Element
        canvas
        id="pay-service"
        is={Container}
        padding={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        flexDirection={"row"}
      >
        <Element
          canvas
          id="pay-title"
          is={Container}
          padding={{
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 5,
            paddingBottom: 5,
          }}
          flexDirection={"column"}
        >
          <Text
            fontSize={24}
            num={1}
            fontWeight={400}
            text={"您的订单已成功提交，请尽快付款"}
          />

          <Element
            canvas
            id="pay-info"
            is={Container}
            alignItems={"center"}
            padding={{
              paddingLeft: 0,
              paddingRight: 5,
              paddingTop: 5,
              paddingBottom: 5,
            }}
            flexDirection={"row"}
          >
            <Text fontSize={12} num={1} fontWeight={400} text={"订单号："} />
            <Text
              fontSize={12}
              num={1}
              fontWeight={400}
              code={"contractBillcode"}
            />
            <DividerComponent
              type={"vertical"}
              margin={{ marginLeft: 15, marginRight: 15 }}
            />
            <Text fontSize={12} num={1} fontWeight={400} text={"总金额："} />
            <Text fontSize={12} num={1} fontWeight={400} code={"contMoney"} />
            <DividerComponent
              type={"vertical"}
              margin={{ marginLeft: 15, marginRight: 15 }}
            />
            <Text fontSize={12} num={1} fontWeight={400} text={"还需支付："} />
            <Text fontSize={12} num={1} fontWeight={400} code={"orderMoney"} />
            <DividerComponent
              padding={{
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
          </Element>
        </Element>
        <Element
          canvas
          width={320}
          id="pay-info"
          is={Container}
          alignItems={"center"}
        >
          <Element
            canvas
            is={TimerComponent}
            id={"Timer"}
            storeKey={""}
            code={""}
          />
        </Element>
      </Element>
      <FormComponent />
    </>
  );
};

export const PayServiceComponent = HOCCodeWrapComponent(PayService);
