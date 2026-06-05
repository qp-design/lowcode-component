import { DefaultJsx, useModuleContext } from "@brushes/component-core";
import { useMemo } from "react";
import { useEditor } from "@brushes/component-core";

export const RichText = ({
  code,
  storeKey = "defaultValue",
}: {
  storeKey?: string;
  code: string;
}) => {
  const defaultValue = useModuleContext((s) => s.moduleStore[storeKey]) || {};

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const html = useMemo(() => {
    // @ts-ignore
    return defaultValue[code];
  }, [defaultValue, code]);

  return (
    <>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      ) : enabled ? (
        <DefaultJsx />
      ) : (
        ""
      )}
    </>
  );
};
