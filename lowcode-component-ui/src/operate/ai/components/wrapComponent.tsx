import { ReactNode } from "react";

export const WrapComponent = ({ children }: { children: ReactNode }) => {
  return <div className={"m-16"}>{children}</div>;
};
