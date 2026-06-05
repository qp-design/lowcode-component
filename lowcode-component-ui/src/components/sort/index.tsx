import { createStyles } from "antd-style";
import { useModuleContext } from "@brushes/component-core";
import { useRef } from "react";

const useStyle = createStyles(({ css, token }) => {
  return {
    container: css`
      margin-bottom: 2px;
      line-height: 40px;
      width: 100%;
      list-style: none;
      background: #fff;
      li {
        list-style: none;
        align-items: center;
        display: flex;
      }
      .actived {
        color: ${token.colorPrimary} !important;
      }
      .activedPath {
        fill: ${token.colorPrimary} !important;
      }
      .defaultPath {
        fill: #000;
      }
    `,
  };
});

export const Sort = ({
  config = [
    {
      label: "默认",
      value: "",
    },
    {
      label: "上新",
      value: "skuHdate",
    },
    {
      label: "销量",
      value: "pricesetNprice",
    },
  ],
  ...props
}: {
  config: Array<{ label: string; value: string; arrow?: boolean }>;
}) => {
  const sortName = useRef("");
  const activeIndex = useRef(0);
  const { styles } = useStyle();
  const order = useRef("desc");
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const params = useModuleContext((s) => s.moduleStore.params);
  const impl = (item: any, index: number, isNeedOrder: boolean) => {
    sortName.current = item.value;
    activeIndex.current = index;
    order.current = order.current === "desc" ? "asc" : "desc";
    setModuleStore({
      params: {
        ...params,
        order: isNeedOrder ? order.current : "",
        sortField: item.value,
      },
    });
  };

  return (
    <ul className={styles.container}>
      {config.map((item, index) => (
        <li
          className={
            item.value === sortName.current && activeIndex.current === index
              ? "actived"
              : ""
          }
          style={{
            float: "left",
            cursor: "pointer",
            margin: "0 10px 0 20px",
            ...props,
          }}
          onClick={() => impl(item, index, item.arrow)}
          key={index}
        >
          {item.label}
          {item.arrow && (
            <li
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <svg
                t="1760433865251"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6533"
                width="6"
                height="6"
              >
                <path
                  className={
                    activeIndex.current === index && order.current === "asc"
                      ? "activedPath"
                      : "defaultPath"
                  }
                  d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z"
                  p-id="6534"
                ></path>
              </svg>
              <svg
                t="1760433901145"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7512"
                width="6"
                height="6"
              >
                <path
                  className={
                    activeIndex.current === index && order.current === "desc"
                      ? "activedPath"
                      : "defaultPath"
                  }
                  d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z"
                  p-id="7513"
                ></path>
              </svg>
            </li>
          )}
        </li>
      ))}
    </ul>
  );
};
