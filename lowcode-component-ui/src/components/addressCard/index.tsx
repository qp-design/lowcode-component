import { createStyles } from "antd-style";
import { ReactNode } from "react";
import { Container, Element } from "@brushes/component-core";
import { Text, ApiComponent } from "../../basic";
import { ButtonOperate } from "../../service";

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0);
      &:hover {
        border: 1px solid ${token.colorPrimary};
      }
    `,
  };
});

export const AddressCard = ({
  children,
  padding = {},
  margin,
  ...props
}: {
  margin?: object;
  padding?: object;
  children: ReactNode;
}) => {
  const { styles } = useStyles();

  return (
    <div
      className={styles.container}
      style={{
        ...margin,
        ...padding,
        ...props,
      }}
    >
      <Element
        canvas
        id="address-title"
        is={Container}
        padding={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={"row"}
      >
        <Text fontSize={16} num={1} fontWeight={700} text={"确认收货地址"} />
        <ButtonOperate openKey={"addressOpen"} />
      </Element>

      <Element
        canvas
        id="address-list"
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
        <Text fontSize={14} num={1} fontWeight={500} text={"配送至："} />
        <ApiComponent
          padding={{ paddingTop: 5, paddingBottom: 5 }}
          storeKey={"addressStore"}
          defaultValue={"[]"}
          width={1100}
          callbackName={"addressQueryRetry"}
          componentType={"detail"}
          api={"/web/um/address/queryAddressBymerberCode.json"}
        />
      </Element>
    </div>
  );
};
