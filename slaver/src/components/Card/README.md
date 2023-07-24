# Card控件

## 技术栈

- react 17
- [umi4](https://umijs.org/docs/tutorials/getting-started)

## 功能支持
1. title自定义
2. 传入tabProps显示tab
3. 传入selectProps显示select
4. 传入buttonProps显示button
5. 定义可tab/select/button的位置，可选项为inside和outside
6. 传入card body内容
7. 传入icon显示在标题附近
8. 传入自定义的style
9. withWrap属性可为某些需要在卡片周围显示图片


## 组件入参
```javascript
 const handleTabChange = (v) => {
    alert("Tab value:" + v);
  };

  const handleSelectChange = (v) => {
    alert("Select value:" + v);
  };

  const handleClick = () => {
    alert("Clicked");
  };

  const tabOptions = [
    { label: "tab1", value: "1" },
    { label: "tab2", value: "2" },
  ];

  const selectOptions = [
    { label: "option1", value: "1" },
    { label: "option2", value: "2" },
  ];


    tabProps={{ tabOptions, onTabChange: handleTabChange }}
    selectProps={{ selectOptions, onSelectChange: handleSelectChange }}
    buttonProps={{ text: "click!", onClick: handleClick }}
    title="自定义Title"
    operatorPosition="outside"
     redirectUrl={"/example/map"}
     icon={<CaretRightOutlined />}
    iconPosition="left"
     onTitleClick={handleTitleClick}



```
入参格式说明：
1. title: string --- 卡片title
2. tabProps: {tabOptions:Array<object>,onTabChange:function} --- option是label ，value的对象数组，onTabChange为tab切换调用事件
3. selectProps: {selectOptions:Array<object>,onSelectChange:function} --- option是label ，value的对象数组 ，onSelectChange为select切换调用事件
4. buttonProps: {text:string,onClick:function} --- text为按钮显示的文字，onClick为点击时间
5. operatorPosition：“inside” ｜ “outside” --- tab/select/button的位置
6. icon：any ---显示在title旁边
7.  selectStyle = {} --- select自定义样式
    bodyStyle = {} --- cardBody自定义样式
    cardStyle = {} --- card自定义样式
8.  redirectUrl:string  ---- 点击title的跳转链接
9. onTitleClick:function ---- 点击title的事件，当redirectUrl不传的时候生效
10. iconPosition:'right' | 'left' --- icon的位置，在标题的左边或者右边
