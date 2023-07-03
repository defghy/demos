import React, { useState, useMemo, useEffect, useContext } from 'react';

import { AppContext } from '../App';

function Count(props: { count: number; onUpdate: any; }) {
  const countStr = useMemo(() => {
    return `数字为：${props.count}`;
  }, [props.count]);

  const timer = useContext(AppContext);


  return (
    <div>
      <button onClick={props.onUpdate}>add</button>
      <div>{countStr}</div>
      <div>{timer}</div>
    </div>
  );
}

export default Count;
