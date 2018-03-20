/*import React from 'react';

const UserForm = (edit, renderField, submit, validation, submitting) => {
    return (
        <div className={ `component-page user-${edit ? 'edit' : 'create'}` }>
                <h1>{ `${edit ? 'Edit' : 'New'} User` }</h1>
                
                <div className="form-server-errors"></div>
                
                <form className="form" onSubmit={ submit }>
                    <Field
                        placeholder="Full Name"
                        name="name"
                        component={ renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Username"
                        name="username"
                        component={ renderField }
                        type="text"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Email"
                        name="email"
                        component={ renderField }
                        type="email"
                        validate={[ validation.required ]}
                    />
                    <Field
                        placeholder="Password"
                        name="password"
                        component={ renderField }
                        type="password"
                        validate={ edit ? [validation.passwordEdit] : [validation.password] }
                    />
                    <Field
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        component={ renderField }
                        type="password"
                        validate={ edit ? [validation.matchEdit] : [validation.match] }
                    />
                    <button className="form-submit" type="submit" disabled={ submitting }>
                        { `${edit ? 'Update' : 'Create'} User` }
                    </button>
                </form>
            </div>
    );
}

export default UserForm;*/