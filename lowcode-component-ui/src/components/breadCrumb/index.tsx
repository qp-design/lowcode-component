import React, { useMemo, useState } from "react";
import { Breadcrumb as Breadcrumb2 } from "antd";
import { useModuleContext } from "@brushes/component-core";
import { useNavigateImpl } from "@brushes/component-tool";
import { useSearchParamHook } from "@brushes/component-store-web";

export const Breadcrumb: React.FC = (props) => {
  const { navigator } = useNavigateImpl();
  const [goodsClassName, classtreeCode] = useSearchParamHook([
    "goodsClassName",
    "classtreeCode",
  ]);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);
  const breadList =
    useModuleContext((s) => s.moduleStore.breadList as any[]) || [];

  const flatList = useMemo(() => {
    let result: any[] = [];
    const loop = (list) => {
      if (!list || list.length === 0) return;
      list.forEach((item) => {
        result.push(item);
        loop(item.childList);
      });
    };

    if (breadList.length > 0 && breadList[0].label === "全部商品") {
      loop(breadList[0].cateList);
    }
    return result;
  }, [breadList]);

  const getFullPath = useMemo(() => {
    const hasParams = !!goodsClassName || !!classtreeCode;
    if (!hasParams) return "";

    if (!goodsClassName || !flatList.length) return goodsClassName || "";

    const currNode = flatList.find(
      (item) => item.goodsClassName === goodsClassName
    );
    if (!currNode) return goodsClassName;

    const pathArr = [currNode.goodsClassName];

    if (currNode.classtreeCode) {
      const codes = currNode.classtreeCode.split(",").filter(Boolean);
      codes.reverse().forEach((code) => {
        const parent = flatList.find((c) => c.goodsClassCode === code);
        if (parent) pathArr.unshift(parent.goodsClassName);
      });
    } else {
      let parentCode = currNode.goodsClassParentcode;
      while (parentCode && parentCode !== "-1") {
        const parent = flatList.find((c) => c.goodsClassCode === parentCode);
        if (!parent) break;
        pathArr.unshift(parent.goodsClassName);
        parentCode = parent.goodsClassParentcode;
      }
    }

    return pathArr.join(" > ");
  }, [goodsClassName, classtreeCode, flatList]);

  const list = useMemo(() => {
    const newBreadList = [...breadList];

    const hasParams = !!goodsClassName || !!classtreeCode;
    if (hasParams && newBreadList.length > 0) {
      newBreadList[newBreadList.length - 1] = {
        ...newBreadList[newBreadList.length - 1],
        label: getFullPath,
      };
    }

    return [{ label: "首页" }].concat(newBreadList);
  }, [breadList, getFullPath, goodsClassName, classtreeCode]);

  const onChange = (item: any, ind: number) => {
    if (ind === 0) {
      navigator("/index");
    } else {
      setModuleStore({
        breadList: breadList.slice(0, ind),
        params: item.params,
        cateList: item.cateList,
      });
    }
  };

  return (
    <Breadcrumb2
      separator=">"
      items={list.map((item: { label: string }, ind) => ({
        title:
          ind !== list.length - 1 ? (
            <a style={props} key={ind} onClick={() => onChange(item, ind)}>
              {item.label}
            </a>
          ) : (
            <span style={props} key={ind}>
              {item.label}
            </span>
          ),
      }))}
    />
  );
};