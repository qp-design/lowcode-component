import { createStyles } from "antd-style";

export const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      //min-width: 100vw;
      height: calc(100vh - 100px);
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      //max-width: 100vw;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingSM}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    sender: css`
      .ant-btn-variant-solid {
        background: #1677ff;
      }
      box-shadow: ${token.boxShadow};
    `,
    promot: css`
      width: calc(100%);
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 12px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});
