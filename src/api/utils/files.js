import { getModeler } from "@/api/bpmn-utils/BpmnDesignerUtils";
/**
 * @description 根据所需类型进行转码并返回下载地址 
 * @param { string }   type 文件类型
 * @param { string }   filename 文件名称
 * @param { object }   data 文件数据对象
 * */
export function setEncoded(type, filename, data) {
  const encodedData = encodeURIComponent(data);
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
    data: data
  };
}

/**
 * @description 文件下载方法 
 * @param { string }   href 链接
 * @param { string }   filename 文件名称
 * */
export function downloadFile(href, filename) {
  if (href && filename) {
    const a = document.createElement("a");
    a.download = filename;       // 指定下载的文件名
    a.href = href;               // URL对象
    a.click();                   // 模拟点击
    URL.revokeObjectURL(a.href); // 释放URL 对象
  }
}

/**
 * @description 文件下载
 * @param {*} type 
 * @param {*} name 
 * @returns 
 */
export async function downloadProcess(type, name = "diagram") {
    try {
      const modeler = getModeler();
      /**按需要类型创建文件并下载 */
      if (type === "xml" || type === "bpmn") {
        const { err, xml } = await modeler.saveXML();
        if (err) {  // 读取异常时抛出异常
          console.error(`[Process Designer Warn ]: ${err.message || err}`);
        }
        const { href, filename } = setEncoded(type.toUpperCase(), name, xml);
        downloadFile(href, filename);
      } else {
        const { err, svg } = await modeler.saveSVG();
        if (err) {  // 读取异常时抛出异常
          return console.error(err);
        }
        const { href, filename } = setEncoded("SVG", name, svg);
        downloadFile(href, filename);
      }
    } catch (e) {
      console.error(`[Process Designer Warn ]: ${e.message || e}`);
    }
  }
