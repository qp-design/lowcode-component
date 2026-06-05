import { Container, useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { RightOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { ButtonComponent, Text } from "../../basic";
import { Element } from "@brushes/component-core";
import { useSearchParams } from "react-router-dom";

export const useStyles3 = createStyles(({ css, token }) => {
  return {
    promote: css`
      display: flex;
      color: #444;
      justify-content: space-between;
      .tips {
        background: ${token.colorError};
        color: #fff;
        padding: 3px 4px;
        border-radius: 4px;
        letter-spacing: 1px;
        font-size: 12px;
      }
    `,
  };
});

const PromotionAction = () => {
  let [, setSearchParams] = useSearchParams();
  const retry = useModuleContext((s) => s.moduleStore.retry);
  const { promotionName, promotionCode, disNextMsg, pbCode } =
    useModuleContext((s) => s.moduleStore._skuInfo) || {};

  const nextBuyImpl = () => {
    setSearchParams({
      promotionCode,
    });
    retry({
      orderOpen: true,
      title: "凑单",
    });
  };
  const openImpl = () => {
    setSearchParams({
      promotionCode,
    });
    retry({
      giftOpen: true,
      title: "赠品",
    });
  };

  if (disNextMsg) {
    return (
      <div
        style={{
          width: 500,
          fontSize: 12,
          justifyContent: "right",
          display: "flex",
          textAlign: "right",
          alignItems: "center",
        }}
      >
        {promotionName}
        {disNextMsg}
        <ButtonComponent
          fontSize={12}
          onClick={nextBuyImpl}
          icon={<RightOutlined />}
          iconPosition={"end"}
          type={"link"}
          text={"去凑单"}
        />
      </div>
    );
  }

  if (pbCode === "0001") {
    return (
      <ButtonComponent
        fontSize={12}
        onClick={openImpl}
        icon={<RightOutlined />}
        iconPosition={"end"}
        type={"link"}
        text={"赠品"}
      />
    );
  }
};

export const PromotionActionComponent = HOCCodeWrapComponent(PromotionAction);

const Promotion = ({ padding, margin }: any) => {
  const { styles } = useStyles3();
  const { promotionName, shoppingCode } =
    useModuleContext((s) => s.moduleStore._skuInfo) || {};

  if (!promotionName) {
    return null;
  }
  return (
    <div style={{ ...padding, ...margin }} id={shoppingCode}>
      <Element
        id={shoppingCode}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        canvas
        is={Container}
      >
        <Element
          flexDirection={"row"}
          alignItems={"center"}
          canvas
          is={Container}
          id={"pdName"}
        >
          <div className={styles.promote}>
            <Text
              fontSize={12}
              module={"moduleStore"}
              color={"#fff"}
              className={"tips"}
              code={"pbName"}
            />
          </div>
          <Text
            fontSize={12}
            module={"moduleStore"}
            code={"promotionName"}
            padding={{ paddingLeft: 5 }}
          ></Text>
        </Element>
        <Element
          canvas
          is={PromotionActionComponent}
          id={"pd-promotion"}
        ></Element>
        {/*<PromotionActionComponent/>*/}
      </Element>
    </div>
  );
};

export const CartPromotionComponent = HOCCodeWrapComponent(Promotion);
