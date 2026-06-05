import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { ButtonComponent } from "../../basic";
import { Image } from "antd";
import { fullpath } from "@brushes/component-tool";

const ButtonWrap = ({
  openKey,
  car = {},
  imgHeight,
  imgWidth,
  parentOpenKey,
  ...restProps
}: {
  car: { imgUrl: string };
  imgHeight?: number;
  imgWidth?: number;
  parentOpenKey?: string;
  openKey?: string;
}) => {
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const setParentModuleStore = useModuleContext(
    (s) => s.moduleStore.setParentModuleStore,
  );
  const add = () => {
    if (parentOpenKey) {
      setParentModuleStore({
        [parentOpenKey]: true,
      });
    } else {
      if (openKey) {
        setModuleStore({
          formEditorId: "",
          [openKey]: true,
        });
      }
    }
  };
  return (
    <ButtonComponent
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
      openKey={"addressOpen"}
      onClick={add}
      text={"新增收货地址"}
      danger
      type={"link"}
      {...restProps}
    />
  );
};
export const ButtonOperate = HOCCodeWrapComponent(ButtonWrap);
