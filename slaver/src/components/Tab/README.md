# tab控件

## 技术栈

- react 17
- [umi4](https://umijs.org/docs/tutorials/getting-started)

## 功能支持
1. 文字tab
2. 图片tab


## 组件入参
```javascript
  //isLabelImage={true}
  options={[
          { 
            value: 0,
            activeLabel: activeTab1Icon, 
            inActiveLabel: inActiveTab1Icon
           },
          { 
            value: 1, 
            activeLabel: activeTab2Icon, 
            inActiveLabel: inActiveTab2Icon
          },
        ]}


  //isLabelImage={false}
   options={[
          { label: '水环境', value: 0 },
          { label: '大气环境', value: 1 },
        ]}
```
入参格式说明：
1. onChange：function --- 点击tab触发事件
1. value：any --- 当前tab的对应值
1. options：Array --- tab的选项
1. isLabelImage：boolean --- tab是否是一个图片
