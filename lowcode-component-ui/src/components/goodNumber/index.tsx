import { InputNumber } from "antd";
import { useModuleContext } from "@brushes/component-core";
import { useEffect, useMemo } from "react";
import { get } from "lodash";

export const GoodNumber = ({
  text,
  saveStoreKey = "goodNum",
  storeKey = "_skuInfo",
  stepKey = "goodsTopnum",
  min = "goodsMinnum",
  max = "goodsSupplynum",
  ...restProps
}: {
  min?: string;
  stepKey?: string;
  saveStoreKey?: string;
  max?: string;
  storeKey?: string;
  text: string;
  onChange?: (e: any) => void;
}) => {
  const _skuInfo = useModuleContext((s) => s.moduleStore[storeKey]) || {};
  const onChange = useModuleContext((s) => s.moduleStore.onChange);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  const step = useMemo(() => {
    if (stepKey) {
      const num = get(_skuInfo, min) || 1;
      const isDouble = get(_skuInfo, stepKey);

      return isDouble ? num : 1;
    }
    return 1;
  }, [_skuInfo, stepKey]);
  const goodNum =
    useModuleContext((s) => s.moduleStore[saveStoreKey]) ||
    get(_skuInfo, min) ||
    1;
  useEffect(() => {
    if (onChange) {
      onChange(get(_skuInfo, min));
    }
    setModuleStore({
      [saveStoreKey]: get(_skuInfo, min),
    });
  }, [_skuInfo[min]]);

  const setChange = (value: number | null) => {
    if (!value) return;
    // 确保值是 step 的整数倍
    const roundedValue = Math.floor(value / step) * step;
    if (onChange) {
      onChange(roundedValue || 1);
    }
    setModuleStore({
      [saveStoreKey]: roundedValue || 1,
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <InputNumber
        step={step}
        style={{ ...restProps }}
        min={get(_skuInfo, min) || 1}
        max={get(_skuInfo, max)}
        value={goodNum}
        onChange={setChange}
        changeOnWheel
      />
    </div>
  );
};
