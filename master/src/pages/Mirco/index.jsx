import { MicroApp } from 'umi';
 
export default function Page() {
  // 这个地方能看到的 path 就是 `/admin/slave2`
  return <MicroApp name="slave" base="/admin/slave2" />;
};