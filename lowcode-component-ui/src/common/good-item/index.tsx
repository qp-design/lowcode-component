import { Container, Element } from "@brushes/component-core";
import { ImageComponent, Text } from "../../basic";

export const GoodItem = () => {
  return (
    <Element
      alignItems={"center"}
      flexDirection={"row"}
      canvas
      is={Container}
      id={"canvas"}
    >
      <Element
        width={100}
        alignItems={"center"}
        padding={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
          paddingTop: 5,
        }}
        canvas
        id="card-larc"
        is={Container}
      >
        <ImageComponent code={"dataPic"} />
      </Element>
      <Element
        canvas
        width={340}
        id={"price-title"}
        alignItems={"center"}
        justifyContent={"center"}
        is={Container}
        flexDirection={"row"}
      >
        <Text fontSize={12} code={"goodsName"} />
      </Element>
      <Element
        width={100}
        alignItems={"center"}
        padding={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
          paddingTop: 5,
        }}
        canvas
        id="card-larc"
        is={Container}
      >
        <Text fontSize={14} code={"goodsNo"} />
      </Element>

      <Element
        canvas
        width={220}
        id={"price-title"}
        alignItems={"center"}
        justifyContent={"center"}
        is={Container}
        flexDirection={"row"}
      >
        <Text text={"￥"} color={"#f00"} fontSize={12} />
        <Text
          text={"￥"}
          color={"#f00"}
          fontSize={14}
          fontWeight={500}
          code={"pricesetNprice"}
        />
        <Text color={"#666"} fontWeight={500} text={" / "} />
        <Text
          text={"￥"}
          color={"#666"}
          fontWeight={500}
          code={"partsnameWeightunit"}
        />
      </Element>
      <Element
        canvas
        width={220}
        id={"price-title"}
        alignItems={"center"}
        justifyContent={"center"}
        is={Container}
        flexDirection={"row"}
      >
        <Text fontSize={14} code={"skuName"} />
      </Element>
      <Element
        canvas
        width={220}
        id={"price-title"}
        alignItems={"center"}
        justifyContent={"center"}
        is={Container}
        flexDirection={"row"}
      >
        <Text text={0} code={"goodsCamount"} fontSize={14} />
      </Element>
    </Element>
  );
};
