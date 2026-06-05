import { createStyles } from "antd-style";
import { useNavigateImpl } from "@brushes/component-tool";
import { Element } from "@brushes/component-core";
import { Container, OutContainer } from "@brushes/component-core";
import { NavigatorComponent } from "../../service";
import { ButtonComponent, DividerComponent, Text } from "../../basic";

const useStyle = createStyles(({ token, css }) => {
  return {
    wrap: css`
      width: 100%;
      height: 34px;
      opacity: 1;
      background: #f4f4f4;
    `,
    container: css`
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0em;
      height: 34px;
      color: #232323;
      max-width: 1200px;
      margin: 0 auto;
      justify-content: space-between;
    `,
  };
});

export const Top: React.FC<{ menu: Array<any>; tel: string; user: string }> = ({
  tel,
  user,
  ...restProps
}) => {
  const { navigator } = useNavigateImpl();
  const { styles } = useStyle();

  const loginOut = () => {
    navigator("/login");
  };
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <Element
          canvas
          alignItems={"center"}
          flexDirection={"row"}
          is={OutContainer}
          justifyContent={"space-between"}
          id={"menu-top-wrap"}
        >
          <Element
            canvas
            alignItems={"center"}
            flexDirection={"row"}
            id={"menu-top-left"}
            is={Container}
          >
            <Text text={"您好，"} />
            <Text
              module={"rootStore"}
              storeKey={"_userInfo"}
              text="用户名"
              code={"userName"}
            ></Text>
            <Text text={"欢迎来到千匠"} />
            <DividerComponent
              margin={{ marginLeft: 8, marginRight: 8 }}
              type={"vertical"}
            />
            <ButtonComponent
              paddingLeft={0}
              paddingRight={0}
              fontSize={12}
              type={"link"}
              text="退出"
              onClick={loginOut}
            ></ButtonComponent>
          </Element>

          <Element
            canvas
            alignItems={"center"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            id={"menu-top"}
            is={Container}
          >
            {/*<Na*/}
            <NavigatorComponent
              className={"nav"}
              padding={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              menu={[
                {
                  title: "购物车",
                  path: "/car",
                  imgUrl:
                    "https://prodtyds.obs.cn-north-4.myhuaweicloud.com:443/img%2F20250331f7e7c9f325aa4b5cb8ee5c5ca828cdf8.png",
                },
                { title: "个人中心", path: "/user" },
                {
                  title: "400-990-3366",
                  imgUrl:
                    "https://prodtyds.obs.cn-north-4.myhuaweicloud.com:443/img%2F202503314f43092f8bbd4c68858fa21ef1b2fe81.png",
                },
              ]}
            />
          </Element>
        </Element>
        {/*    */}
        {/*    <div className={styles.right}>*/}
        {/*        <Element canvas id={'menu-top'} is={Container}>*/}
        {/*            /!*<Na*!/*/}
        {/*            <NavigatorComponent*/}
        {/*                menu={[*/}
        {/*                    {title: '购物车', path: '/car', imgUrl: 'https://prodtyds.obs.cn-north-4.myhuaweicloud.com:443/img%2F20250331f7e7c9f325aa4b5cb8ee5c5ca828cdf8.png'},*/}
        {/*                    {title: '个人中心', path: '/user'},*/}
        {/*                    {title: '400-990-3366', imgUrl: 'https://prodtyds.obs.cn-north-4.myhuaweicloud.com:443/img%2F202503314f43092f8bbd4c68858fa21ef1b2fe81.png'}*/}
        {/*                ]}*/}
        {/*            />*/}
        {/*        </Element>*/}
        {/*    </div>*/}
      </div>
    </div>
  );
};
