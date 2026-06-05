// import { flow } from 'lodash-es'
// import ReactMarkdown from 'react-markdown'
// import RemarkMath from 'remark-math'
// import RemarkBreaks from 'remark-breaks'
// import RehypeKatex from 'rehype-katex'
// import RemarkGfm from 'remark-gfm'
// import RehypeRaw from 'rehype-raw'
// import {Component, memo, useMemo, useState} from "react";
// import ReactEcharts from "echarts-for-react";
// import cn from './class.ts'
// import SyntaxHighlighter from 'react-syntax-highlighter'
// import {
//   atelierHeathLight,
// } from 'react-syntax-highlighter/dist/esm/styles/hljs'
//
// const capitalizationLanguageNameMap: Record<string, string> = {
//   sql: 'SQL',
//   javascript: 'JavaScript',
//   java: 'Java',
//   typescript: 'TypeScript',
//   vbscript: 'VBScript',
//   css: 'CSS',
//   html: 'HTML',
//   xml: 'XML',
//   php: 'PHP',
//   python: 'Python',
//   yaml: 'Yaml',
//   mermaid: 'Mermaid',
//   markdown: 'MarkDown',
//   makefile: 'MakeFile',
//   echarts: 'ECharts',
//   shell: 'Shell',
//   powershell: 'PowerShell',
//   json: 'JSON',
//   latex: 'Latex',
//   svg: 'SVG',
//   abc: 'ABC',
// }
//
// export default class ErrorBoundary extends Component {
//   constructor(props: any) {
//     super(props)
//     this.state = { hasError: false }
//   }
//
//   componentDidCatch(error: any, errorInfo: any) {
//     this.setState({ hasError: true })
//     console.error(error, errorInfo)
//   }
//
//   render() {
//     // eslint-disable-next-line ts/ban-ts-comment
//     // @ts-expect-error
//     if (this.state.hasError)
//       return <div>Oops! An error occurred. This could be due to an ECharts runtime error or invalid SVG content. <br />(see the browser console for more information)</div>
//     // eslint-disable-next-line ts/ban-ts-comment
//     // @ts-expect-error
//     return this.props.children
//   }
// }
//
// const preprocessLaTeX = (content: string) => {
//     if (typeof content !== 'string')
//         return content
//
//     const codeBlockRegex = /```[\s\S]*?```/g
//     const codeBlocks = content.match(codeBlockRegex) || []
//     let processedContent = content.replace(codeBlockRegex, 'CODE_BLOCK_PLACEHOLDER')
//
//     processedContent = flow([
//         (str: string) => str.replace(/\\\[(.*?)\\\]/g, (_, equation) => `$$${equation}$$`),
//         (str: string) => str.replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`),
//         (str: string) => str.replace(/\\\((.*?)\\\)/g, (_, equation) => `$$${equation}$$`),
//         (str: string) => str.replace(/(^|[^\\])\$(.+?)\$/g, (_, prefix, equation) => `${prefix}$${equation}$`),
//     ])(processedContent)
//
//     codeBlocks.forEach((block) => {
//         processedContent = processedContent.replace('CODE_BLOCK_PLACEHOLDER', block)
//     })
//
//     return processedContent
// }
//
// const preprocessThinkTag = (content: string) => {
//     const thinkOpenTagRegex = /<think>\n/g
//     const thinkCloseTagRegex = /\n<\/think>/g
//     return flow([
//         (str: string) => str.replace(thinkOpenTagRegex, '<details data-think=true>\n'),
//         (str: string) => str.replace(thinkCloseTagRegex, '\n[ENDTHINKFLAG]</details>'),
//     ])(content)
// }
//
// const getCorrectCapitalizationLanguageName = (language: string) => {
//   if (!language)
//     return 'Plain'
//
//   if (language in capitalizationLanguageNameMap)
//     return capitalizationLanguageNameMap[language]
//
//   return language.charAt(0).toUpperCase() + language.substring(1)
// }
//
// const CodeBlock: any = memo(({ inline, className, children = '', ...props }: any) => {
//     const [isSVG, setIsSVG] = useState(true)
//     const match = /language-(\w+)/.exec(className || '')
//     const language = match?.[1]
//     const languageShowName = getCorrectCapitalizationLanguageName(language || '')
//     const chartData = useMemo(() => {
//         if (language === 'echarts') {
//             try {
//                 return JSON.parse(String(children).replace(/\n$/, ''))
//             }
//             catch { }
//         }
//         return JSON.parse('{"title":{"text":"ECharts error - Wrong JSON format."}}')
//     }, [language, children])
//
//     const renderCodeContent = useMemo(() => {
//         const content = String(children).replace(/\n$/, '')
//         switch (language) {
//             // case 'mermaid':
//             //     if (isSVG)
//             //         return <Flowchart PrimitiveCode={content} />
//             //     break
//             case 'echarts':
//                 return (
//                     <div style={{ minHeight: '350px', minWidth: '100%', overflowX: 'scroll' }}>
//                         <ErrorBoundary>
//                             <ReactEcharts option={chartData} style={{ minWidth: '700px' }} />
//                         </ErrorBoundary>
//                     </div>
//                 )
//             // case 'svg':
//             //     if (isSVG) {
//             //         return (
//             //             <ErrorBoundary>
//             //                 <SVGRenderer content={content} />
//             //             </ErrorBoundary>
//             //         )
//             //     }
//             //     break
//             // case 'abc':
//             //     return (
//             //         <ErrorBoundary>
//             //             <MarkdownMusic children={content} />
//             //         </ErrorBoundary>
//             //     )
//             default:
//                 return (
//                     <SyntaxHighlighter
//                         {...props}
//                         style={atelierHeathLight}
//                         customStyle={{
//                             paddingLeft: 12,
//                             borderBottomLeftRadius: '10px',
//                             borderBottomRightRadius: '10px',
//                             backgroundColor: 'var(--color-components-input-bg-normal)',
//                         }}
//                         language={match?.[1]}
//                         showLineNumbers
//                         PreTag="div"
//                     >
//                         {content}
//                     </SyntaxHighlighter>
//                 )
//         }
//     }, [children, language, isSVG, chartData, props, match])
//
//     if (inline || !match)
//         return <code {...props} className={className}>{children}</code>
//
//     return (
//         <div className='relative'>
//             <div className='flex h-8 items-center justify-between rounded-t-[10px] border-b border-divider-subtle bg-components-input-bg-normal p-1 pl-3'>
//                 <div className='system-xs-semibold-uppercase text-text-secondary'>{languageShowName}</div>
//                 <div className='flex items-center gap-1'>
//                     {/*{(['mermaid', 'svg']).includes(language!) && <SVGBtn isSVG={isSVG} setIsSVG={setIsSVG} />}*/}
//                     {/*<ActionButton>*/}
//                     {/*    <CopyIcon content={String(children).replace(/\n$/, '')} />*/}
//                     {/*</ActionButton>*/}
//                 </div>
//             </div>
//             {renderCodeContent}
//         </div>
//     )
// })
// CodeBlock.displayName = 'CodeBlock'
//
// export function Markdown(props: { content: string; className?: string; customDisallowedElements?: string[] }) {
//     const latexContent = flow([
//         preprocessThinkTag,
//         preprocessLaTeX,
//     ])(props.content)
//
//     return (
//         <div className={cn('markdown-body', '!text-text-primary', props.className)}>
//             <ReactMarkdown
//                 remarkPlugins={[
//                     RemarkGfm,
//                     [RemarkMath, { singleDollarTextMath: false }],
//                     RemarkBreaks,
//                 ]}
//                 rehypePlugins={[
//                     RehypeKatex,
//                     RehypeRaw as any,
//                     // The Rehype plug-in is used to remove the ref attribute of an element
//                     () => {
//                         return (tree) => {
//                             const iterate = (node: any) => {
//                                 if (node.type === 'element' && node.properties?.ref)
//                                     delete node.properties.ref
//
//                                 if (node.type === 'element' && !/^[a-z][a-z0-9]*$/i.test(node.tagName)) {
//                                     node.type = 'text'
//                                     node.value = `<${node.tagName}`
//                                 }
//
//                                 if (node.children)
//                                     node.children.forEach(iterate)
//                             }
//                             tree.children.forEach(iterate)
//                         }
//                     },
//                 ]}
//                 disallowedElements={['iframe', 'head', 'html', 'meta', 'link', 'style', 'body', ...(props.customDisallowedElements || [])]}
//                 components={{
//                     code: CodeBlock,
//                 }}
//             >
//                 {/* Markdown detect has problem. */}
//                 {latexContent}
//             </ReactMarkdown>
//         </div>
//     )
// }
