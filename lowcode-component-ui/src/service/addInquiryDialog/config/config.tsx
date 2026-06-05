import { FieldType } from "@brushes/form";
import { FormInstance, Image } from "antd";
export const formConfig: FieldType[] = [
  {
    name: "goodsName",
    label: "商品名称",
    type: "text",
    style: {
      width: 400,
      marginBottom: 20,
    },
    extraProps: {
      placeholder: "请输入",
    },
  },
  {
    name: "pricesetNpriceQmin",
    label: "价格区间",
    type: "number",
  },
  {
    name: "pricesetNpriceQmax",
    label: "~",
    colon: false,
    rules: [
      ({ getFieldValue }: FormInstance) => ({
        validator(_, value: any[]) {
          const prev = getFieldValue("pricesetNpriceQmin");
          if (prev && value) {
            if (value < prev) {
              return Promise.reject(new Error("不能小于开始值"));
            }
          }
          return Promise.resolve();
        },
      }),
    ],
    extraProps: {
      dependencies: ["pricesetNpriceQmin"],
    },
    type: "number",
  },
];

export const ROWKEYY = "skuNo";

export const columnConfig = [
  {
    title: "商品图片",
    width: 100,
    align: "center",
    dataIndex: "dataPic",
    render: (text, record, index) => {
      return <Image src={text} />;
    },
  },
  {
    title: "商品名称",
    width: 100,
    align: "center",
    dataIndex: "goodsName",
  },
  {
    title: "商品规格",
    width: 100,
    align: "center",
    dataIndex: "skuName",
  },
  {
    title: "单位",
    width: 80,
    align: "center",
    dataIndex: "partsnameNumunit",
  },
  {
    title: "商品分类",
    width: 140,
    align: "center",
    dataIndex: "classtreeShopname",
  },
];
