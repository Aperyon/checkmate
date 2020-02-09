import React from 'react';
import {
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Context as AuthContext } from '../contexts/AuthContext';
import { ActionButton } from '../CheckListList/Buttons';
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
      if (response.data.detail) {
        setError('nonFieldError', null, response.data.detail)
      }
    } else {
      history.replace(from);
    }
  }

  console.log(authState.isAuthenticated)
  if (authState.isAuthenticated) {
    return <Redirect to={from} />
  }

  return (
    <div className="View AuthView">
      <form className="AuthForm LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="AuthFormTitle">Login</h1>
        <div className="InputGroup">
          <label>Email</label>
          <input type="email" name="email" ref={register()} />
        </div>
        <div className="InputGroup">
          <label>Password</label>
          <input type="password" name="password" ref={register()} />
        </div>
        {errors.nonFieldError && <p className="FormError">{errors.nonFieldError.message}</p>}
        <ActionButton type="submit" className="FullWidth">
          <Icon icon="check" />
        </ActionButton>
      </form>
    </div>
  )
}