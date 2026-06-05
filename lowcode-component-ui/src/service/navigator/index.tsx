import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { fullpath, useNavigateImpl } from "@brushes/component-tool";
import { Divider } from "antd";
import { createStyles } from "antd-style";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";

const useStyles = createStyles(
  (
    { token, css },
    {
      className,
      padding = {},
    }: {
      padding?: {
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
      };
      className: string;
    },
  ) => {
    if (className) {
      return {
        [className]: css`
            display: flex;
            align-items: center;
            li {
                list-style: none;
                font-size: 12px;
                display: grid;
                align-items: center;
        
                .title {
                    display: flex;
                    align-items: center;
                    padding: ${padding.paddingTop || 0}px ${padding.paddingRight || 0}px ${padding.paddingBottom || 0}px ${padding.paddingLeft || 0}px;
                    img {
                        height: 14px;
                        padding-right: 4px;
                    }
                }
                .actived{ color: ${token.colorPrimary}
            }
        `,
      };
    } else {
      return css``;
    }
  },
);
const NavigatorJsx: React.FC<{
  menu: Array<any>;
  className?: any;
  padding?: {
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
  tel: string;
  user: string;
  isNeedLine?: boolean;
}> = ({
  menu = [{ title: "默认导航" }],
  className = "",
  isNeedLine,
  padding,
}) => {
  const { styles } = useStyles({ className: className || "", padding });
  const { pathname } = useLocation();
  const { navigator } = useNavigateImpl();
  return (
    <ul className={className ? styles[className] : ""}>
      {menu.map((item: any, index: number) => (
        <Fragment key={index}>
          <li key={index}>
            <div
              style={{ cursor: item.path ? "pointer" : "" }}
              className={
                pathname.includes(
                  (item.path || "/index").split("/").slice(0, 2).join("/"),
                )
                  ? "actived title"
                  : "title"
              }
              onClick={() => navigator(item.path)}
            >
              {item.imgUrl && <img src={fullpath(item.imgUrl)} />}
              {item.title}
            </div>
          </li>
          {menu.length - 1 !== index && isNeedLine && (
            <Divider type="vertical" />
          )}
        </Fragment>
      ))}
    </ul>
  );
};

export const NavigatorComponent = HOCCodeWrapComponent(NavigatorJsx);
