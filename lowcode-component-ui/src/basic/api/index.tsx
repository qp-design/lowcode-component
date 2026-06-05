import React, { Fragment, useEffect, useMemo } from "react";
import {
  Container,
  Element,
  ModuleProvider,
  useModuleContext,
} from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { Empty, Pagination, Spin } from "antd";
import { useApiComponent } from "@brushes/component-store-web";
import { get } from "lodash";

const CardBasic: React.FC<any> = ({
  callbackName,
  callback,
  setParentModuleStore,
  parentStore,
  parentStoreKey,
  ...props
}) => {
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  useEffect(() => {
    let obj: { [v: string]: any } = {};
    if (callbackName) {
      obj[callbackName] = callback;
    }
    if (setParentModuleStore) {
      obj.setParentModuleStore = setParentModuleStore;
    }
    if (parentStoreKey) {
      obj[parentStoreKey] = parentStore;
    }
    obj._skuInfo = props;
    setModuleStore(obj);
  }, [props, callbackName, parentStore, parentStoreKey]);

  return <Element canvas id={`card-basic`} is={Container}></Element>;
};

const DetailBasic: React.FC<any> = ({ result, storeKey, dataPath }) => {
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  useEffect(() => {
      if(storeKey) {
          let obj = result;
          if (dataPath) {
              obj = get(result, dataPath);
          }
          setModuleStore({
              [storeKey]: obj,
          });
      }
  }, [result, storeKey]);

  return <Element canvas id={"detail-basic"} is={Container}></Element>;
};

type CardListType = {
  gap: number;
  id?: string;
  children?: React.ReactNode;
  mockData?: string;
  paramsRootStore?: Array<{ key: string; value: string }>;
  transformParams?: Array<{ key: string; value: string }>;
  paramsRootStoreKey?: string;
  paramsStoreKey?: string;
  cacheParamsTime?: number;
  cacheParams?: boolean;
  isSearch?: boolean;
  storeKey: string;
  callbackName?: string;
  padding: object;
  margin: object;
  storeKeyTotal?: string;
  description: string;
  imgKey?: string;
  num: number;
  api: string;
  defaultValue: string;
  dataPath: string;
  rows?: number;
  paramsStore?: Array<{ key: string; value: string }>;
  params?: Array<{ key: string; value: string }>;
  pagination: boolean;
  componentType: string;
};

const ApiList: React.FC<
  Partial<CardListType> & {
    onChange: (page: number, pageSize: number) => void;
    result: { [value: string]: any };
    description: string;
    loading: boolean;
    currentPage: { current: number };
    callbackName?: string;
    pagination: boolean;
    parentStoreKey?: string;
  }
> = ({
  id,
  rows,
  loading,
  callbackName,
  currentPage,
  result,
  pagination,
  description,
  onChange,
  dataPath,
  padding,
  margin,
  gap,
  num,
  parentStoreKey,
  ...restProps
}) => {
  const list = useMemo(() => {
    if (dataPath) {
      return get(result, dataPath, []) || [];
    }
    return result;
  }, [result, dataPath]);

  const parentStore = useModuleContext((s) =>
    parentStoreKey ? s.moduleStore[parentStoreKey] : undefined,
  );
  const callback = useModuleContext((s) =>
    callbackName ? s.moduleStore[callbackName] : undefined,
  );
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  if (!list.length || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...margin,
          ...padding,
          ...restProps,
        }}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
      </div>
    );
  }
  return (
    <Fragment>
      <div
        style={{
          display: "grid",
          gap,
          gridTemplateColumns: `repeat(${num}, 1fr)`,
          ...margin,
          ...padding,
          ...restProps,
        }}
      >
        {list.map((item: any, index: number) => (
          <Fragment key={ id ? item[id] : index}>
            <ModuleProvider>
              <CardBasic
                parentStoreKey={parentStoreKey}
                parentStore={parentStore}
                callbackName={callbackName}
                setParentModuleStore={setModuleStore}
                callback={callback}
                {...item}
              />
            </ModuleProvider>
          </Fragment>
        ))}
      </div>
      {pagination && (
        <div style={{ marginTop: 20 }}>
          <Pagination
            align="end"
            pageSizeOptions={[5, 10, 12, 20, 24, 36, 50, 100]}
            showSizeChanger
            pageSize={rows}
            onChange={onChange}
            current={currentPage.current}
            total={result.total}
          />
        </div>
      )}
    </Fragment>
  );
};

const Api: React.FC<CardListType> = ({
  callbackName,
  componentType,
  mockData,
  description,
  paramsStoreKey,
  storeKeyTotal,
  paramsRootStore,
  transformParams,
  paramsRootStoreKey,
  params,
  defaultValue,
  rows,
  api,
  id,
  isSearch,
  storeKey,
  dataPath,
  margin = {},
  paramsStore,
  cacheParams = false,
  cacheParamsTime = 3,
  padding = {},
  pagination,
  children,
  ...restProps
}) => {
  const { result, onChange, pageSize, currentPage, loading } = useApiComponent(
    api,
    rows,
    {
      transformParams,
      defaultValue,
      pagination,
      params,
      callbackName,
      isSearch,
      storeKeyTotal,
      paramsRootStore,
      paramsRootStoreKey: paramsRootStoreKey || "",
      paramsStoreKey: paramsStoreKey || "",
      cacheParams: cacheParams || false,
      mockData: mockData || "",
      cacheParamsTime,
      paramsStore,
      componentType,
    },
  );
  if (componentType === "detail") {
    return (
      <Spin spinning={loading}>
        <div
          style={{
            ...margin,
            ...padding,
            ...restProps,
          }}
        >
          {children}
          <DetailBasic
            dataPath={dataPath}
            storeKey={storeKey}
            result={result}
          />
          {pagination && result.total ? (
            <div style={{ marginTop: 20 }}>
              <Pagination
                align="end"
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 12, 20, 24, 36, 50, 100]}
                showSizeChanger
                onChange={onChange}
                current={currentPage.current}
                total={result.total}
              />
            </div>
          ) : null}
        </div>
      </Spin>
    );
  } else {
    return (
      <Spin spinning={loading}>
        <ApiList
          loading={loading}
          description={description}
          storeKeyTotal={storeKeyTotal}
          rows={pageSize}
          pagination={pagination}
          callbackName={callbackName}
          margin={margin}
          padding={padding}
          result={result}
          id={id}
          dataPath={dataPath}
          onChange={onChange}
          currentPage={currentPage}
          {...restProps}
        />
      </Spin>
    );
  }
};

export const ApiComponent = HOCCodeWrapComponent(Api);
