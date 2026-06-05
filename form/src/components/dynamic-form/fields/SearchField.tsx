import { Input } from 'antd';

const { Search } = Input;

export default function SearchField({ ...extraProps }) {
  return <Search {...extraProps} />;
}
