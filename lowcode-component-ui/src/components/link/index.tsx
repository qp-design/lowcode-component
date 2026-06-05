import { fullpath } from "@brushes/component-tool";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ token, css }) => {
  return {
    link: css`
      display: flex;
      align-items: center;
      color: ${token.colorPrimary};
    `,
  };
});
export const Link = ({
  image,
  text,
  ...props
}: {
  image: { imgUrl: string; link: string };
  text: string;
  color: string;
  fontSize: number;
}) => {
  const { styles } = useStyle();
  return (
    <div className={styles.link} style={props}>
      <span className="tip">{text}</span>
      <img src={fullpath(image.imgUrl)} width="18" height="18" />
    </div>
  );
};
