import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { NumberComponent } from "../number";

function RebMoney(props: any) {
  const _rebMoney = useModuleContext((s) => s.moduleStore._rebMoney); //商品信息

  return <NumberComponent prefix={"-"} {...props} value={_rebMoney} />;
}

export const RebMoneyComponent = HOCCodeWrapComponent(RebMoney);
