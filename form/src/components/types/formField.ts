import { FormInstance, ButtonProps } from 'antd';
import { ReactNode } from 'react';
type formType =
  | 'formList'
  | 'extend'
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'rate'
  | 'select'
  | 'opt'
  | 'password'
  | 'radioGroup'
  | 'checkboxGroup'
  | 'complex'
  | 'range'
  | 'date'
  | 'cascader'
  | 'cascaderComplex'
  | 'innerForm'
  | 'upload'
  | 'mention'
  | 'switch'
  | 'color'
  | 'slot';

export type callResolver = (msg?: string | any) => void;
export type submitType<T = any> = [T, callResolver, callResolver];
export type submitFunType<T = any> = (
  value: T,
  suc: callResolver,
  error: callResolver
) => void;
export type NamePath = string | number | (string | number)[];

export type FieldType = FieldTypeObj | ((form: FormInstance) => FieldTypeObj);

interface FieldTypeObj {
  name: string | number | (string | number)[];
  noStyle?: boolean;
  colon?: boolean;
  type: formType;
  label?: ReactNode;
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  calIsVisible?: (form: FormInstance) => boolean;
  rules?: Array<
    { required?: boolean; message?: string; pattern?: RegExp } | any
  >;
  initialValue?: string | number | boolean | Array<string | number>;
  readOnly?: boolean;
  minLength?: number;
  hidden?: boolean; //是否隐藏字段
  loading?: boolean;
  layout?: 'horizontal' | 'vertical';
  extraProps?: {
    dependencies?: NamePath[]; // 如果依赖多个值 需要明确哪个依赖更新数据值  可以使用dependencySingle  特殊情况   一般不用到
    dependencySingle?: NamePath[];
    options?:
      | Array<{ [v: string]: string | number | ReactNode }>
      | ((
          e: any
        ) =>
          | Promise<any>
          | Array<{ [v: string]: string | number | ReactNode }>);
    uid?: string | 'uid'; //upload
    url?: string | 'url'; //upload
    urlName?: string | 'name'; //upload
    shouldUpdate?: (prevValue: any, curValue: any) => boolean;
    [k: string]: unknown;
    placeholder?: string;
    fieldNames?: {
      label?: string;
      value?: string;
      children?: string;
    };
    render?: ({
      name,
      form,
      onChange,
      ...rest
    }: {
      name: NamePath;
      onChange: (value: any) => void;
      form: FormInstance;
    }) => ReactNode;
  };
  style?: { [k: string]: unknown };
}

export interface TransformType {
  from: string;
  to: string;
  format: (preValue: any, value: any) => any;
  isDelete?: boolean; // 原字段是否保留: true删除
}

export interface Action extends ButtonProps {
  key: string;
  name: string;
  callback: Function;
  isNeedValidate?: boolean;
  [v: string]: unknown;
}
