import { USER, MANAGER, PW_REGEX } from '../../../lib/constants.js';

const CHECKED = 'checked';
const VALUE = 'value';

//===============
// validation rules
//===============

//required
export const required = args => args.value ? undefined : 'Required';

//requiredExceptAdmin
export const requiredExceptAdmin = args => {
    const { value, fields } = args;
    
    const role = fields.role.value;

    if ((role === USER) || (role === MANAGER)) {
        return (value ? undefined : 'Required');
    }
    
    return undefined;
};

//password
export const password = args => {
    const { value } = args;
    return (
        (!value || PW_REGEX.test(value))
            ? undefined
            : 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
    );
};

//passwordMatch
export const passwordMatch = args => {
    const { password, passwordConfirmation } = args.fields;
    return password.value === passwordConfirmation.value ? undefined : 'Passwords must match';
};

//unique
export const unique = args => {
    const { value, field, candidates, data } = args;
    
    //check if field exists and that field is not the one being edited
    return (candidates.find(c => (value === c[field]) && (!data || (c._id !== data._id)))) ? `${ value } already exists` : undefined;
};

//===============
// validation helper
//===============

export const validate = (e, rules, fields, candidates, data) => {
    let formValid = true;
    let error;
    
    if (e) {
        let fieldType = (CHECKED in fields[e.target.name]) ? CHECKED : VALUE;
        
        fields[e.target.name][fieldType] = e.target[fieldType];
        
        //handle target rules
        rules[e.target.name].forEach(rule => {
            let result = rule({ value: e.target[fieldType], field: e.target.name, candidates, data, fields });
            
            if (result) error = result;
    
            fields[e.target.name].error = error;
        });
    }
    
    //handle all rules
    for (let field in fields ) {
        
        let currentType = (CHECKED in fields[field]) ? CHECKED : VALUE;

        //run function for the rule (e.g. required) from validation rules on each field value
        rules[field].forEach(rule => {
            if (rule({ value: fields[field][currentType], field, candidates, data, fields })) {
                //update match error
                if (rule === passwordMatch) fields.passwordConfirmation.error = 'Passwords must match';
                
                formValid = false;
            } else {
                if (rule === passwordMatch) fields.passwordConfirmation.error = undefined;
            }
        });
    }
    
    return { fields, formValid };
};

//===============
// form helpers
//===============

//initializeForm
export const initializeForm = (fields, data) => {
    for (let field in fields) {
        let fieldType = (CHECKED in fields[field]) ? CHECKED : VALUE;
        
        if (!field.includes('password')) {
            fields[field][fieldType] = data[field];
        }
    }
    
    return { ...fields };
};

//formSubmit
export const formSubmit = ({ fields, excludeKeys, action, id }) => {
    for (let key in fields) {
        let fieldType = (CHECKED in fields[key]) ? CHECKED : VALUE;

        if (excludeKeys && excludeKeys.find(excludeKey => excludeKey === key) && !fields[key][fieldType]) {
            delete fields[key];
        } else {
            fields[key] = fields[key][fieldType];
        }
    }
    
    id ? action(id, fields) : action(fields);
};

//buildForm
/*export const buildForm = ({ formOptions, handleUserInput, handleSubmit, formValid, history, submitText, fields, state }) => {
    
    let inputs = []
    for (let input in formOptions) {
        switch (formOptions[input].type) {
            case 'select':
                inputs.push(<FieldSelect
                    name={ input }
                    value={ fields[input].value }
                    handleUserInput={ handleUserInput }
                    error={ fields[input].error }
                    options={ state[formOptions[input].options] }
                />);
                
            case 'checkbox':
                inputs.push(<FieldCheckbox
                    name={ input }
                    label={ formOptions[input].label }
                    checked={ fields[input].checked }
                    value="true"
                    handleUserInput={ handleUserInput }
                    error={ fields[input].error }
                />)
                
            default:
                inputs.push(<FieldInput
                    name={ input }
                    type={ formOptions[input].type }
                    placeholder={ formOptions[input].label }
                    value={ fields[input].value }
                    handleUserInput={ handleUserInput }
                    error={ fields[input].error }
                />);
        }
    };
    
    return (
        <form onSubmit={ handleSubmit }>
            { inputs }
            <div className="btn-group">
                <button
                    disabled={ !formValid }
                    className="btn btn-primary"
                    type="submit">
                    { submitText }
                </button>
                <a onClick={ history.goBack } className="btn btn-cancel">Cancel</a>
            </div>
        </form>
    )
};
*/