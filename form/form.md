# @brushes/form v3.0.44 — 项目分析

## 项目定位

基于 **React 18 + Ant Design 5 + TypeScript** 的动态表单组件库（npm 包）。核心功能是通过声明式 JSON 配置来渲染表单，无需手写 JSX。

## 技术栈

| 技术 | 用途 |
|---|---|
| React 18 | UI 框架 |
| TypeScript 5.9 | 类型系统 |
| Ant Design 5.6 | UI 组件库 |
| Rollup | 打包构建 |
| dayjs | 日期处理 |
| lodash | 工具函数 |
| yarn | 包管理 |

## 目录结构

```
form/
├── src/
│   ├── index.ts                          # 入口，集中导出
│   ├── util/                             # 通用 hooks
│   │   ├── useImmutableCallback.ts       # 稳定引用回调
│   │   └── useMountedRef.ts              # 组件挂载状态追踪
│   └── components/
│       ├── index.tsx                     # DynamicForm、NoFormDynamic、FormWithValidate
│       ├── common.ts                     # type → 组件映射注册表
│       ├── dynamicFormFields.tsx         # 核心渲染器：配置 → Form.Item
│       ├── types/
│       │   ├── index.ts
│       │   └── formField.ts             # FieldType、Action、TransformType 等类型
│       ├── hooks/
│       │   ├── formHook.ts              # 表单生命周期（提交、重置、加载态）
│       │   └── useDataComputed.ts       # 提交数据转换管道
│       └── dynamic-form/fields/         # 21 个字段组件
│           ├── InputField.tsx            # text
│           ├── TextAreaField.tsx         # textarea
│           ├── NumberField.tsx           # number
│           ├── InputPassword.tsx         # password
│           ├── InputOptField.tsx         # opt
│           ├── SearchField.tsx           # search
│           ├── SelectField.tsx           # select
│           ├── CheckboxField.tsx         # checkbox
│           ├── CheckboxGroupField.tsx    # checkboxGroup
│           ├── RadioGroupField.tsx       # radioGroup
│           ├── SwitchField.tsx           # switch
│           ├── Rate.tsx                  # rate
│           ├── DatePickerField.tsx       # date
│           ├── RangePickerField.tsx      # range
│           ├── CascaderField.tsx         # cascader
│           ├── CascaderFieldComplex.tsx  # cascaderComplex
│           ├── UploadField.tsx           # upload
│           ├── MentionsField.tsx         # mention
│           ├── ColorPicker.tsx           # color
│           ├── SlotField.tsx             # slot
│           ├── FormListField.tsx         # formList
│           └── ComplexFields.tsx         # complex
├── dist/                                 # 构建产物
├── rollup.config.js
├── tsconfig.json
├── package.json
└── yarn.lock
```

## 核心组件

### DynamicForm
主组件，接收 `fields` 配置数组 + 标准 FormProps，自动渲染完整表单。提供：
- **保存/重置** 按钮（可自定义文案）
- **自定义操作按钮** (`otherAction`)
- **提交数据转换** (`transformSubmitDataConfig`)
- **加载态** 支持（提交按钮 + 单个操作按钮）

### NoFormDynamic
不含外层 `<Form>` 的字段渲染器，适合嵌入已有表单中使用。

### FormWithValidate
基于 Ant Design `ConfigProvider` 封装，提供中文校验提示（如 `'${label}不能为空'`）。

## 21 种字段类型注册机制

`common.ts` 维护一个 `FieldTypeComponent` 对象，将 type 字符串映射到对应 React 组件：

```ts
const FieldTypeComponent = {
  text: InputField,
  textarea: TextAreaField,
  number: NumberField,
  password: InputPasswordField,
  opt: InputOptField,
  search: SearchField,
  select: SelectField,
  checkbox: CheckboxField,
  checkboxGroup: CheckboxGroupField,
  radioGroup: RadioGroupField,
  switch: SwitchField,
  rate: RateField,
  date: DatePickerField,
  range: RangePickerField,
  cascader: CascaderField,
  cascaderComplex: CascaderFieldComplex,
  upload: UploadField,
  mention: MentionsField,
  color: ColorPicker,
  slot: SlotField,
  extend: SlotField,  // extend 和 slot 相同
  formList: FormListField,
  complex: ComplexFields,
}
```

## 核心数据流

```
用户填写表单
  ↓
点击提交 → form.validateFields()
  ↓
useFormImpl.onFinish(validatedValues)
  ↓
useDataComputed 执行数据转换管道 (transformSubmitDataConfig)
  - 支持字段复制、映射、删除等操作
  ↓
调用用户传入的 onSubmit(transformedValues, resolve, reject)
  - resolve: 提交成功，重置 loading
  - reject: 提交失败，重置 loading
```

## 关键类型定义

### FieldType
```ts
interface FieldType {
  name: string;           // 字段名
  type: string;           // 字段类型（对应 FieldTypeComponent 的 key）
  label: string;          // 标签
  rules?: Rule[];         // 校验规则
  props?: Record<string, any>;  // 传给字段组件的额外属性
  visible?: boolean | ((values: any) => boolean);  // 条件显示
  // ...更多配置
}
```

### Action
```ts
interface Action {
  key: string;
  name: string;
  callback: (form: FormInstance) => void | Promise<void>;
  isNeedValidate?: boolean;  // 是否需要先校验
}
```

### TransformType
```ts
interface TransformType {
  key: string;        // 目标字段
  originKey: string;  // 源字段
  isDelete?: boolean; // 是否删除源字段
}
```

## 值得关注的问题

1. **无测试覆盖** — 没有任何单元测试、集成测试或 Storybook
2. **类型安全问题** — 3 个文件使用了 `@ts-nocheck` 跳过类型检查：
   - `src/components/dynamicFormFields.tsx`
   - `src/components/dynamic-form/fields/RangePickerField.tsx`
   - `src/components/dynamic-form/fields/CascaderFieldComplex.tsx`
3. **内部依赖** — 依赖 `@brushes/share-resource` 中的 `QjIcon` 图标组件
4. **v3 迁移残留** — README 提到 Select 组件去掉了 `optionsName`/`optionsKey`，但 `SelectField.tsx` 中仍有相关逻辑残留
5. **语言** — 注释、校验提示均为中文，面向国内团队
