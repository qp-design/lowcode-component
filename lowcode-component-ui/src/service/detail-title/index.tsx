import { usePrevTitle } from "@brushes/component-store-web";
import { Element } from "@brushes/component-core";
import { Text } from "../../basic";
import { HOCCodeWrapComponent } from "@brushes/core-transform";

const DetailTitle = () => {
  const preTitle = usePrevTitle();
  return <Element text={preTitle} canvas is={Text} id={`title_${preTitle}`} />;
};

export const DetailTitleComponent = HOCCodeWrapComponent(DetailTitle);
