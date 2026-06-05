import Search from "antd/es/input/Search";
import {
  Element,
  Container,
  useModuleRootContext,
} from "@brushes/component-core";
import { AutoComplete, Flex } from "antd";
import { Text } from "../../basic";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useNavigateImpl } from "@brushes/component-tool";
import { createStyles } from "antd-style";
import { useLocation, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { noop, get, isEmpty, debounce } from "lodash";
import { Button, Select } from "antd";
import { post } from "@brushes/request";
import { useSearchParamHook } from "@brushes/component-store-web";

const useStyle = createStyles(({ token, css }, props: any) => {
  return {
    wrapSearch: css`
      height: 38px;
      .ant-select-selection-search {
        position: absolute !important;
      }
    `,
    search: css`
      margin-left: -5px;
      &:hover {
        .ant-input-search-button {
          background: none;
        }
        .ant-select-selector {
          border: 0 !important;
          background: none;
          box-shadow: none !important;
        }
      }
      .ant-input-affix-wrapper {
        height: ${props.height}px;
        line-height: ${props.height}px;
        font-size: ${props.size}px;
        padding: 4px;
        border: solid ${props.borderSize}px
          ${props.borderColor || token.colorPrimary};
      }
      .ant-select-selector {
        border: 0 !important;
        box-shadow: none !important;
      }
      .ant-select-selection-item {
        color: ${token.colorPrimary};
      }
      button {
        background: ${token.colorPrimary};
        &:active,
        &:hover {
          background: ${token.colorPrimary} !important;
        }
      }
      .ant-input-group-addon {
        background: ${token.colorPrimary};
        border: solid 2px ${token.colorPrimary};
        color: #fff;
        border-radius: 0 10px 10px 0;
        padding: 0;
        width: 80px;
        text-align: center;
        cursor: pointer;
        button {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0em;
        }
      }
    `,
  };
});

const Title: React.FC<
  Readonly<{ title?: string; deleteImpl: (e: any) => void; isDelete: boolean }>
> = (props) => {
  return (
    <Flex align="center" justify="space-between">
      {props.title}
      {props.isDelete && (
        <Button
          style={{ padding: 0, margin: 0 }}
          type={"link"}
          onClick={(e) => props.deleteImpl(e)}
        >
          全部删除
        </Button>
      )}
    </Flex>
  );
};

const SearchJsx = ({
  isShopSearch,
  options,
  size,
  placeholder,
  ...props
}: {
  options: Array<any>;
  isShopSearch?: boolean;
  size: any;
  placeholder: string;
}) => {
  const { navigator } = useNavigateImpl();
  const { pathname } = useLocation();
  const [type, searchParam] = useSearchParamHook(["type", "searchParam"]);
  const [open, setOpen] = useState(false);
  const { styles } = useStyle(props);
  const [value, setValue] = useState("");
  const setModuleRootStore = useModuleRootContext((s) => s.setModuleRootStore);
  const searchQuery =
    useModuleRootContext((s) => s.rootStore.searchQuery) || noop;
  const historyList = useModuleRootContext((s) => s.rootStore._historyList);
  console.log("historyList", historyList);
  const [path, setPath] = useState("");
  const [hot, setHot] = useState<Array<any>>([]);
  const fetchItem = (
    historyList: Array<any>,
    title: string,
    isDelete = true,
  ) => {
    const renderItem = (title: string, isDelete: boolean) => ({
      value: title,
      label: (
        <Flex align="center" justify="space-between">
          {title}
          {isDelete && (
            <Button
              style={{ padding: 0, margin: 0, fontSize: 12 }}
              type={"link"}
              onClick={(e) => deleteImpl(e, title)}
            >
              删除
            </Button>
          )}
        </Flex>
      ),
    });

    const deleteImpl = (e: any, value?: string) => {
      e.stopPropagation();
      if (value) {
        setModuleRootStore({
          _historyList: historyList.filter((item) => item !== value),
        });
      } else {
        setModuleRootStore({
          _historyList: [],
        });
      }
    };
    if (isEmpty(historyList)) {
      return [];
    }
    return [
      {
        label: (
          <Title title={title} deleteImpl={deleteImpl} isDelete={isDelete} />
        ),
        options: (historyList || [])
          // .reverse()
          .slice(0, 10)
          .map((item: string) => renderItem(item, isDelete)),
      },
    ];
  };

  const historyItems = useMemo(() => {
    return fetchItem([...(historyList || [])], "历史记录");
  }, [historyList]);

  const defaultValue = useMemo(() => {
    const defaultValue = get(options, "[0].value", "");
    const { value } = options.find((item) => item.value.slice(1) === type) || {
      value: defaultValue,
    };
    return value;
  }, [options]);

  useEffect(() => {
    if (searchParam) {
      const isExister = (historyList || []).includes(searchParam);
      setModuleRootStore({
        _historyList: !isExister
          ? (historyList || []).concat(searchParam)
          : historyList,
      });
    }
    setValue(searchParam);
  }, [searchParam]);

  const onSearch = (value: string) => {
    setOpen(false);
    if (value) {
      let newHistoryList = [...(historyList || [])];
      const index = newHistoryList.indexOf(value);
      if (index > -1) {
        newHistoryList.splice(index, 1);
      }
      newHistoryList.unshift(value);
      setModuleRootStore({
        _historyList: newHistoryList
      });
    }
    navigator(`${path || defaultValue}?searchParam=${value}`);
    if (pathname === (path || defaultValue)) {
      searchQuery({
        searchParam: value,
      });
    }
  };
  const changeF = async (e: string) => {
    const { list } = await post("/web/es/searchengine/find.json", {
      goodsType: "00, 40",
      bizType: "sku",
      goodsOrigin: "0,8",
      searchParam: e,
    });
    const result = new Set(list.map((item: any) => item.goodsShowname) || []);
    setHot(fetchItem([...result], "匹配分词", false));
  };

  // 实际处理输入的方法
  const handleDebouncedChange = useCallback(
    debounce((val) => {
      changeF(val);
    }, 500),
    [], // 确保 debounce 只初始化一次
  );

  const fetchWord = (e: any) => {
    const val = e.target.value;
    handleDebouncedChange(val);
  };

  const searchShop = () => {
    setOpen(false);
    searchQuery({
      searchParam: value,
    });
  };
  const onChange = (e: string) => {
    setOpen(false);
    setPath(e);
  };
  return (
    <AutoComplete
      value={value}
      open={open}
      onBlur={() => setOpen(false)}
      className={styles.wrapSearch}
      style={{ width: "100%" }}
      onChange={setValue}
      options={value ? hot : historyItems}
    >
      <Search
        className={styles.search}
        value={value}
        onFocus={() => setOpen(true)}
        prefix={
          <Select
            onChange={onChange}
            className={"none-wrap"}
            onClick={(e) => e.stopPropagation()}
            defaultValue={defaultValue}
            options={options}
          />
        }
        allowClear
        size={size}
        placeholder={placeholder}
        onChange={fetchWord}
        suffix={
          isShopSearch ? (
            <Button style={{ marginRight: -6 }} onClick={searchShop} danger>
              搜本店
            </Button>
          ) : null
        }
        enterButton={
          <Element canvas is={Container} id={"enterButton"}>
            <Text width={50} fontSize={14} color={"#fff"} text={"搜索"} />
          </Element>
        }
        onSearch={onSearch}
      />
    </AutoComplete>
  );
};

export const SearchComponent = HOCCodeWrapComponent(SearchJsx);
