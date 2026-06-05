import { createStyles } from "antd-style";
import { useSku } from "@brushes/component-store-web";
import classNames from "classnames";

const useStyle = createStyles(({ token, css }) => {
  return {
    defaultWrap: css`
      display: grid;
      align-items: center;
      grid-template-columns: 100px 1fr;
      .sku-title {
        color: #999;
        font-size: 12px;
        padding: 15px 0 15px 10px;
      }
    `,
    skuList: css`
      display: flex;
      align-items: center;
      flex-flow: row wrap;
      .skuItem {
        cursor: pointer;
        font-size: 12px;
        color: ${token.colorPrimary};
        border: 1px solid ${token.colorBorder};
        padding: 5px 10px;
        margin: 5px 15px 5px 0;
        border-radius: 2px;
      }
      .active {
        border: 1px solid ${token.colorPrimary};
        background: ${token.colorPrimary};
        color: #fff;
      }
    `,
  };
});

export const SkuList = ({
  dataKey,
  promotionKey,
  couponKey,
}: {
  dataKey: string;
  promotionKey: string;
  couponKey: string;
}) => {
  const { styles } = useStyle();
  const { specList, onClick, skuListName } = useSku(
    dataKey,
    promotionKey,
    couponKey,
  );
  return (
    <div>
      {specList.map((item: any, index: number) => {
        return (
          <div className={styles.defaultWrap} key={index}>
            <div className="sku-title">{item.specName}</div>
            <div className={styles.skuList}>
              {item.skuOption.map((c: any, ind: number) => {
                return (
                  <div
                    className={classNames({
                      skuItem: true,
                      active: skuListName[index] === c.specValueValue,
                      // offShelf: spec[index] === item.specValueValue && offShelf
                    })}
                    key={ind}
                    onClick={() => onClick(c.specValueValue, index)}
                  >
                    {c.specValueValue}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
