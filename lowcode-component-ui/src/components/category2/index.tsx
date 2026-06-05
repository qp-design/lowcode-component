interface CategoryProps {
  [key: string]: any;
}
import { RightOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useComponentListData } from "@brushes/component-store-web";

const useStyles = createStyles(
  (
    { token, css },
    {
      height,
      hoverHeight,
      widthHover,
      width,
      backgroundColor,
    }: {
      widthHover: number;
      height: number;
      width: number;
      hoverHeight: number;
      backgroundColor: string;
    },
  ) => {
    return {
      category: css`
        position: relative;
        height: ${height}px;
        .wrap-container {
          position: relative;
          z-index: 9;
          width: ${width}px;
          height: ${height}px;
          padding: 10px 5px;
          border-radius: 10px;
          opacity: 1;
          background: ${backgroundColor};
          box-sizing: border-box;
          .menu-wrap {
            overflow: auto;
            height: 100%;
            //display: flex;
            font-size: 14px;
            //flex-direction: column;
            //justify-content: space-between;

            .menu-item {
              overflow: hidden;
              word-break: break-all;
              cursor: pointer;
              line-height: 41px;
              height: 41px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 18px;

              span {
                position: relative;
                display: block;
                font-size: 14px;
                color: #666;

                &::after {
                  position: absolute;
                  right: 30px;
                  top: 17.5px;
                  content: "";
                  //   @include bgImg(10px, 15px, '/imgs/icon-arrow.png');
                }
              }

              .iconfont {
                font-size: 14px;
                color: #666;
              }

              &:hover {
                background: ${token.colorBgTextHover};
                border-radius: 8px;

                span {
                  color: ${token.colorPrimary};
                }

                .children {
                  display: block;
                }
              }

              .children {
                cursor: initial;
                overflow: auto;
                position: absolute;
                // padding: 5px 20px 0 20px;
                padding: 20px;
                top: 0;
                left: ${width - 50}px;
                width: ${widthHover}px;
                height: ${height}px;
                border-radius: 10px;
                opacity: 1;
                background: #f8faff;
                display: none;
                box-sizing: border-box;
                border: 1px solid ${token.colorPrimary};
                z-index: 2024;

                .menu-list {
                  overflow-y: auto;
                  margin-bottom: 20px;
                  display: grid;
                  align-content: start;
                  grid-template-columns: 120px 1fr;

                  .goodsClassName {
                    width: 100px;
                    display: flex;
                    height: 14px;
                    line-height: 14px;
                    justify-content: space-between;
                    align-items: center;
                    white-space: nowrap;
                    margin-bottom: 5px;
                    font-size: 14px;

                    .el-icon-arrow-right {
                      //line-height: 40px;
                      font-weight: 600 !important;
                    }

                    :hover {
                      color: ${token.colorPrimary};
                    }

                    .click {
                      width: 120px;
                      cursor: pointer;
                      // color: var(--theme);
                      color: #221f20;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      font-weight: 500;
                      line-height: 1;

                      :hover {
                        color: ${token.colorPrimary};
                      }
                    }

                    .left {
                      line-height: 1;
                      // color: var(--theme);
                      color: #221f20;

                      :hover {
                        color: ${token.colorPrimary};
                      }
                    }
                  }

                  .disFlex {
                    margin-left: 20px;
                    display: flex;
                    font-size: 14px;
                    flex-wrap: wrap;

                    li {
                      line-height: 14px;
                      margin-right: 10px;
                      margin-bottom: 6px;
                      display: flex;
                      flex-wrap: wrap;

                      .three {
                        span {
                          cursor: pointer;
                          //font-weight: 500;
                          font-size: 14px;
                          letter-spacing: 0em;

                          // color: var(--theme);
                          color: #221f20;

                          :hover {
                            color: ${token.colorPrimary};
                          }
                        }

                        :hover {
                          color: ${token.colorPrimary};
                        }
                      }

                      .four {
                        margin-left: 10px;
                        flex: 1;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;

                        span {
                          font-size: 14px;
                          font-style: normal;

                          &:hover {
                            color: ${token.colorPrimary};
                          }
                        }
                      }
                    }
                  }

                  a {
                    color: #333333;
                    font-size: 14px;
                  }

                  img {
                    width: 42px;
                    height: 35px;
                    vertical-align: middle;
                    margin-right: 15px;
                  }
                }
              }
            }
          }
          &:hover {
            height: ${hoverHeight}px;
            .menu-item {
              .children {
                height: ${hoverHeight}px;
              }
            }
          }
        }
      `,
    };
  },
);

const ItemMemu = ({ item }: any) => {
  const navigator = useNavigate();

  // 点击四级分类，跳转到搜索结果页
  const toSearchResult = (a: object, classLevel: number) => {
    const params = new URLSearchParams();
    params.append("goodsClassName", a.goodsClassName);
    if (classLevel === 3) {
      params.append("classtreeCode", a.classtreeCode);
    } else {
      params.append("goodsClassParentcode", a.goodsClassCode);
    }

    navigator(`/goodList?${params.toString()}`);
  };

  return (
    <li className={"menu-item"}>
      <span className={"click"} onClick={() => toSearchResult(item, 1)}>
        {item.goodsClassName}
      </span>
      <RightOutlined style={{ opacity: 0.8, fontSize: 12 }} />

      {item.childList && (
        <div className="children">
          {(item.childList || []).map((x: any, i: number) => (
            <ul className="menu-list" key={i}>
              <div className="goodsClassName">
                <div className="click" onClick={() => toSearchResult(x, 2)}>
                  {x.goodsClassName}
                </div>
                <RightOutlined style={{ opacity: 0.8, fontSize: 12 }} />
              </div>

              <div className="disFlex">
                {(x.childList || []).map((sub: any, j: number) => (
                  <li key={j} onClick={() => toSearchResult(sub, 3)}>
                    <div className="three">
                      <span className="click">
                        {sub ? sub.goodsClassName : "--"}
                      </span>
                    </div>
                    <div className="four">
                      {(sub.childList || []).map((fourItem: any, j: number) => (
                        <span
                          key={j}
                          onClick={() => toSearchResult(fourItem, 4)}
                          className="click"
                        >
                          {fourItem ? fourItem.goodsClassName : "--"}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          ))}
        </div>
      )}
    </li>
  );
};
export const CategorySimple = ({
  width,
  dataPath = "",
  storeKey,
  height,
  backgroundColor,
  widthHover,
}: {
  widthHover: number;
  dataPath: string;
  storeKey: string;
  backgroundColor: string;
  width: number;
  height: number;
}) => {
  const apiData = useComponentListData(dataPath, storeKey);
  const { styles } = useStyles({
    height,
    width,
    backgroundColor,
    widthHover,
    hoverHeight: Math.max(apiData.length * 41 + 20, height),
  });
  return (
    <div className={styles.category}>
      <div className={"wrap-container"}>
        <ul className={"menu-wrap"}>
          {apiData.map((item, index) => (
            <Fragment key={index}>
              <ItemMemu key={index} item={item} />
              {/*{*/}
              {/*    index > 9 ? null : <ItemMemu key={index} item={item}/>*/}
              {/*}*/}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};
