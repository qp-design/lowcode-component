import { createStyles } from "antd-style";
import { Element } from "@brushes/component-core";
import { Container } from "@brushes/component-core";
import { CarBadge, SearchComponent } from "../../service";
import { ImageComponent } from "../../basic";

const useStyle = createStyles(
  (
    { token, css },
    {
      logoWidth = 220,
      buttonWidth = 130,
    }: { logoWidth: number; buttonWidth: number },
  ) => {
    return {
      headerScoped: css`
        width: 100%;
        margin: 40px auto 0;
        display: grid;
        grid-column-gap: 32px;
        grid-template-columns: ${logoWidth}px 1fr ${buttonWidth}px;
        .logo {
          cursor: pointer;
        }
      `,
    };
  },
);

export const LogoWithSearch: React.FC<{
  logo: { imgUrl: string };
  logoWidth: number;
  buttonWidth: number;
  car: { imgUrl: string };
  tel: string;
  loginOut: () => void;
  count: number;
  user: string;
}> = ({
  tel,
  logoWidth,
  buttonWidth,
  loginOut,
  user,
  logo = {},
  car = {},
  count = [],
  ...restProps
}) => {
  // const { navigator } = useNavigateImpl();
  const { styles } = useStyle({ logoWidth, buttonWidth });
  return (
    <div className={styles.headerScoped}>
      <Element canvas is={Container} id={"car-search-logo"}>
        <ImageComponent
          width={219}
          height={60}
          image={{
            imgUrl:
              "/paas/shop/728243877368496147//c52a2b0171ce4601b4835402c042d8b6.png",
            path: "/home",
          }}
        />
      </Element>
      <Element canvas is={Container} id={"car-search"}>
        <SearchComponent />
      </Element>
      <Element canvas is={Container} id={"car-badge"}>
        <CarBadge width={buttonWidth} car={car} />
      </Element>
    </div>
  );
};
