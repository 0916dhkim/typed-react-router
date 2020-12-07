import React, { FC, FormEvent } from 'react';

export const LogIn: FC = () => {
  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        email
        <input />
      </label>
      <label>
        password
        <input type='password' />
      </label>
      <button type='submit'>
        Log In
      </button>
    </form>
  );
}
