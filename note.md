# Note

1. 在组件的setup(props, ctx)中，取不到ctx的值

2. 在单文件组件里，scoped 的样式不会应用在 v-html 内部，因为那部分 HTML 没有被 Vue 的模板编译器处理。如果你希望针对 v-html 的内容设置带作用域的 CSS，你可以替换为 CSS modules 或用一个额外的全局 <style> 元素手动设置类似 BEM 的作用域策略。

3. 路由history模式打包页面一片空白，现采用hash模式

(Vue项目打包后页面一片空白的解决方法)[https://blog.csdn.net/liuhailong2014/article/details/90898339]

4. 打包路径不对，需在vite.config.js中配置base: './'

5. 打包后，ctx.$api为undefined

ctx代替this只适用于开发阶段，如果将项目打包放到生产服务器上运行，就会出错，ctx无法获取路由和全局挂载对象的。此问题的解决方案就是使用proxy替代ctx

https://blog.csdn.net/qq_39115469/article/details/113817592

https://blog.csdn.net/MZS_ym/article/details/108866013

6. 怎么配置开发环境和生产环境的server



### TypeScript

1. fn的类型该怎么声明，现在使用的是Function

2. vue+typescript项目@引入无法找到模块问题，需要在tsconfig.json中配置
`
{
  "compilerOptions": {
   "baseUrl": ".",
   "paths": {
     "@/*": ["*","src/*"]
   }
  }
}
`

3. typescript+vue踩过的坑-常见报错

main.ts报错（ Cannot find module './App.vue'.）

https://www.jianshu.com/p/55cc2fa5d434

4. Type ‘string | string[]‘ is not assignable to type ‘string | undefined‘.

加类型断言，值 as 类型）

https://blog.csdn.net/weixin_48786946/article/details/107616922