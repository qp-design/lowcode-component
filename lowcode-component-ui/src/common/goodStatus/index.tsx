export const GooodTypeInfo = ({
  dataState,
}: {
  dataState: string | number;
}) => {
  console.log(85, dataState);
  switch (+dataState) {
    case 3:
      return <div className={"state-info"}>商品已失效</div>;
    case 1:
      return <div className={"state-info"}>商品库存不足</div>;
    case 2:
      return <div className={"state-info"}>商品已下架</div>;
    default:
      return "";
  }
};
