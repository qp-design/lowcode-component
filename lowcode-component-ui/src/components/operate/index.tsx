import { Space } from "antd";

interface ButtonTpye {
  name: string;
  link?: string;
}
export const OperateJsx = () => {
  const clickImpl = (e: any) => {
    e.preventDefault();
    console.log(10, e.target.dataset.link);
    history.pushState(null, "", e.target.dataset.link);
  };
  const buttonAList = [
    {
      name: "编辑",
      link: "/b2b-bus-pc-saas?menuAction=platDistributeSkuList&first-level=b2b0805001002063&second-level=0805001002002063#/platDistributeSkuEdit",
    },
    {
      name: "查看营销",
    },
    {
      name: "查看链接",
    },
  ];
  return (
    <Space size="middle">
      {buttonAList.map((item) => (
        <a data-link={item.link} onClick={clickImpl}>
          {item.name}
        </a>
      ))}
    </Space>
  );
};
