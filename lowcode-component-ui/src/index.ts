import * as component from "./components";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
let componentList: any = {};
Object.entries(component).forEach(([key, value]) => {
  if (!key.startsWith("NoNeed")) {
    const id = key + "Component";
    componentList[id] = HOCCodeWrapComponent(
      value,
      ["CardList", "Banner", "PageDetail", "SwiperThumb"].includes(key),
    );
  } else {
    componentList[key] = value;
  }
  // const id = key.startsWith('NoNeed') ? key : key + 'Component';
  // componentList[id] = HOCCodeWrapComponent(value, ['CardList', 'Banner', 'PageDetail', 'SwiperThumb'].includes(key));
});

export default componentList;
