import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Linear } from "../../common";

const ButtonJsx = (props: any) => {
  return <Linear {...props} />;
};
export const ButtonWrap = HOCCodeWrapComponent(ButtonJsx);
