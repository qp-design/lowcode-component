import { Bubble, Prompts, Sender, Welcome } from "@ant-design/x";
import type { PromptsProps } from "@ant-design/x";

import React, { useMemo, useState } from "react";
import { useStyle } from "./style";
import { BulbOutlined, SyncOutlined, CopyOutlined } from "@ant-design/icons";
import "./App.css";
import { Markdown } from "./components";

import { App, Button, type GetProp, Space, theme, Typography } from "antd";
import { useAiHook } from "./hook";

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    avatar: { icon: <BulbOutlined />, style: { background: "#066adc" } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
    // avatar: { icon: <QuestionCircleOutlined />, style: { background: '#222' } },
  },
};

const placeholderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    icon: <BulbOutlined style={{ color: "#FFD700" }} />,
    label: "我想找商品",
  },
  {
    key: "2",
    icon: <BulbOutlined style={{ color: "#FFD700" }} />,
    label: "如何下单?",
  },
  {
    key: "3",
    icon: <BulbOutlined style={{ color: "#FFD700" }} />,
    label: "退换货政策?",
  },
  {
    key: "4",
    icon: <BulbOutlined style={{ color: "#FFD700" }} />,
    label: "优惠活动?",
  },
  {
    key: "5",
    icon: <BulbOutlined style={{ color: "#FFD700" }} />,
    label: "联系人工客服?",
  },
];

const Independent: React.FC = () => {
  const { styles } = useStyle();
  const [title, setTitle] = useState<string>("");
  const [placeholder, setPlaceholder] = useState("有问题尽管提问我～");
  // ==================== Style ====================
  const [hasRef, setHasRef] = React.useState(false);
  const { token } = theme.useToken();

  // ==================== State ====================

  const [content, setContent] = React.useState("");

  const { conversation_id, onRequest, loading, setMessages, abort, messages } =
    useAiHook();

  // const isDisabled = loading;

  const senderPromptsItems: GetProp<typeof Prompts, "items"> = useMemo(
    () => [
      {
        key: "openNew",
        icon: <BulbOutlined style={{ color: "#FFD700" }} />,
        description: "开启新对话",
        disabled: loading,
      },
      // {
      //     key: 'deep',
      //     icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
      //     description: '深度思考',
      //     disabled: loading,
      // },
      // {
      //     key: 'picture',
      //     icon: <RocketOutlined style={{ color: '#52C41A' }} />,
      //     description: '图片生成',
      //     disabled: loading,
      // },
    ],
    [loading],
  );

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent("");
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    switch (info.data.key) {
      case "deep":
        setTitle(info.data.description as string);
        setHasRef(true);
        setPlaceholder("我将深度思考后回答问题");
        break;
      case "picture":
        setTitle(info.data.description as string);
        setHasRef(true);
        setPlaceholder("描述你的想象的场景、风格");
        break;
      case "openNew":
        conversation_id.current = "";
        setMessages([]);
        break;
      default:
        onRequest(info.data.description as string);
        break;
    }
    setContent("");
  };

  const resetImpl = () => {
    setPlaceholder("有问题尽管提问我～");
    setHasRef(false);
  };

  const onCancel = () => {
    abort.current();
  };
  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.promot}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="您好, 我是星云QMind"
        description="在这里，分点工作给AI吧"
        // extra={
        //     <Space>
        //         <Button icon={<ShareAltOutlined />} />
        //         <Button icon={<EllipsisOutlined />} />
        //     </Space>
        // }
      />
      <Prompts
        title="快速咨询?"
        wrap
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: "none",
            // width: '100%',
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => {
      return {
        key: id,
        // loading: status === 'loading',
        role: status === "local" ? "local" : "ai",
        content: <Markdown content={message} />,
        footer:
          status === "local" ? null : (
            <Space size={token.paddingXXS}>
              <Button
                onClick={() => {
                  const i = messages.findIndex((item) => item.id === id);
                  const info = messages[i - 1].message;
                  onSubmit(info);
                }}
                color="default"
                variant="text"
                size="small"
                icon={<SyncOutlined />}
              />
              {/*<p>Link: [营销服务平台](https://appshop.saas.qjclouds.com)</p>*/}
              <Button
                onClick={async () => {
                  try {
                    const m = message.replace(/\n+/g, "");
                    await navigator.clipboard.writeText(m);
                  } catch (err) {
                    console.error("复制失败", err);
                  }
                }}
                color="default"
                variant="text"
                size="small"
                icon={<CopyOutlined />}
              />
            </Space>
          ),
      };
    },
  );

  const headerNode = (
    <Sender.Header
      open={hasRef}
      title={
        <Space>
          <BulbOutlined style={{ color: "#FFD700" }} />
          <Typography.Text type="secondary">{title}</Typography.Text>
        </Space>
      }
      onOpenChange={resetImpl}
    />
  );

  // ==================== Render =================
  return (
    <div className={"ai"}>
      <App>
        <div className={styles.layout}>
          <div className={styles.chat}>
            {/* 🌟 消息列表 */}

            <Bubble.List
              items={
                items.length > 0
                  ? items
                  : [{ content: placeholderNode, variant: "borderless" }]
              }
              roles={roles}
              className={styles.messages}
            />
            {/* 🌟 提示词 */}
            {!hasRef && (
              <Prompts
                items={senderPromptsItems}
                onItemClick={onPromptsItemClick}
              />
            )}
            {/* 🌟 输入框 */}
            <Sender
              placeholder={placeholder}
              header={headerNode}
              allowSpeech={true}
              value={content}
              onCancel={onCancel}
              onSubmit={onSubmit}
              onChange={setContent}
              // prefix={attachmentsNode}
              loading={loading}
              className={styles.sender}
            />
            <Space direction="vertical" size={12} align={"center"}>
              内容由 AI 生成，请仔细甄别
            </Space>
          </div>
        </div>
      </App>
    </div>
  );
};

export default Independent;
