import { useModuleRootContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Badge, Image } from "antd";
import { fullpath } from "@brushes/component-tool";
import { ButtonComponent } from "../../basic";
import { useEffect } from "react";
import { useGetCarNum } from "@brushes/component-store-web";

const CarBadgeJsx = ({
  car,
  _tourist,
  imgWidth,
  imgHeight,
  skuId = "",
  ...restProps
}: {
  _tourist?: boolean;
  skuId?: string;
  car: { imgUrl: string };
  imgHeight: number;
  imgWidth: number;
  text: string;
}) => {
  const _cart = useModuleRootContext((s) => s.rootStore._cart);
  const { getGoodsList } = useGetCarNum();
  useEffect(() => {
    const params = _tourist ? { _tourist: true } : {};
    getGoodsList(params);
  }, []);
  return (
    <Badge count={_cart}>
      <ButtonComponent
        {...restProps}
        onClick={() => {}}
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
    </Badge>
  );
};

export const CarBadge = HOCCodeWrapComponent(CarBadgeJsx);
