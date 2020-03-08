import React from 'react';
import {
  Redirect,
  useHistory,
  useLocation,
  Link,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Context as AuthContext } from '../contexts/AuthContext';
import { ActionButton } from '../common/components/Buttons';
import Icon from '../common/components/Icon'



export default function Login() {
  let history = useHistory();
  let location = useLocation();
  const { state: authState, loginUser } = React.useContext(AuthContext)
  const { register, handleSubmit, setError, errors } = useForm();

  let { from } = location.state || { from: { pathname: "/checklists/" } };

  async function onSubmit(values) {
    const response = await loginUser(values);
    if (response.hasError) {
      if (response.data?.detail) {
        setError('nonFieldError', null, response.data.detail)
      }
    } else {
      history.replace(from);
    }
  }

  if (authState.isAuthenticated) {
    return <Redirect to={from} />
  }

  return (
    <div className="View AuthView">
      <form className="AuthForm LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="AuthFormTitle HeroTitle">Login</h1>
        <div className="InputGroup">
          <label className="Title">Email</label>
          <input type="email" name="email" ref={register()} />
        </div>
        <div className="InputGroup">
          <label className="Title">Password</label>
          <input type="password" name="password" ref={register()} />
        </div>
        {errors.nonFieldError && <p className="FormError">{errors.nonFieldError.message}</p>}
        <ActionButton type="submit" className="FullWidth">
          <Icon icon="check" />
        </ActionButton>
        <Link to="/signup/" className="AuthLink"><p>I don't have an account yet. Sign up!</p></Link>
        <Link to="/forgot-password/" className="AuthLink"><p>Forgot my password, help!</p></Link>
      </form>
    </div>
  )
}