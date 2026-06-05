import { ConfigProvider } from "antd";
import { createStyles } from "antd-style";
import { Element } from "@brushes/component-core";
import { Container } from "@brushes/component-core";

const useStyle = createStyles(
  (
    { prefixCls, css },
    props: {
      color: string;
      letterSpacing: number;
      fontWeight: number;
      startColor: string;
      endColor: string;
    },
  ) => ({
    linearGradientButton: css`
      letter-spacing: ${props.letterSpacing}px;
      color: ${props.color};
      font-weight: ${props.fontWeight};

      //&.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(
          135deg,
          ${props.startColor},
          ${props.endColor}
        );
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
        // background: linear-gradient(0deg, ${props.startColor}, ${props.endColor});
      }
      //}
    `,
  }),
);

export const Linear = ({
  endColor,
  color,
  letterSpacing,
  fontWeight,
  startColor,
}: {
  color: string;
  letterSpacing: number;
  fontWeight: number;
  endColor: string;
  startColor: string;
}) => {
  const { styles } = useStyle({
    startColor,
    color,
    endColor,
    letterSpacing,
    fontWeight,
  });
  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <div style={{ padding: 2 }}>
        <Element canvas is={Container} id={"container-linear"}></Element>
      </div>
    </ConfigProvider>
  );
};
