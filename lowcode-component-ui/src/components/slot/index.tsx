import { SlotEmpty } from "@brushes/component-core";
import React from "react";
import { useEditor } from "@brushes/component-core";

export const Slot: React.FC<{
  text: string;
  info?: string;
  Children?: React.FC;
}> = ({ text, Children, info, ...restProps }) => {
  const { isEnabled } = useEditor((state) => ({
    isEnabled: state.options.enabled,
  }));

  const emptyRender = isEnabled ? <SlotEmpty /> : null;

  return <>{Children ? <Children {...restProps} /> : emptyRender}</>;
};
