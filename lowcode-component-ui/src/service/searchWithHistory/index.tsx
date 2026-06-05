import Search from "antd/es/input/Search";
import {
  Element,
  Container,
  useModuleRootContext,
} from "@brushes/component-core";
import { AutoComplete } from "antd";
import { Text } from "../../basic";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useNavigateImpl } from "@brushes/component-tool";
import { createStyles } from "antd-style";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { noop, get } from "lodash";
import { Button, Select } from "antd";

const useStyle = createStyles(({ token, css }, props: any) => {
  return {
    wrapSearch: css`
      .ant-select-selection-search {
        position: absolute !important;
      }
    `,
    search: css`
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
        border-radius: ${props.borderRadius}px 0 0 ${props.borderRadius}px !important;
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
// const options = [
//     {
//         value: 'good',
//         label: '商品',
//     },
//     {
//         value: 'shop',
//         label: '店铺',
//     },
// ];

const listOptions = [
  {
    label: "123",
    value: "123123123123",
  },
];

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
  const [searchParams] = useSearchParams();
  const { styles } = useStyle(props);
  const [value, setValue] = useState("");
  const searchQuery =
    useModuleRootContext((s) => s.rootStore.searchQuery) || noop;
  const [path, setPath] = useState("");

  const defaultValue = useMemo(() => {
    return get(options, "[0].value", "");
  }, [options]);

  useEffect(() => {
    const value = searchParams.get("searchParam") || "";
    setValue(value);
  }, [searchParams.get("searchParam")]);

  const onSearch = (value: string) => {
    navigator(`${path || defaultValue}?searchParam=${value}`);
    if (pathname === (path || defaultValue)) {
      searchQuery({
        searchParam: value,
      });
    }
  };

  const searchShop = () => {
    searchQuery({
      searchParam: value,
    });
  };

  const onChange = (e: string) => {
    setPath(e);
  };

  return (
    <AutoComplete
      className={styles.wrapSearch}
      // popupMatchSelectWidth={500}
      style={{ width: "100%" }}
      options={listOptions}
    >
      <Search
        className={styles.search}
        value={value}
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
        onChange={(e) => {
          setValue(e.target.value);
        }}
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

export const SearchWithHistoryComponent = HOCCodeWrapComponent(SearchJsx);
