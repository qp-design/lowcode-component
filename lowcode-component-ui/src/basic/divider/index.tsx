import { Divider } from "antd";
import { HOCCodeWrapComponent } from "@brushes/core-transform";

type DividerType = {
  text?: string;
  borderWidth: number;
  borderColor: string;
  margin?: object;
};
export const Divider2: React.FC<DividerType> = ({
  text,
  margin,
  borderWidth,
  borderColor,
  ...props
}) => {
  return (
    <Divider style={{ borderColor, borderWidth, ...margin }} {...props}>
      {text}
    </Divider>
  );
};

export const DividerComponent = HOCCodeWrapComponent(Divider2);
