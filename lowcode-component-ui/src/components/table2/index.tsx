// import {ApplicationContext, Container} from '@brushes/component-core';
// import React, {useMemo} from 'react';
// import {Table} from 'antd';
// import type {ColumnsType} from 'antd/es/table';
// import {get, isEmpty} from 'lodash';
// import {useStore} from '@brushes/component-store-web';
// import {Element, useEditor} from '@brushes/component-core';
// import {has} from 'lodash';
//
// export const Table2: React.FC<{
//     rowKey: string;
//     columns: ColumnsType<any>;
// }> = ({columns = [], rowKey = 'id', ...restProps}) => {
//         const [queryApi] = useStore(store => store['queryApi']);
//
//         return (
//             <>
//                 {
//                     !isEmpty(columns) && queryApi ?
//                         <TableCom queryApi={queryApi} rowKey={rowKey} columns={columns} {...restProps}/>
//                         :
//                         <Table columns={columns} dataSource={[]}/>
//                 }
//             </>
//         )
//     };
//
// const TableCom =
//     ({columns, queryApi, rowKey = 'id', ...restProps}: {
//         queryApi: string;
//         rowKey: string;
//         columns: ColumnsType<any>;
//     }) => {
//         const data = {}
//         const {isEnabled} = useEditor(state => ({
//             isEnabled: state.options.enabled
//         }));
//
//         const list = useMemo(() => {
//             const dataList = get(data, 'list', []);
//             if(isEnabled && !isEmpty(dataList)) {
//                 return [dataList[0]]
//             }
//             return dataList
//         }, [data]);
//
//         const resultColunms = useMemo(() => {
//             return columns.map(item => {
//                 const isSlot = has(item, 'type');
//                 if (isSlot) {
//                     return {
//                         ...item,
//                         render(_, context, idx) {
//                             return (
//                                 <ApplicationContext value={context}>
//                                     <Element
//                                         canvas
//                                         id={item.key}
//                                         custom={{
//                                             key: idx,
//                                         }}
//                                         is={Container}
//                                     >
//                                     </Element>
//                                 </ApplicationContext>
//                             )
//                         }
//                     }
//                 }
//                 return item;
//             })
//         }, [columns])
//
//         return (
//             <Table
//                 pagination={{total: 0}}
//                 rowKey={rowKey}
//                 columns={resultColunms}
//                 dataSource={list}
//                 onChange={() => {}}
//                 {...restProps}/>
//         )
//     }
