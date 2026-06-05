import {Button, Form, FormInstance, Table, type TableProps} from "antd";
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
    form.getFieldValue("whOpstoreSkuDomainList") || [],
  );
  const [selectedRowKeys, setSelectedRowsKeys] = useState<React.Key[]>([]);
  const storeDataSource = useModuleContext((s) => s.moduleStore[storeKey]);
  const isMounted = useRef(true);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const warehouseCode = Form.useWatch('warehouseCode', form);

  useEffect(() => {
    onChange([]);
    setDataSource([]);
    if(warehouseCode) {
      setModuleStore({
        warehouseCode
      })
    }
  }, [warehouseCode]);

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
        render(value, record: DataType, ind: number) {
          return (
            <>
              {dynamicFormFields(
                [
                  {
                    type: "number",
                    rules: [{ required: true, message: "必填项" }],
                    name: ["whOpstoreSkuDomainList", ind, "goodsNum"],
                    style: { marginBottom: 0 },
                    extraProps: {
                      onChange(value) {
                        const result = form.getFieldValue(
                          "whOpstoreSkuDomainList",
                        );
                        const n = (result || []).map((item) => {
                          if (item.skuNo === record.skuNo) {
                            item.goodsNum = value;
                          }
                          return item;
                        });
                        onChange(n);
                      },
                      max: value,
                      min: 1,
                    },
                  },
                ],
                form,
              )}
              <p style={{marginTop: 5, fontSize: 12}}>最大出库数量：{value}</p>
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
          disabled={!warehouseCode}
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
        rowKey={"storeSkuId"}
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
};
