# Nexment-Vue
Another lovely serverless comments library for Vue based on LeanCloud

<p>
  <a href="https://www.npmjs.com/package/nexment-vue">
    <img src="https://img.shields.io/npm/dw/nexment-vue" alt="npm downloads">
  </a>

  <a href="https://www.npmjs.com/package/nexment">
    <img src="https://img.shields.io/npm/l/nexment-vue" alt="license">
  </a>
</p>

![nexment_banner](https://i.loli.net/2020/07/29/ODkqtseAU6KJGxB.png)

<br/>

## See also
+ Nexment for Vue.js [https://github.com/HelipengTony/nexment-vue](https://github.com/HelipengTony/nexment-vue)
+ Nexment for React.js [https://github.com/HelipengTony/nexment](https://github.com/HelipengTony/nexment)

<br/>

## Docs
Visit Nexment documentation site at [https://nexment.ouorz.com](https://nexment.ouorz.com)

<br/>

## Demo
Visit Nexment demo site at [https://nexment-vue-demo.ouorz.com](https://nexment-vue-demo.ouorz.com)

<br/>

## Use Nexment in Vue.js projects
Nexment is available for both React.js and Vue.js projects.
### Part I - LeanCloud
1. Register / Login [LeanCloud](https://leancloud.cn/dashboard/login.html#/signup)
2. Create an App in [Dashboard](https://leancloud.cn/dashboard/applist.html#/apps)
3. Go to Your App => **LeanStorage** tab => Objects
4. Create a class named "test" using default settings
5. Go to Your App => **Settings** tab => App keys
6. Copy AppID and AppKey
7. Configure REST API Server URL. For configuration instructions, see [How to Specify API Server URL (Chinese)](https://leancloud.cn/docs/custom-api-domain-guide.html#hash810845114)
8. Go to Your App => **Settings** tab => Security and add your project domain to Web secure domains

<br/>

### Part II - Nexment
Add Nexment to your project dependencies
using Yarn:
```shell
yarn add nexment-vue
```
or using NPM:
```shell
npm install nexment-vue
```

Use Nexment in your project:

Import nexment library and stylesheet:
```js
import NexmentContainer from "nexment-vue";
import "nexment-vue/dist/nexment-vue.css";
Vue.use(NexmentContainer);
```
Setup nexment configuration:
```js
const config = {
  pageKey: 'xxx' | undefined;
  enableLinkInput: true | undefined,
  leancloud: {
    appId: 'xxx',
    appKey: 'xxx',
    serverURL: 'https://xxx.xxx',
  },
  admin: {
    name: 'xxx',
    email: 'xxx@xxx.xxx',
  },
};
```
Use the nexment component:
```Vue
<NexmentContainer :config="config" />
```

<br/>

## Use Nexment-Vue in Nuxt.js
Add Nexment to your project dependencies
using Yarn:
```shell
yarn add nexment-vue
```
or using NPM:
```shell
npm install nexment-vue
```

Create a plugin(src/plugins/nexment.js):
```js
import Vue from 'vue'
import NexmentContainer from 'nexment-vue'
import 'nexment-vue/dist/nexment-vue.css'
Vue.use(NexmentContainer)
```

Add this plugin to your Nuxt.js configuration(nuxt.config.js):
```js
module.exports = {
  plugins: [{
      src: '@/plugins/nexment.ts',
      ssr: false,
      mode: 'client'
    }]
}
```

Setup nexment configuration:
```js
const config = {
  pageKey: 'xxx' | undefined;
  enableLinkInput: true | undefined,
  leancloud: {
    appId: 'xxx',
    appKey: 'xxx',
    serverURL: 'https://xxx.xxx',
  },
  admin: {
    name: 'xxx',
    email: 'xxx@xxx.xxx',
  },
};
```
Use the nexment component:
```Vue
<NexmentContainer :config="config" />
```

<br/>

## Use Nexment in Browsers
Nexment can be used as a web component in browsers. That means it can work without a Vue.js instance. Follow the following steps to set it up:

Add Nexment stylesheet to your `<head>` through CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nexment-vue/dist/nexment-vue.css">
```

Add Nexment main file through CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/nexment-vue/dist-wc/nexment-vue.min.js"></script>
```

Use Nexment component in your page(`pagekey` is optional):
```html
<nexment-container
  email="xxx"
  name="xxx"
  serverurl="xxx"
  appkey="xxx"
  appid="xxx"
  pagekey="xxx"
  enablelinkinput="xxx"
></nexment-container>
```

See Nexment web component demo here: [https://github.com/HelipengTony/nexment-vue/blob/master/index.html](https://github.com/HelipengTony/nexment-vue/blob/master/index.html)

<br/>

## TypeScript Support
Currently type-checking is not supported, please add the following declaration to any .d.ts file in your project:
```ts
declare module 'nexment-vue'
```

<br/>

## Todo
1. 管理模式
    1. [ ] 评论精选
    2. [ ] 评论 Label

<br/>

## Donation
Your name will be on the list [Donation](https://www.ouorz.com/donation)
<br/>

![Donate](https://i.loli.net/2019/02/18/5c6a80afd1e26.png)

<br/>

File an issue if you encountered any problem
<br/>
I will reply you as soon as possible