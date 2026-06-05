import { useEffect, useRef } from "react";
import { columnConfig, formConfig, ROWKEYY } from "./config";
import { TableJsx, useTableWithSelect } from "@brushes/table";
import { DynamicForm, submitType } from "@brushes/form";
import { queryRsSkuPage } from "@brushes/lowcode-component-api";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Button } from "antd";
import { useModuleContext } from "@brushes/component-core";

const Custom = ({
  storeKey,
  openKey,
}: {
  openKey: string;
  storeKey: string;
}) => {
  const tableRef = useRef(null);
  const selectRows = useRef<any[]>([]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const dataSource = useModuleContext((s) => s.moduleStore[storeKey]);

  const { rowSelection, setSelectRow, setRowValue } = useTableWithSelect(
    ROWKEYY,
    (value: any[]) => {
      selectRows.current = value;
    },
  );

  useEffect(() => {
    const result = dataSource || [];
    selectRows.current = result;
    setRowValue(result);
    setSelectRow(result.map((item: any) => item.skuNo));
  }, [dataSource]);

  const submit = (...args: submitType) => {
    tableRef.current!.tableQuery(args);
  };

  const save = () => {
    setModuleStore({
      [storeKey]: [...selectRows.current],
      [openKey]: false,
    });
  };

  return (
    <>
      <DynamicForm
        name={"addInquiryGood"}
        transformSubmitDataConfig={[]}
        layout={"inline"}
        onSubmit={submit}
        fields={formConfig}
        saveText={"查询"}
      />
      <TableJsx
        rowSelection={rowSelection}
        ref={tableRef}
        rowKey={ROWKEYY}
        buttonList={[]}
        columns={columnConfig}
        storeQuery={{
          api: queryRsSkuPage,
        }}
      />
      <Button onClick={save}>保存</Button>
    </>
  );
};

export const AddInquiryDialogComponent = HOCCodeWrapComponent(Custom);
