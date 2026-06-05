import { FieldType, TransformType } from "@brushes/form";
import { post } from "@brushes/request";
import TableComponent from "./table";
import { FormInstance } from "antd";
import { get, pick } from "lodash";
import { uploadGoodsFile } from "@brushes/lowcode-component-api";

export const transformSubmitDataConfig: TransformType[] = [
  {
    from: "ocRefundFileDomainList",
    to: "ocRefundFileDomainList",
    format: async (preValue: any) => {
      const file = get(preValue, "[0].originFileObj");
      if (file) {
        try {
          const data = await uploadGoodsFile({ file });
          return [
            {
              refundFileUrl: data.fileUrl,
            },
          ];
        } catch (err: any) {
          throw new Error(err);
        }
      }
      return get(preValue, "[0].url");
    },
  },
  {
    from: "ocRefundGoodsBeanList",
    to: "ocRefundGoodsBeanList",
    format: async (preValue: any) => {
      return preValue
        .filter((item: any) => item.checked)
        .map((item: any) => {
          if (
            item.goodsCamount - item.contractGoodsArefnum ===
            item.refundGoodsNum
          ) {
            item.refundGoodsAmt =
              item.contractGoodsMoney - item.contractGoodsAremoney || 0;
          } else {
            item.refundGoodsAmt = item.contractGoodsPrice * item.refundGoodsNum;
          }
          return pick(item, [
            "skuNo",
            "goodsNo",
            "skuShowno",
            "goodsShowno",
            "contractGoodsCode",
            "goodsCamount",
            "refundGoodsAmt",
            "refundGoodsNum",
          ]);
        });
    },
  },
  {
    from: "cashback",
    to: "cashback",
    format: () => {},
    isDelete: true,
  },
];

export const orderItemConfig = (dataState: number) =>
  [
    {
      name: "cashback",
      label: "订单金额",
      style: { marginBottom: 10, paddingLeft: 10 },
      layout: "horizontal",
      type: "slot",
      extraProps: {
        render: ({ value }) => {
          return <p>{value}</p>;
        },
      },
    },
    (form: FormInstance) => ({
      name: "refundType",
      type: "radioGroup",
      layout: "horizontal",
      rules: [{ required: true }],
      label: "售后类型",
      extraProps: {
        onChange: () => {
          form.setFieldValue("refundEx", "");
          const values = form.getFieldValue("ocRefundGoodsBeanList");
          const result = values.map((item: any) => ({
            ...item,
            checked: false,
          }));
          form.setFieldValue("ocRefundGoodsBeanList", result);
        },
        options: () => {
          return dataState === 2
            ? [
                {
                  value: "B01",
                  label: "仅退款",
                },
              ]
            : [
                {
                  value: "B01",
                  label: "仅退款",
                },
                {
                  value: "B02",
                  label: "退货退款",
                },
              ];
        },
      },
    }),
    {
      name: "refundEx",
      type: "select",
      rules: [{ required: true }],
      label: "售后理由",
      layout: "horizontal",
      extraProps: {
        dependencies: ["refundType"],
        options: async (value: string) => {
          const data = await post("/web/oc/refund/queryRefCause.json", {
            flagSettingPro: value === "B01" ? "T1" : "T2",
          });
          return data || [];
        },
        fieldNames: {
          label: "flagSettingInfo",
          value: "flagSettingCode"
        },
      },
    },
    {
      name: "ocRefundFileDomainList",
      label: "售后凭证",
      layout: "horizontal",
      rules: [{ required: true }],
      type: "upload",
      extraProps: {
        listType: "picture-card",
        text: "",
      },
    },
    {
      name: "refundMeo",
      label: "详细描述",
      style: { marginBottom: 10, paddingLeft: 10 },
      layout: "horizontal",
      type: "textarea",
    },
    {
      name: "ocRefundGoodsBeanList",
      label: "售后商品",
      rules: [
        ({ getFieldValue }: FormInstance) => {
          if (getFieldValue("refundType") === "B01" && dataState === 3) {
            return { required: false };
          }
          return { required: true };
        },
        ({ getFieldValue }: FormInstance) => ({
          validator(_, value) {
            const list = value.filter(
              (item: any) => item.checked && item.refundGoodsNum > 0,
            );
            if (
              (value && list.length > 0) ||
              (getFieldValue("refundType") === "B01" && dataState === 3)
            ) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("售后商品及售后数量不能为空"));
          },
        }),
      ],
      type: "slot",
      extraProps: {
        dependencies: ["refundType"],
        render: TableComponent,
      },
    },
    {
      name: "refundMoney",
      label: "总退款金额",
      type: "slot",
      style: { marginBottom: 10 },
      layout: "horizontal",
      extraProps: {
        dependencies: ["ocRefundGoodsBeanList"],
        render: ({ form, onChange }) => {
          const ocRefundGoodsBeanList = form.getFieldValue(
            "ocRefundGoodsBeanList",
          );
          let total = 0;
          (ocRefundGoodsBeanList || [])
            .filter((item: any) => item.checked)
            .forEach((item: any) => {
              if (
                item.goodsCamount - item.contractGoodsArefnum ===
                item.refundGoodsNum
              ) {
                total +=
                  item.contractGoodsMoney - item.contractGoodsAremoney || 0;
              } else {
                total += item.contractGoodsPrice * item.refundGoodsNum;
              }
            });
          onChange(total);
          return `¥ ${total}`;
        },
      },
    },
  ] as FieldType[];
