import { MicroAppWithMemoHistory } from 'umi';
 
export default function Page() {
  return <MicroAppWithMemoHistory name="slave" url="/home" base="/admin"/>;
};