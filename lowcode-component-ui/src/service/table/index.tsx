import { useTableWithSelect } from "@brushes/table";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import {
  Container,
  ModuleProvider,
  useModuleContext,
  Element,
} from "@brushes/component-core";
import { Table } from "antd";
import { useComponentListData } from "@brushes/component-store-web";
import { useEffect, useMemo } from "react";
import {get} from "lodash";

const Inner = ({
                 code,
                 record,
                 index,
               }: {
  code: string;
  record: any;
  index: number;
}) => {
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  useEffect(() => {
    setModuleStore({
      [code]: record,
      index,
    });
  }, [code, record]);
  return <Element canvas is={Container} id={code} />;
};

export const DiyColumnComponent = ({
                                     code,
                                     record,
                                     index,
                                   }: {
  code: string;
  record: object;
  index: number;
}) => {
  const store = useModuleContext((s) => s.moduleStore) || {};
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  return (
      <ModuleProvider
          moduleStore={{ ...store, setParentModuleStore: setModuleStore }}
      >
        <Inner code={code} record={record} index={index} />
      </ModuleProvider>
  );
};

const App = ({
               dataPath = "",
               providerNum,
               consumeNum,
               expandable = false,
               height,
               type,
               ROWKEYY,
               columns,
               storeKey,
               selectStoreKey,
               rowSelectKey,
               ...restProps
             }: {
  storeKey: string;
  selectStoreKey: string;
  providerNum?: string;
  consumeNum?: string;
  expandable?: boolean;
  dataPath?: string;
  type?: "checkbox" | "radio" | "";
  rowSelectKey?: string;
  height?: number;
  columns: Array<any>;
  ROWKEYY: string;
}) => {
  const onChange = useModuleContext((s) => s.moduleStore.onChange);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const path = useModuleContext((s) => s.moduleStore.dataPath);

  const list = useComponentListData(dataPath, storeKey);
  const { rowSelection } = useTableWithSelect(
      ROWKEYY,
      (value: Array<any>) => {
        if (type) {
          if(path) {
            onChange?.(get(value, path));
            if(selectStoreKey) {
              setModuleStore({
                [selectStoreKey]: get(value, path)
              })
            }
          } else {
            onChange?.(value);
            if(selectStoreKey) {
              setModuleStore({
                [selectStoreKey]: value
              })
            }
          }
        }
      },
      type,
      (record: any) => {
        if (providerNum && consumeNum) {
          return {
            disabled:
                (record[providerNum] ?? 0) - (record[consumeNum] ?? 0) === 0, // Column configuration not to be checked
          };
        } else if (providerNum) {
          return {
            disabled: (record[providerNum] ?? 0) === 0, // Column configuration not to be checked
          };
        }
        return void 0;
      },
  );

  useEffect(() => {
    if (!type && onChange) {
      onChange(list);
    }
  }, [type, list]);

  const columnsMix = useMemo(() => {
    return columns.map(({ type, ...restProps }) => {
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
    });
  }, [columns]);

  return (
      <>
        <Table
            {...restProps}
            dataSource={list}
            pagination={false}
            rowKey={ROWKEYY}
            scroll={height ? { y: height } : {y: 'auto' }}
            expandable={
              expandable
                  ? {
                    expandedRowRender: (record, index) => (
                        <DiyColumnComponent
                            index={index}
                            record={record}
                            code={"expandable"}
                        />
                    ),
                    defaultExpandedRowKeys: ["0"],
                  }
                  : undefined
            }
            columns={columnsMix}
            rowSelection={rowSelection}
        />
      </>
  );
};

export const TableComponent = HOCCodeWrapComponent(App);
