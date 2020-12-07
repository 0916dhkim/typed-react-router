import React, { FC, useMemo } from 'react';

import { useTypedParams } from '../../hooks';

export const Calendar: FC = () => {
  const params = useTypedParams('/calendar/:year/:month');

  if (params === null) {
    throw new Error('[Calendar] component is rendered in invalid path.');
  }

  const monthName = useMemo(() => {
    const date = new Date(params.year + '-' + params.month + '-1');
    return date.toLocaleString('default', { month: 'long' });
  }, [params]);

  return (
    <div>
      <h1>Calendar</h1>
      <h3>Year {params.year}</h3>
      <h3>{monthName}</h3>
    </div>
  );
}
