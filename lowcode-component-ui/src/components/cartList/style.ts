import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, token }) => {
  return {
    title: css`
      list-style: none;
      display: grid;
      width: 100%;
      text-align: center;
      grid-template-columns: repeat(6, 1fr);
      background: #f7f8fc;
      color: #1a1a1a;
      .large {
        grid-column: 1 / 3;
      }
    `,
    wrapContent: css`
      .memberBname {
        padding: 15px 15px 0 15px;
      }
    `,
  };
});

export const useStyles2 = createStyles(({ css, token }) => {
  return {
    wrap: css`
      display: grid;
      width: 100%;
      font-size: 12px;
      background: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      align-items: center;
      text-align: center;
      grid-template-columns: repeat(6, 1fr);
      color: #333;
      &:hover {
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.04);
      }
      .large {
        padding: 20px 15px;
        grid-column: 1 / 3;
        display: grid;
        text-align: left;
        gap: 12px;
        grid-template-columns: 20px 80px 230px;
        .checkbox-item {
          margin-top: 30px;
        }
        .img-border {
          overflow: hidden;
          border: 1px solid #f3f3f3;
          border-radius: 4px;
          position: relative;
          .state-info {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            font-size: 12px;
            height: 26px;
            text-align: center;
            line-height: 26px;
            background: #ccc;
            color: #fff;
          }
        }
        .content {
          .title {
            overflow: hidden;
            max-height: 44px;
            margin-bottom: 8px;
            line-height: 22px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: #222;
            box-sizing: border-box;
            font-weight: 500;
          }
        }
      }
    `,
  };
});
