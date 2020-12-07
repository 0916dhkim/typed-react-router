import React, { FC } from 'react';

import { TypedLink } from '../TypedLink';

export const Home: FC = () => {
  const calendarData = [
    [1800, 11],
    [1919, 3],
    [2015, 2],
    [2022, 1],
  ];
  const postData = [1,2,3,4,5,10,100];

  return (
    <div>
      <h1>Welcome to Typescript react-router-dom Demo</h1>
      <p>Use the top navigation bar to look around!</p>
      <p>Examples of using route parameters are provided below.</p>
      <h5>Calendar Component</h5>
      <ul>
        {calendarData.map((x, i) => (
          <li key={i}>
            <TypedLink
              to='/calendar/:year/:month'
              params={{ year: x[0].toString(), month: x[1].toString() }}
            >
              {x[0].toString() + '/' + x[1].toString()}
            </TypedLink>
          </li>
        ))}
      </ul>
      <h5>Blog Posts</h5>
      <ul>
        {postData.map(x => (
          <li key={x}>
            <TypedLink
              to='/post/:id'
              params={{ id: x.toString() }}
            >
              Post #{x}
            </TypedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
