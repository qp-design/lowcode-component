import { Text } from "../../basic";
import { Container, Element } from "@brushes/component-core";
import { fullpath } from "@brushes/component-tool";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
const NavigatorJsx = ({
  width,
  children,
  background,
  margin = {},
  positionValue = {},
  padding = {},
  backgroundImage,
  position,
  borderColor,
  list,
  fontSize,
  ...props
}: any) => {
  return (
    <div
      style={{
        ...margin,
        display: "flex",
        boxSizing: "border-box",
        position,
        border: `solid 1px ${borderColor}`,
        ...padding,
        ...props,
        background: backgroundImage
          ? `url(${fullpath(backgroundImage)}) repeat-x center 0`
          : background,
        width: (width + "").includes("%") ? width : `${width}px`,
      }}
    >
      {list.map((item: { label: string }, index: number) => {
        return (
          <Element
            key={`${item.label}_navigator`}
            id={`${item.label}_navigator`}
            flexDirection={"row"}
            canvas
            is={Container}
          >
            <Text fontSize={fontSize} key={index} text={item.label} />
          </Element>
        );
      })}
    </div>
  );
};

export const NavigatorComponent2 = HOCCodeWrapComponent(NavigatorJsx);
