import React, { useMemo } from "react";
import { Container } from "@brushes/component-core";
import { Element } from "@brushes/component-core";

export const ListCommon: React.FC<{
  gap: number;
  num: number;
  data: Array<any>;
}> = ({ gap, num, data }) => {
  const result = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    return data.split(",");
  }, [data]);
  return (
    <div
      style={{
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(${num}, 1fr)`,
      }}
    >
      {result.map((item: any, index: number) => (
        <Element
          key={index}
          canvas
          id={index + ""}
          custom={{
            key: index,
          }}
          is={Container}
        ></Element>
      ))}
    </div>
  );
};
