import { Button } from "antd";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { ReactNode, CSSProperties } from "react";
import { useEditor } from "@brushes/component-core";

interface ButtonProps {
  text?: string;
  disabled?: boolean;
  icon?: ReactNode;
  size?: "small" | "middle" | "large";
  margin?: CSSProperties;
  padding?: CSSProperties;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  onClick?: () => void;
  loading?: boolean;
  openKey?: string;
  borderSize?: number;
  borderColor?: string;
  [key: string]: any;
}

const Button2 = ({
  text,
  disabled = false,
  icon,
  size,
  margin = {},
  padding = {},
  type,
  onClick,
  loading,
  openKey,
  ...restProps
}: ButtonProps) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  return (
    <Button
      {...{
        icon,
        type,
        size,
        onClick,
        loading,
        disabled: !enabled && Boolean(disabled),
        // ...(disabled !== '' ? { disabled } : {})
      }}
      style={{
        ...margin,
        ...padding,
        ...restProps,
        border: `${restProps.borderSize || 1}px solid ${restProps.borderColor},`,
      }}
      data-id={text || openKey}
    >
      {text}
    </Button>
  );
};

export const ButtonComponent = HOCCodeWrapComponent(Button2);
