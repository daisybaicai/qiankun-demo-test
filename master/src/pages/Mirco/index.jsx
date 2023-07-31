import { useState } from 'react';
import { MicroApp } from 'umi';
 
export default function Page() {
  const [globalState, setGlobalState] = useState({
    test: 'haha'
  })

  // 这个地方能看到的 path 就是 `/admin/slave2`
  return <MicroApp name="slave" base="/admin/slave2" globalState={globalState} setGlobalState={setGlobalState}/>;
};