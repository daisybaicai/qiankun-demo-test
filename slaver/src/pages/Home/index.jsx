import React from "react";
import { Link, useModel } from "umi";

export default function HomePage() {
  const masterProps = useModel("@@qiankunStateFromMaster");
  console.log('@@qiankunStateFromMaster', masterProps)
  return (
    <div>
      <Link to="/home2">去首页2</Link>
      首页
      <div>{JSON.stringify(masterProps?.globalState)}</div>
    </div>
  );
}
