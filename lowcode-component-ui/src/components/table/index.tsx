// import { Table as Table2} from 'antd';
// import type {ColumnsType} from 'antd/es/table';
// import {useModuleContext} from "@brushes/component-core";
// import {useMemo} from "react";
//
// const dataSource = [
//     {
//         key: '1',
//         name: '胡彦斌',
//         age: 32,
//         address: '西湖区湖底公园1号',
//     },
//     {
//         key: '2',
//         name: '胡彦祖',
//         age: 42,
//         address: '西湖区湖底公园1号',
//     },
// ];
//
// const columns = [
//     {
//         title: '价格',
//         dataIndex: 'age',
//         key: 'age',
//     },
//     {
//         title: '数量',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: '库存',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: '商品编码',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: '商品条码',
//         dataIndex: 'address',
//         key: 'address',
//     },
//     {
//         title: '起订量',
//         dataIndex: 'address',
//         key: 'address',
//     },
// ];
//
// export const Table = ({columns}: {columns: ColumnsType<any>}) => {
//     const { selectSku = {} } = useModuleContext(s => s.moduleStore);
//     console.log(56, selectSku);
//     return (
//         <Table2 pagination={false} dataSource={[selectSku]} columns={columns} />
//     )
// }
