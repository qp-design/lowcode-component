import { Button, Popconfirm } from "antd";

export const StatusOperate = ({
  record,
  onClick,
  name,
  code,
}: {
  code: string;
  name?: string;
  record: any;
  onClick: (e: string, record: any) => void;
}) => {
  return (
    <Popconfirm
      title={name}
      okText={"同意"}
      cancelText={"取消"}
      description={`你确定要${name}?`}
      onConfirm={() => onClick(code, record)}
    >
      <Button type={"link"}>{name}</Button>
    </Popconfirm>
  );
};
