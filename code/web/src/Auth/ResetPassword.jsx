import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { Context as AuthContext } from '../contexts/AuthContext';
import { ActionButton } from '../common/components/Buttons';
import Icon from '../common/components/Icon';
import { InputGroup } from '../common/components/formStuff';


export default function ResetPassword() {
  const history = useHistory()
  const { sendResetPassword } = React.useContext(AuthContext);
  const { register, handleSubmit, errors, setError } = useForm();

  const url = history.location.pathname
  const parts = url.split('/')
  const uid = parts[parts.length - 3]
  const token = parts[parts.length - 2]

  async function onSubmit(values) {
    const response = await sendResetPassword(uid, token, values)
    if (response.hasError) {
      Object.keys(response.data).map(errorKey => {
        setError(errorKey, null, response.data[errorKey])
      })
    } else {
      alert('Your new password is set!\nYou are redirected to login...')
      history.push('/login/')
    }
  }

  return (
    <div className="View AuthView">
      <form className="Form AuthForm LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="AuthFormTitle HeroTitle">Reset password</h1>
        <InputGroup
          label="New password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
          labelClass="Title"
        />
        {errors.non_field_error && <p className="Error">{errors.non_field_error.message}</p>}
        <ActionButton type="submit" className="FullWidth">
          <Icon icon="check" />
        </ActionButton>
        <Link to="/login/" className="AuthLink"><p>Go back to login</p></Link>
      </form>
    </div>
  )
}