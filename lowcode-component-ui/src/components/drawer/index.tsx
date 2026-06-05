import {
  Container,
  useModuleContext,
  Element,
  useEditor,
} from "@brushes/component-core";
import { Drawer as Drawer2 } from "antd";
import { usePrevTitle } from "@brushes/component-store-web";
import { useMemo } from "react";

export const Drawer = ({
  code,
  title = "",
  ...restProps
}: {
  title?: string;
  code: string;
}) => {
  const preTitle = usePrevTitle();
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const open = useModuleContext((s) => s.moduleStore[code]);
  const storeTitle = useModuleContext((s) => s.moduleStore.title);
  const setModuleStore = useModuleContext((s) => s.setModuleStore);

  const resultTitle = useMemo(() => {
    if (storeTitle) {
      return storeTitle;
    }
    return preTitle + title;
  }, [storeTitle, title, preTitle]);

  const onClose = () => {
    setModuleStore({
      [code]: false,
    });
  };
  return (
    <Drawer2
      {...(enabled ? { getContainer: false } : {})}
      title={resultTitle}
      {...restProps}
      mask={!enabled}
      onClose={onClose}
      open={enabled || open}
    >
      <Element canvas id={"drawer"} is={Container}></Element>
    </Drawer2>
  );
};
