import { useMemo } from "react";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { fixPrice } from "@brushes/component-tool";
import { useModuleContext } from "@brushes/component-core";

type TextProps = {
  text?: string | number;
  fontSize?: number;
  baseNumber: string;
  format?: string;
  fontWeight?: number;
  lineHeight?: string;
  padding?: object;
  num?: number;
  margin?: object;
  height?: number;
  className?: string;
  code: string;
  storeKey: string;
  color?: string;
};

export const Amount: React.FC<TextProps & { dataInfo: object }> = ({
  baseNumber,
  text,
  storeKey,
  color,
  fontSize,
  code,
  padding = {},
  margin = {},
  className,
  ...restProps
}) => {
  const dataInfo = useModuleContext((s) => s.moduleStore[storeKey]) || {};

  const value = useMemo(() => {
    if (code && baseNumber) {
      return fixPrice(+dataInfo[code] * +dataInfo[baseNumber]);
    }
    return text;
  }, [text, baseNumber, code, dataInfo]);

  return (
    <div
      className={className}
      style={{
        fontSize,
        color,
        lineHeight: 1.5,
        ...restProps,
        ...padding,
        ...margin,
      }}
    >
      {value}
    </div>
  );
};

export const AmountComponent = HOCCodeWrapComponent(Amount);
