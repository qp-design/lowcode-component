import ts from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'api-index',
      dir: 'dist',
    }
  ],
  external: ['antd', 'react', 'react/jsx-runtime', 'lodash-es', '@brushes/share-resource', 'dayjs', 'antd/es/date-picker/locale/zh_CN', 'dayjs/locale/zh-cn'],
  plugins: [
    ts({}),
    terser(),
  ]
};
