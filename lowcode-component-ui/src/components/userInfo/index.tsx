import { createStyles } from "antd-style";
import { fullpath, useNavigateImpl } from "@brushes/component-tool";
import { useEffect } from "react";
import { LogoutComponent } from "../../operate";
import { DividerComponent, Text } from "../../basic";
import { Element } from "@brushes/component-core";
import { Container, useModuleRootContext } from "@brushes/component-core";
import { useOrderNum } from "@brushes/component-store-web";
const useStyle = createStyles(({ token, css }) => {
  return {
    tipInfo: css`
      width: 100%;
      //height: 190px;
      //background: linear-gradient(
      //        148deg,
      //        rgba(9, 82, 229, 0.1) 1%,
      //        rgba(9, 82, 229, 0.03) 103%
      //);
      box-sizing: border-box;
      border-radius: 10px;
      padding: 10px 10px 0px 10px;
      .er_img {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        .erweima-svg {
          width: 102px;
          height: 102px;
        }
      }
      .text {
        margin-top: 10px;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        line-height: 24px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #7c7c7c;
      }
      .bannerImg {
        margin-top: 20px;
      }
    `,
    commonInfo: css`
      .userInfo {
        height: 55px;
        margin-top: 10px;
        display: flex;
        .userImg {
          .img {
            width: 55px;
            height: 55px;
            border-radius: 10px;
          }
        }
        .userInfo_Detail {
          margin-top: 5px;
          margin-bottom: 5px;
          margin-left: 10px;
          width: 90px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .top {
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            letter-spacing: 0em;
            font-variation-settings: "opsz" auto;
            color: #232323;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 200px;
            .name {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .bottom {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            letter-spacing: 0em;
            font-variation-settings: "opsz" auto;
            color: #8b8e93;
            .hover:hover {
              cursor: pointer;
              color: ${token.colorPrimary};
            }
          }
        }
      }
      .otherInfo {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: 5px;
        margin: 30px 0 20px;
        .box {
          //width: 37px;
          text-align: center;
          cursor: pointer;
        }
        .top_num {
          line-height: 1.2;
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        .bottom_name {
          line-height: 1.2;
          font-size: 12px;
        }
      }
    `,
  };
});
export const UserInfo = ({
  text,
  imgUrl,
  _tourist,
  config,
  contractType = "00,26,30,80,35,36",
  ...restProps
}: {
  contractType?: string;
  _tourist: boolean;
  config: Array<{ label: string; code: string }>;
  text: string;
  imgUrl: string;
}) => {
  const { styles } = useStyle();
  const { navigator } = useNavigateImpl();
  const { getOrderBadge } = useOrderNum();
  const _orderCount =
    useModuleRootContext((s) => s.rootStore._orderCount) || {};
  useEffect(() => {
    const params = _tourist
      ? { _tourist: true, contractType }
      : { contractType };
    getOrderBadge(params);
  }, []);

  return (
    <div>
      <div className={styles.tipInfo}>
        <div className={styles.commonInfo}>
          <div className="userInfo">
            <div className="userImg">
              <img className="img" src={fullpath(imgUrl)} alt="" />
            </div>
            <div className="userInfo_Detail">
              <div className="top">
                <Text
                  module={"rootStore"}
                  storeKey={"_userInfo"}
                  text="用户名"
                  code={"userName"}
                ></Text>
              </div>
              <div className="bottom">
                <Element
                  padding={{ paddingTop: 8 }}
                  height={20}
                  alignItems={"center"}
                  flexDirection={"row"}
                  is={Container}
                  id={"info-bottom"}
                >
                  <Text
                    module={"rootStore"}
                    storeKey={"_userInfo"}
                    text="昵称"
                    code={"userNickname"}
                  ></Text>
                  <DividerComponent
                    type="vertical"
                    margin={{ marginLeft: 5, marginRight: 5 }}
                  />
                  <Element is={Container} canvas>
                    <LogoutComponent
                      text={"退出"}
                      fontSize={12}
                      type={"link"}
                      padding={{ paddingLeft: 0, paddingRight: 0 }}
                    />
                  </Element>
                </Element>
              </div>
            </div>
          </div>
          <div className="otherInfo">
            {config.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => {
                  navigator(`/userCenter/orderList?label=${item.label}`);
                }}
                className="box navigator"
              >
                <div className="top_num">{_orderCount[item.code] || 0}</div>
                <div className="bottom_name">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*<div className="banner">*/}
      {/*    <div className="bannerImg">*/}
      {/*        <Image src={rightOne} width="232"/>*/}
      {/*    </div>*/}
      {/*    <div className="bannerImg">*/}
      {/*        <Image src={rightTwo} width="232"/>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
};
