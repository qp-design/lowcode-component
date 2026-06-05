import { useGoodCategory } from "@brushes/component-store-web";
import { createStyles } from "antd-style";

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
      }
    `,
  };
});

export const GoodCategory = ({
  label,
  api,
  path = "",
  lastCode = "classtreeCode",
  goodsClassName = "goodsClassName",
  goodsClassCode = "goodsClassCode",
  ...restProps
}: any) => {
  const { styles } = useStyle();
  const { cateList, implCate } = useGoodCategory(
    label,
    api,
    goodsClassName,
    goodsClassCode,
    path,
    lastCode,
  );
  return (
    <ul className={styles.container}>
      {cateList.map((item: any, index: number) => (
        <li
          style={{
            float: "left",
            cursor: "pointer",
            margin: "0 10px 0 20px",
            ...restProps,
          }}
          onClick={() => implCate(item)}
          key={index}
        >
          {item[goodsClassName]}
        </li>
      ))}
    </ul>
  );
};
