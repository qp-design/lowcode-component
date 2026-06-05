import TableComponent from "./config/table";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useModuleContext } from "@brushes/component-core";

const TableComplex = ({
  giftSelect,
  columns,
}: {
  giftSelect: boolean;
  columns: Array<any>;
}) => {
  const form = useModuleContext((s) => s.moduleStore.form);
  const onChange = useModuleContext((s) => s.moduleStore.onChange);
  return (
    <TableComponent
      columns={columns}
      giftSelect={giftSelect}
      onChange={onChange}
      form={form}
    />
  );
};
export const RefundTableComponent = HOCCodeWrapComponent(TableComplex);
