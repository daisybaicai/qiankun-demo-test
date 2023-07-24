import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Tree, Checkbox } from 'antd';
import { isFunction } from 'lodash';
import { MENU_TREE, defaultKeys } from '@/utils/menu';
import { isEmptyArray, flatten } from '@/utils/utils';

const MenuTree = forwardRef(
  (
    {
      canCheckAll = false,
      initialMenuData = [], // 初始菜单
      onRef,
      keyMap = {
        // 字段映射
        title: 'title',
        key: 'key',
        children: 'children',
      },
      splitSymbol = '.', // 页面和操作类型之间的分隔符
      onChange = () => {},
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const menuTreeRef = useRef(null);

    useEffect(() => {
      onRef && onRef(menuTreeRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [checkAll, setCheckAll] = useState(false); // 是否全选
    const [indeterminate, setIndeterminate] = useState(false); // 是否半选

    const [checkedKeys, setCheckedKeys] = useState([]); // 全选集合
    const [checkedArr, setCheckedArr] = useState([]); // 全选和半选的集合
    const [checkBoxKeys, setCheckBoxKeys] = useState([]); // 非菜单类型选中的集合

    // 判断是否为普通的菜单节点（有分隔符的是特殊节点,使用checkbox做勾选）
    const isNormal = (val) => val.indexOf(splitSymbol) === -1;

    /**
     * 获取所有叶子节点
     * @param {*} tree
     * @returns
     */
    const getAllLeaves = (tree) => flatten(tree).map((item) => item.key);

    const onCheck = (checkedKeysValue, info) => {
      const newChecked = [...checkedKeysValue];
      const childrenKeys = getAllLeaves(info.node.children);

      // 节点不勾选时，对应的按钮也需要同步取消
      let newCheckBoxKeys = [...checkBoxKeys];
      checkBoxKeys.forEach((item) => {
        const [parentKey] = item.split(splitSymbol);
        if (parentKey && newChecked.findIndex((val) => val === parentKey) === -1) {
          newCheckBoxKeys = newCheckBoxKeys.filter((val) => val !== item);
        }
      });

      // 节点勾选时，对应的按钮也需要同步勾选
      if (info.checked) {
        childrenKeys.forEach((item) => {
          const index = item.indexOf(splitSymbol);
          if (index !== -1 && newCheckBoxKeys.findIndex((val) => val === item) === -1) {
            newCheckBoxKeys.push(item);
          }
        });
      }

      setCheckBoxKeys(newCheckBoxKeys);
      setCheckedKeys(newChecked);
      setCheckedArr([...new Set(newChecked), ...new Set(info.halfCheckedKeys)]);
    };

    /**
     * 处理数据并去除空数据（map+filter的功能）
     * @param {*} arr
     * @param {*} callback
     * @returns
     */
    const handleArr = (arr, callback) => {
      const flag = !Array.isArray(arr) || !arr.length || typeof callback !== 'function';
      if (flag) {
        return [];
      }
      const newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
          newArr.push(callback(arr[i], i, arr));
        }
      }
      return newArr;
    };

    /**
     * 初始化菜单树数据
     * @param {*} menuList
     * @param {*} parent
     * @returns
     */
    const getRoutesTree = (menuList, parent) => {
      return handleArr(menuList, (item) => {
        if (isFunction(item.isShow) && !item.isShow(props)) {
          return undefined;
        }

        const localItem = {
          title: !isNormal(item.key) ? (
            <Checkbox
              style={{ marginLeft: '-4px' }}
              onChange={(e) => {
                const { checked } = e.target;
                let newCheckBoxKeys = checkBoxKeys.slice(0);
                if (checked) {
                  newCheckBoxKeys.push(item[keyMap.key]);
                  // 按钮选中时，对应页面必须存在
                  if (parent.key && checkedKeys.findIndex((val) => val === parent.key) === -1) {
                    setCheckedKeys([...checkedKeys, parent.key]);
                    setCheckedArr([...checkedArr, parent.key]);
                  }
                } else {
                  newCheckBoxKeys = newCheckBoxKeys.filter((val) => val !== item[keyMap.key]);
                }
                setCheckBoxKeys(newCheckBoxKeys);
              }}
              checked={checkBoxKeys?.includes(item[keyMap.key])}
              disabled={isFunction(item.isDisabled) ? item.isDisabled(props) : item.isDisabled}
            >
              <span style={{ paddingLeft: 4 }}>{item[keyMap.title]}</span>
            </Checkbox>
          ) : (
            item[keyMap.title]
          ),
          key: item[keyMap.key],
          children: item[keyMap.children] ? getRoutesTree(item[keyMap.children], item) : undefined,
          checkable: isNormal(item.key),
          disabled: isFunction(item.isDisabled) ? item.isDisabled(props) : item.isDisabled,
        };
        if (item[keyMap.title]) {
          return localItem;
        }
        return undefined;
      });
    };

    /**
     * 生成新菜单数组
     * @returns
     */
    const handleMenuData = () => [...new Set([...checkedArr, ...checkBoxKeys])];

    useImperativeHandle(ref, () => ({
      handleMenuData,
    }));

    // 同步表单菜单配置数据
    useEffect(() => {
      const newMenuArr = handleMenuData();
      setCheckAll(newMenuArr?.length === defaultKeys?.length);
      setIndeterminate(!!newMenuArr.length && newMenuArr.length < defaultKeys.length);
      onChange(newMenuArr);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedKeys, checkBoxKeys, checkedArr]);

    useEffect(() => {
      // 初始化系统菜单
      if (!isEmptyArray(initialMenuData)) {
        setCheckedKeys(initialMenuData.filter((item) => isNormal(item)));
        setCheckedArr(initialMenuData.filter((item) => isNormal(item)));
        setCheckBoxKeys(initialMenuData.filter((item) => !isNormal(item)));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialMenuData]);

    const handleCheckAllChange = (e) => {
      if (e.target.checked) {
        setCheckedKeys(defaultKeys);
        setCheckedArr(defaultKeys);
        setCheckBoxKeys(defaultKeys);
      } else {
        setCheckedKeys([]);
        setCheckedArr([]);
        setCheckBoxKeys([]);
      }
    };

    return (
      <div style={{ paddingTop: 5 }}>
        {canCheckAll && (
          <Checkbox
            indeterminate={indeterminate}
            onChange={handleCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        )}
        <Tree
          checkable
          defaultExpandAll
          selectable={false}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={getRoutesTree(MENU_TREE)}
          ref={menuTreeRef}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  },
);
export default MenuTree;
