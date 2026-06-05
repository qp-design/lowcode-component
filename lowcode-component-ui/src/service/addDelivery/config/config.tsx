import { FieldType, TransformType } from "@brushes/form";
import { TableComponent } from "./table";
import dayjs from "dayjs";
import {post} from "@brushes/request";

export const formConfig: (e: string, openKey: string) => FieldType[] = (
  storeKey: string,
  openKey: string,
) => [
  (form) => {
    return {
      name: "warehouseCode",
      label: "出库仓库",
      type: "select",
      rules: [{ required: true }],
      extraProps: {
        options: async () => {
          const {list} = await post('/web/wh/warehouse/queryWarehouse.json');
          return list.map(item => ({
            label: item.warehouseName,
            value: item.warehouseCode
          }))
        },
        onChange(value, {label}) {
          form.setFieldValue('warehouseName', label)
        },
        placeholder: "请选择出库仓库",
      },
    }
  },
  (form) => {
    return {
      name: "goodsReceiptMem",
      label: "地址",
      type: "select",
      rules: [{ required: true }],
      extraProps: {
        options: async () => {
          const list = await post('/web/um/address/queryAddressBymerberCode.json');
          return list.map(item => ({
            ...item,
            label: item.provinceName + item.cityName + item.areaName + item.addressDetail,
            value: item.addressMember,
          }))
        },
        onChange(_, v) {
          const {label, provinceName, cityName, areaName, addressPhone, provinceCode, cityCode, areaCode } = v;
          form.setFieldValue('goodsReceiptPhone', addressPhone)
          form.setFieldValue('provinceName', provinceName)
          form.setFieldValue('cityName', cityName)
          form.setFieldValue('areaName', areaName)
          form.setFieldValue('provinceCode', provinceCode)
          form.setFieldValue('cityCode', cityCode)
          form.setFieldValue('areaCode', areaCode)
          form.setFieldValue('GoodsReceiptArrdess', label)
        },
        placeholder: "请选择出库仓库",
      },
    }
  },
  {
    name: "GoodsReceiptArrdess",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "goodsReceiptPhone",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "provinceName",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "cityName",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "areaName",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "provinceCode",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "cityCode",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "areaCode",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "warehouseName",
    label: "出库仓库",
    type: "text",
    hidden: true,
  },
  {
    name: "whOpstoreSkuDomainList",
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
    name: "opstoreRemark",
    label: "出库备注",
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
