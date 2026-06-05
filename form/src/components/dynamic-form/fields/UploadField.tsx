import { Upload, Button, FormInstance } from 'antd';
import type { UploadFile } from 'antd';
import { NamePath } from '@/components/types/formField';
import { isFunction } from 'lodash';
import { QjIcon } from '@brushes/share-resource';
import { useMemo } from 'react';

export default function UploadField({
  name,
  form,
  maxCount = 1,
  text,
  disabled,
  prefixicon,
  suffixicon,
  fileList,
  uid = 'uid',
  urlName = 'name',
  url = 'url',
  ...extraProps
}: {
  name: NamePath;
  url?: string;
  uid?: string;
  urlName?: string;
  fileList: Array<any> | string;
  maxCount?: number;
  prefixicon?: any;
  suffixicon?: any;
  form: FormInstance;
  text?: string;
  disabled: boolean;
}) {
  const isDisabled =
    (form.getFieldValue(name) || []).length >= maxCount || disabled;
  // @ts-ignore
  const type = extraProps.listType;

  const newFileList = useMemo(() => {
    if (Array.isArray(fileList)) {
      return fileList.map((item) => {
        if (item.hasOwnProperty('originFileObj') || item.url) {
          return item;
        }
        return {
          url: item[url],
          name: item[urlName],
          uid: item[uid]
        };
      });
    } else if (fileList) {
      return [
        {
          uid: new Date().getTime(),
          name: fileList,
          url: fileList
        }
      ];
    }
    return [];
  }, [fileList]) as UploadFile[];
  return (
    <>
      {isFunction(prefixicon) ? prefixicon(form) : prefixicon}
      <Upload
        disabled={disabled}
        maxCount={maxCount}
        fileList={newFileList}
        {...extraProps}
        beforeUpload={() => false}
      >
        {type === 'picture-card' ? (
          !isDisabled && `+ ${text}`
        ) : (
          <Button
            disabled={isDisabled}
            icon={
              <QjIcon
                style={{ fontSize: 16, fontWeight: 500 }}
                name={'icon-zengjia'}
              />
            }
          >
            {text}
          </Button>
        )}
      </Upload>
      {isFunction(suffixicon) ? suffixicon(form) : suffixicon}
    </>
  );
}
