import { IApi } from 'umi';

export default (api: IApi) => {
  api.addHTMLScripts(() => [
    `function setHtmlFontSize() {let deviceWidth = document.documentElement.clientWidth;const tmpWidth = (document.documentElement.clientHeight * 1920) / 1080;const designRes = window.screen.width * 9 === window.screen.height * 16;if (!designRes && window.screen.width * 10 === window.screen.height * 10) {deviceWidth = (document.documentElement.clientWidth * 9) / 10;}deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;document.documentElement.style.fontSize = deviceWidth/19.2 + "px";}setHtmlFontSize();window.addEventListener('resize',() => {setHtmlFontSize();},false);`,
  ]);
};