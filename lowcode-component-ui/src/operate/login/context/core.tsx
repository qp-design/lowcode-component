import React, {
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
  Reducer,
} from "react";

export function makeStore<S, A>(reducer: Reducer<S, A>, initialState?: any) {
  const DispatchContext = React.createContext<Dispatch<A>>(null as any);
  const StoreContext = React.createContext<S | null>(null);

  const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [store, dispatch] = useReducer(reducer, initialState);
    return (
      <DispatchContext.Provider value={dispatch}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </DispatchContext.Provider>
    );
  };

  function useDispatchImpl() {
    return useContext(DispatchContext);
  }

  function useStore() {
    return useContext(StoreContext);
  }

  return [StoreProvider, useStore, useDispatchImpl] as any;
}
