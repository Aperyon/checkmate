import React from 'react';
import { Redirect, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { Context as AuthContext } from '../contexts/AuthContext';
import { ActionButton } from '../common/components/Buttons';
import Icon from '../common/components/Icon';


export default function Signup() {
  let history = useHistory();
  const { state: authState, createUser } = React.useContext(AuthContext)
  const { register, handleSubmit, setError, errors } = useForm();

  async function onSubmit(values) {
    const response = await createUser(values);
    if (response.hasError) {
      Object.keys(response.data).forEach(errorKey => {
        let errorField = errorKey
        if (errorKey === 'non_field_error') {
          errorField = 'nonFieldError'
        }
        setError(errorField, null, response.data[errorKey])
      })
    } else {
      history.push('/signup-success/')
    }

  }

  if (authState.isAuthenticated) {
    return <Redirect to="/checklists/" />
  }

  return (
    <div className="View AuthView">
      <form className="AuthForm SignupForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="AuthFormTitle HeroTitle">Signup</h1>
        <div className="InputGroup">
          <label className="Title">Email</label>
          <input name="email" type="email" ref={register()} />
          {errors.email && <p className="FieldError">{_.capitalize(errors.email.message[0])}</p>}
        </div>
        <div className="InputGroup">
          <label className="Title">Password</label>
          <input name="password" type="password" ref={register()} />
          {errors.password && <p className="FieldError">{_.capitalize(errors.password.message[0])}</p>}
        </div>
        {errors.nonFieldError && <p className="FormError">{errors.nonFieldError.message}</p>}
        <ActionButton className="FullWidth" type="submit"><Icon icon="check" /></ActionButton>
        <Link to="/login/" className="AuthLink"><p>I already have an account. Login!</p></Link>
      </form>
    </div>
  )
}