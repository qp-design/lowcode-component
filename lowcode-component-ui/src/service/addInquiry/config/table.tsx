import { Button, FormInstance, Table, type TableProps } from "antd";
import type { TableColumnsType } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardLRComponent } from "../../../service";
import { dynamicFormFields } from "@brushes/form";
import { ModuleProvider, useModuleContext } from "@brushes/component-core";
import { isEmpty } from "lodash";

interface DataType {
  key: React.Key;
  goodsName: string;
  goodsCamount: number;
  contractGoodsArefnum: number;
  contractGoodsGtype: string;
  skuNo: string;
}

export const TableComponent: React.FC<{
  form: FormInstance;
  storeKey: string;
  openKey: string;
  onChange: (e: any) => void;
}> = ({ form, storeKey, openKey, onChange }) => {
  const [dataSource, setDataSource] = useState<DataType[]>(
    form.getFieldValue("eqAuctionGoodsDomainList") || [],
  );
  const [selectedRowKeys, setSelectedRowsKeys] = useState<React.Key[]>([]);
  const storeDataSource = useModuleContext((s) => s.moduleStore[storeKey]);
  const isMounted = useRef(true);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  useEffect(() => {
    if (!isEmpty(storeDataSource)) {
      onChange(storeDataSource);
      setDataSource(storeDataSource);
    }
    if (!isMounted.current && isEmpty(storeDataSource)) {
      onChange([]);
      setDataSource(storeDataSource);
    }
    return () => {
      isMounted.current = false;
    };
  }, [storeDataSource]);

  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: "商品信息",
        dataIndex: "name",
        width: 300,
        render: (text: string, record) => {
          return (
            <ModuleProvider moduleStore={{ _skuInfo: record }}>
              <CardLRComponent borderRadius={8} height={100} />
            </ModuleProvider>
          );
        },
      },
      {
        title: "数量",
        width: 120,
        align: "center",
        dataIndex: "goodsNum",
        render(_, record: DataType, ind: number) {
          return (
            <>
              {dynamicFormFields(
                [
                  {
                    type: "number",
                    rules: [{ required: true, message: "必填项" }],
                    name: ["eqAuctionGoodsDomainList", ind, "goodsNum"],
                    style: { marginBottom: 0 },
                    extraProps: {
                      onChange(value) {
                        const result = form.getFieldValue(
                          "eqAuctionGoodsDomainList",
                        );
                        const n = (result || []).map((item) => {
                          if (item.skuNo === record.skuNo) {
                            item.goodsNum = value;
                          }
                          return item;
                        });
                        onChange(n);
                      },
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
      {
        title: "单位",
        width: 100,
        align: "center",
        dataIndex: "partsnameNumunit",
      },
      {
        title: "商品备注",
        width: 120,
        align: "center",
        dataIndex: "goodsWebremark",
        render(_, record: DataType, ind: number) {
          return (
            <>
              {dynamicFormFields(
                [
                  {
                    type: "textarea",
                    name: ["eqAuctionGoodsDomainList", ind, "goodsWebremark"],
                    style: { marginBottom: 0 },
                    extraProps: {
                      onChange(value) {
                        const result = form.getFieldValue(
                          "eqAuctionGoodsDomainList",
                        );
                        const n = (result || []).map((item) => {
                          if (item.skuNo === record.skuNo) {
                            item.goodsWebremark = value.target.value;
                          }
                          return item;
                        });
                        onChange(n);
                      },
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
    [],
  );

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowsKeys(newSelectedRowKeys);
    },
  };

  const clickImpl = () => {
    setModuleStore({
      [openKey]: true,
    });
  };

  const deleteImpl = () => {
    const source = dataSource.filter(
      (item: any) => !selectedRowKeys.includes(item.skuNo),
    );
    setModuleStore({
      [storeKey]: source,
    });
  };

  return (
    <>
      <div>
        <Button
          style={{ marginBottom: 20 }}
          type={"primary"}
          onClick={clickImpl}
        >
          添加商品
        </Button>
        <Button
          style={{ marginBottom: 20, marginLeft: 20 }}
          danger
          onClick={deleteImpl}
        >
          删除
        </Button>
      </div>

      <Table<DataType>
        rowSelection={rowSelection}
        pagination={false}
        rowKey={"skuNo"}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
};
