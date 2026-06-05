import { makeStore } from "./core";

type Types = "open" | "close";

function openReducer(baseState: {}, action: { type: Types; payload: object }) {
  switch (action.type) {
    case "open":
      return { visible: true, ...action.payload };
    case "close":
      return { ...baseState, visible: false, ...action.payload };
    default:
      throw new Error();
  }
}

const [OpenProvider, useOpenValues, useOpenDispatch] = makeStore(openReducer, {
  textInfo: "注册新账户",
  buttonText: "登录",
});

export default { OpenProvider, useOpenValues, useOpenDispatch };
