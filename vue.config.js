const { defineConfig } = require('@vue/cli-service')

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  publicPath: './',
  outputDir: 'build',         // 打包后的输出文件夹
  productionSourceMap: false, // 禁止生成.map文件(错误信息导航)
  filenameHashing: false,     // 打包生成的的静态资源的文件名中是否加入hash值以便控制浏览器缓存问题
  lintOnSave: false,          // 在开发环境下每次保存代码时都启用 eslint验证
  runtimeCompiler: true,      // 是否使用包含运行时编译器的 Vue 构建版本

  chainWebpack: config => {
     // 找到svg 默认的处理规则，将某个目录排除处理里的范围
     config.module.rule('svg').exclude.add(resolve('./src/assets/bpmn-icons')).end();
     // 新加一个icons的处理规则,用svg-sprite-loader处理，将上面那个目录添加到这个规则的处理范围内
     config.module
         .rule('svg-sprite-loader')  // 新添加的处理规则
         .test(/\.svg$/)
         .include                    // 添加
         .add(resolve('./src/assets/bpmn-icons')) //处理svg目录
         .end()
         .use('svg-sprite-loader')   // 使用svg-sprite-loader处理
         .loader('svg-sprite-loader')
         .options({
            symbolId: "[name]"
         })
    },
})
