import React, { FC, useMemo } from 'react';

import styles from './Post.module.css';
import { useTypedParams } from '../../hooks';

export const Post: FC = () => {
  const params = useTypedParams('/post/:id');

  if (params === null) {
    throw new Error('[Post] component is rendered in invalid path.');
  }

  const content = useMemo(() => {
    return Array(5).fill(params.id.repeat(1000)).map(x => <p>{x}</p>);
  }, [params.id]);

  return (
    <div className={styles.container}>
      <h1>Blog Post #{params.id}</h1>
      {content}
    </div>
  );
};
