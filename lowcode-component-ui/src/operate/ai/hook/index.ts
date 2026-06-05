import { useXAgent, useXChat } from "@ant-design/x";
import React, { useRef, useState } from "react";
import { XStream } from "@ant-design/x";

interface UseAiHookReturn {
  onRequest: (message: string) => void;
  messages: any[];
  setMessages: (messages: any[] | ((prev: any[]) => any[])) => void;
  agent: any;
  loading: boolean;
  abort: React.MutableRefObject<() => void>;
  conversation_id: React.MutableRefObject<string>;
}

export const useAiHook = (): UseAiHookReturn => {
  const abort = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const conversation_id = useRef("");
  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      setLoading(true);
      const { message } = info;
      const { onSuccess, onUpdate } = callbacks;
      // current message
      // console.log('message', message);
      // history messages
      // console.log('messages', messages);

      let content: string = "";

      try {
        const user = JSON.parse(sessionStorage.getItem("user-info") || "{}");
        const proappEnvLayout = JSON.parse(
          sessionStorage.getItem("proappEnvLayout") || "{}",
        );
        const controller = new AbortController();
        const stream = await fetch("/v1/chat-messages", {
          method: "POST",
          signal: controller.signal,
          // 'Bearer app-D9ttILKXYsnBKYj0UaxgE9QP'
          // `Bearer ${proappEnvLayout.proappRemark}`
          headers: {
            Authorization: `Bearer ${proappEnvLayout.proappRemark}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response_mode: "streaming",
            user: user.userName,
            query: message,
            conversation_id: conversation_id.current,
            inputs: {
              proappcode: proappEnvLayout.proappCode,
              channelcode: proappEnvLayout.channelCode,
              tenantcode: proappEnvLayout.tenantCode,
              ticketTokenid: sessionStorage.getItem("saas-token"),
              domain: location.origin,
              role: "自动选择",
            },
          }),
        });
        abort.current = () => {
          setLoading(false);
          controller.abort();
          // stream.controller.abort()
        };

        for await (const chunk of XStream({
          readableStream: stream.body as any,
        })) {
          try {
            const result = JSON.parse(chunk.data);
            conversation_id.current = result.conversation_id;
            if (result.event === "message") {
              content += result.answer || "";
              onUpdate(content as any);
            }
          } catch (err) {
            console.error("Error parsing stream data:", err);
          }
        }

        onSuccess(content as any);
        setLoading(false);
      } catch (error) {
        console.log(71, error);
        setLoading(false);
        // handle error
        // onError();
      }
    },
  });

  const {
    // use to send message
    onRequest,
    setMessages,
    // use to render messages
    messages,
  } = useXChat({ agent });

  return {
    onRequest,
    messages,
    setMessages,
    agent,
    loading,
    abort,
    conversation_id,
  };
};
