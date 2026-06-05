import { Image } from "antd";
import { fullpath } from "@brushes/component-tool";
import { useAddCart } from "@brushes/component-store-web";
import { ButtonComponent } from "../../basic";

export const AddCart = ({
  car,
  imgWidth,
  imgHeight,
  storeKey = '_skuInfo',
  ...restProps
}: {
  car: { imgUrl: string };
  imgHeight: number;
  storeKey?: string;
  imgWidth: number;
  text: string;
}) => {
  const { add } = useAddCart(storeKey);
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
