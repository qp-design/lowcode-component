import { Button } from "antd";

export const Button2 = ({ text, ...restProps }: { text: string }) => {
  return (
    <Button {...restProps} data-id={text}>
      {text}
    </Button>
  );
};
