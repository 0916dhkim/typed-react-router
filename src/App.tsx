import React, { FC } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Calendar } from './components/screens/Calendar';
import { Home } from './components/screens/Home';
import { LogIn } from './components/screens/LogIn';
import { Post } from './components/screens/Post';
import { SignUp } from './components/screens/SignUp';
import { TypedLink } from './components/TypedLink';
import styles from './App.module.css';
import { useTypedSwitch } from './hooks';

// Navigation bar component.
const NavBar: FC = () => {
  return (
    <nav className={styles.navbar}>
      <TypedLink to='/' params={{}}>
        Home
      </TypedLink>
      <TypedLink to='/login' params={{}}>
        Log In
      </TypedLink>
      <TypedLink to='/signup' params={{}}>
        Sign Up
      </TypedLink>
    </nav>
  );
}

const App: FC = () => {
  // Define routes with `useTypedSwitch` hook.
  const TypedSwitch = useTypedSwitch([
    { path: '/', component: Home },
    { path: '/login', component: LogIn },
    { path: '/signup', component: SignUp },
    { path: '/post/:id', component: Post },
    { path: '/calendar/:year/:month', component: Calendar },
  ]);

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <NavBar />
        <TypedSwitch />
      </div>
    </BrowserRouter>
  );
}

export default App;
