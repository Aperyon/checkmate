import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { Context as AuthContext } from '../contexts/AuthContext';
import { ActionButton } from '../common/components/Buttons';
import Icon from '../common/components/Icon';


export default function ForgotPassword() {
  const { sendForgotPassword } = React.useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();

  async function onSubmit(values) {
    const response = await sendForgotPassword(values)
    if (!response.hasError) {
      alert('We sent you an email with the password reset link.')
    }
  }

  return (
    <div className="View AuthView">
      <form className="AuthForm LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="AuthFormTitle">Forgot password</h1>
        <div className="InputGroup">
          <label>Email</label>
          <input name="email" type="email" ref={register()} />
          {errors.email && <p className="FieldError">{_.capitalize(errors.email.message[0])}</p>}
        </div>
        <ActionButton type="submit" className="FullWidth">
          <Icon icon="check" />
        </ActionButton>
        <Link to="/login/" className="AuthLink"><p>Go back to login</p></Link>
      </form>
    </div>
  )
}