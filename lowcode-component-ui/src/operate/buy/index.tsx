import { Image } from "antd";
import { fullpath } from "@brushes/component-tool";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { ButtonComponent } from "../../basic";
import { useBuy } from "@brushes/component-store-web";

const Buy = ({
  car,
  imgWidth,
  imgHeight,
  skuId = "",
  goGoodsType,
  ...restProps
}: {
  skuId?: string;
  car: { imgUrl: string };
  imgHeight: number;
  imgWidth: number;
  text: string;
  goGoodsType:boolean;
}) => {
  const { add } = useBuy(goGoodsType);
  return (
    <ButtonComponent
      {...restProps}
      onClick={add}
      icon={
        car.imgUrl && (
          <Image
            preview={false}
            src={fullpath(car.imgUrl)}
            width={imgWidth}
            height={imgHeight}
          />
        )
      }
    />
  );
};

export const BuyComponent = HOCCodeWrapComponent(Buy);
