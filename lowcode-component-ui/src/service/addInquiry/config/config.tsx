import { FieldType, TransformType } from "@brushes/form";
import { TableComponent } from "./table";
import dayjs from "dayjs";
export const formConfig: (e: string, openKey: string) => FieldType[] = (
  storeKey: string,
  openKey: string,
) => [
  {
    name: "auctionName",
    label: "询价标题",
    type: "text",
    rules: [{ required: true }],
    extraProps: {
      placeholder: "请输入",
    },
  },
  {
    name: "contactPhone",
    label: "联系方式",
    rules: [
      {
        required: true,
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确手机号码",
      },
    ],
    type: "text",
  },
  {
    name: "auctionEdate",
    label: "报价截止时间",
    rules: [{ required: true }],
    type: "date",
    extraProps: {
      showNow: false,
      showTime: true,
      disabledDate: (current: any) => {
        return current && current < dayjs().endOf("hour");
      },
      style: { width: "100%" },
      format: "YYYY-MM-DD HH:mm:ss",
    },
  },
  {
    name: "eqAuctionGoodsDomainList",
    label: "",
    rules: [{ required: true, message: "商品不能为空" }],
    type: "slot",
    extraProps: {
      render: ({ form, onChange }) => {
        return (
          <div style={{ marginBottom: 20 }}>
            <TableComponent
              form={form}
              onChange={onChange}
              storeKey={storeKey}
              openKey={openKey}
            />
          </div>
        );
      },
    },
  },
  {
    name: "auctionEnrollRemark",
    label: "询价备注",
    type: "textarea",
    extraProps: {
      placeholder: "请输入询价备注",
    },
  },
];

export const transformSubmitDataConfig: TransformType[] = [
  {
    from: "auctionEdate",
    to: "auctionEdate",
    format: (preValue: any, value: any) => {
      console.log(10, preValue);
      return dayjs(preValue).format("YYYY-MM-DD HH:mm:ss");
    },
  },
];
