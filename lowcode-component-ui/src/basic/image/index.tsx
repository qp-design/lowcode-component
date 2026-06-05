import { Image as Image2 } from "antd";
import { fullpath, useNavigateImpl } from "@brushes/component-tool";
import { useModuleContext } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useMemo } from "react";
import { get } from "lodash";

interface ImageProps {
  storeKey?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  code?: string;
  image?: { imgUrl: string; path?: string };
  [key: string]: any;
}

const ImageJsx = ({
  image = { imgUrl: "" },
  storeKey = "_skuInfo",
  borderRadius,
  width,
  code = "",
  ...restProps
}: ImageProps) => {
  const _skuInfo = useModuleContext((s) => s.moduleStore[storeKey]);
  const { navigator } = useNavigateImpl();
  const value = useMemo(() => {
    if (code && _skuInfo) {
      // @ts-ignore
      return get(_skuInfo, code) || image.imgUrl;
    }
    return image.imgUrl;
  }, [image, code, _skuInfo]);

  return (
    <div style={{ width, borderRadius, overflow: "hidden" }}>
      <Image2
        {...(image.path ? { onClick: () => navigator(image.path!) } : {})}
        style={{ cursor: image.path ? "pointer" : "" }}
        width={width}
        preview={false}
        {...restProps}
        src={fullpath(value)}
      />
    </div>
  );
};

export const ImageComponent = HOCCodeWrapComponent(ImageJsx);
