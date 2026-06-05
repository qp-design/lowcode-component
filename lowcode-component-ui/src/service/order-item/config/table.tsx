import { Form, FormInstance, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CardLRComponent, DiyColumnComponent } from "../../../service";
import { dynamicFormFields } from "@brushes/form";
import { ModuleProvider, useModuleContext } from "@brushes/component-core";

interface DataType {
  key: React.Key;
  goodsName: string;
  goodsCamount: number;
  contractGoodsArefnum: number;
  contractGoodsGtype: string;
  contractGoodsId: string;
}

const TableComponent: React.FC<{
  form: FormInstance;
  giftSelect: boolean;
  columns: Array<any>;
  onChange: (e: any) => void;
}> = ({ form, columns, giftSelect, onChange }) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowsKeys] = useState<React.Key[]>([]);
  const dataState = useModuleContext((s) => s.moduleStore.dataState);
  const refundType = Form.useWatch("refundType", form);
  const list = Form.useWatch("goodsList", form);
  useEffect(() => {
    let result = list;
    if (refundType === "B01" && dataState === 3) {
      result = list.filter((c: any) => !c.contractGoodsSendnum);
    } else if (refundType === "B02" && dataState === 3) {
      result = list.filter((c: any) => c.contractGoodsSendnum > 0);
    }
    setSelectedRowsKeys([]);
    setDataSource(result);
  }, [list, refundType]);

  const columnsMix: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "商品信息",
        dataIndex: "name",
        width: 300,
        render: (text: string, record) => {
          return (
            <ModuleProvider moduleStore={{ _skuInfo: record }}>
              <CardLRComponent height={100} />
            </ModuleProvider>
          );
        },
      },
      ...columns.map(({ type, ...restProps }) => {
        const config = {
          title: restProps.title,
          align: restProps.align || "left",
          dataIndex: restProps.value,
          width: restProps.width,
        };
        if (type && restProps.value) {
          return {
            ...config,
            render: (_: string, record: any, index: number) => (
              <DiyColumnComponent
                index={index}
                record={record}
                code={restProps.value}
              />
            ),
          };
        } else {
          return config;
        }
      }),
      {
        title: "售后数量",
        width: 120,
        align: "center",
        dataIndex: "refundGoodsNum",
        render(_, record: DataType, ind: number) {
          const isRequired = selectedRowKeys.includes(record.contractGoodsId);
          return (
            <>
              {record.goodsCamount - record.contractGoodsArefnum === 0 ||
              (!giftSelect && record.contractGoodsGtype === "1")
                ? record.goodsCamount - record.contractGoodsArefnum
                : dynamicFormFields(
                    [
                      {
                        type: "number",
                        rules: [{ required: isRequired, message: "必填项" }],
                        name: ["ocRefundGoodsBeanList", ind, "refundGoodsNum"],
                        extraProps: {
                          onChange(value) {
                            const result = form.getFieldValue(
                              "ocRefundGoodsBeanList",
                            );
                            const n = result.map((item) => {
                              if (
                                item.contractGoodsId === record.contractGoodsId
                              ) {
                                item.refundGoodsNum = value;
                              }
                              return item;
                            });
                            onChange(n);
                          },
                          max:
                            record.goodsCamount - record.contractGoodsArefnum,
                          min: 1,
                        },
                      },
                    ],
                    form,
                  )}
            </>
          );
        },
      },
    ],
    [selectedRowKeys, columns],
  );

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowsKeys(newSelectedRowKeys);
      const values = form.getFieldValue("ocRefundGoodsBeanList");
      const res = values.map((item: any) => ({
        ...item,
        checked: newSelectedRowKeys.includes(item.contractGoodsId),
      }));
      onChange(res);
    },
    getCheckboxProps: (record: DataType) => {
      return {
        disabled:
          record.goodsCamount - record.contractGoodsArefnum === 0 ||
          (!giftSelect && record.contractGoodsGtype === "1"), // Column configuration not to be checked
        name: record.goodsName,
      };
    },
  };

  return (
    <Table<DataType>
      pagination={false}
      rowKey={"contractGoodsId"}
      scroll={{ x: "max-content" }}
      rowSelection={rowSelection}
      columns={columnsMix}
      dataSource={dataSource}
    />
  );
};

export default TableComponent;
