import { dynamicFormFields } from '@/components/dynamicFormFields';
import { FieldType, NamePath } from '@/components/types';
import { Form, Space, FormInstance, Button } from 'antd';
import { QjIcon } from '@brushes/share-resource';

export default function FormListField({
  innerForm = [],
  name: formName,
  form,
  RemoveJsx,
  AddJsx,
  ...restProps
}: {
  form: FormInstance;
  name: NamePath;
  innerForm?: Array<FieldType>;
  RemoveJsx?: any;
  AddJsx?: any;
}) {
  return (
    <Form.List name={formName}>
      {(fields, { add, remove }, { errors }) => {
        return (
          <>
            {fields.map(({ key, name }) => (
              <Space key={key} {...restProps}>
                {dynamicFormFields(innerForm, form, name)}
                {RemoveJsx ? (
                  <RemoveJsx remove={() => remove(name)} />
                ) : (
                  <Button
                    onClick={() => remove(name)}
                    size={'small'}
                    shape="circle"
                    icon={
                      <QjIcon
                        style={{ fontSize: 14, fontWeight: 500, color: '#aaa' }}
                        name={'icon-jianqu'}
                      />
                    }
                  />
                )}
              </Space>
            ))}
            {AddJsx ? (
              <AddJsx add={() => add()} />
            ) : (
              <Button
                onClick={() => add()}
                size={'small'}
                shape="circle"
                icon={
                  <QjIcon
                    style={{ fontSize: 14, fontWeight: 500, color: '#aaa' }}
                    name={'icon-zengjia'}
                  />
                }
              />
            )}
            <Form.ErrorList errors={errors} />
          </>
        );
      }}
    </Form.List>
  );
}
