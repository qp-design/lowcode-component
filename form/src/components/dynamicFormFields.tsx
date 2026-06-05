//@ts-nocheck
import { FieldType, NamePath } from '@/components/types';
import { Form, FormInstance } from 'antd';
import { get, isUndefined } from 'lodash';
import { FieldTypeComponent } from './common';

export function dynamicFormFields(
  fields: Array<FieldType>,
  form: FormInstance,
  indx?: number
) {
  return fields.map((rootItem, idx: number) => {
    const {
      name: transformName,
      type,
      extraProps = {},
      calIsVisible = () => true,
      ...rest
    }: FieldType = typeof rootItem === 'function' ? rootItem(form) : rootItem;
    const {
      dependencies,
      shouldUpdate = (prevValues: any, curValues: any) => false,
      ...extraPropsRest
    } = extraProps;
    const inObj = isUndefined(dependencies)
      ? { shouldUpdate }
      : { dependencies };
    const FormItem = Form.Item;
    let name = (
      isUndefined(indx) ? transformName : [indx + ''].concat(transformName)
    ) as NamePath;

    const formItemProps: { [k: string]: unknown } = {
      name,
      type,
      valuePropName: ['checkbox', 'switch'].includes(type)
        ? 'checked'
        : 'value',
      ...rest
    };
    if (type === 'upload') {
      formItemProps.valuePropName = 'fileList';
      formItemProps.getValueFromEvent = (e: any) => {
        return e.fileList;
      };
    }
    const FieldComponent = get(
      FieldTypeComponent,
      type,
      FieldTypeComponent.text
    );
    return (
      <FormItem {...inObj} key={(name || idx).toString()} noStyle>
        {() =>
          calIsVisible(form) ? (
            <FormItem
              style={{
                marginBottom: ['slot'].includes(type) ? 0 : 24
              }}
              {...(['formList', 'extend'].includes(type)
                ? { label: formItemProps.label }
                : formItemProps)}
              noStyle={['extend'].includes(type)}
            >
              <FieldComponent
                dependencies={dependencies}
                form={form}
                name={name}
                {...extraPropsRest}
              />
            </FormItem>
          ) : null
        }
      </FormItem>
    );
  });
}
