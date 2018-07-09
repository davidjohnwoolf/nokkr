import { USER, MANAGER, PW_REGEX } from '../../../lib/constants.js';

//===============
// helpers
//===============

export const initializeForm = (fields, data) => {
    for (let field in fields) {
        let fieldType = ('checked' in fields[field]) ? 'checked' : 'value';
        
        if (!field.includes('password')) {
            fields[field][fieldType] = data[field]
        }
    }
    
    return { ...fields };
};

//===============
// validation rules
//===============

export const required = args => args.value ? undefined : 'Required';

export const requiredExceptAdmin = args => {
    const { value, fields } = args;
    
    const role = fields.role.value;
    
    if ((role === USER) || (role === MANAGER)) {
        return (value ? undefined : 'Required');
    }
    
    return undefined;
};

export const password = args => {
    const { value } = args;
    return (
        (!value || PW_REGEX.test(value))
            ? undefined
            : 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
    );
};

export const passwordMatch = args => {
    const { password, passwordConfirmation } = args.fields;
    return password.value === passwordConfirmation.value ? undefined : 'Passwords must match';
};

export const unique = args => {
    const { value, field, candidates, data } = args;
    
    return (candidates.find(c => (value === c[field]) && (!data || (c._id !== data._id)))) ? `${ value } already exists` : undefined;
};

//===============
// validation helper
//===============

export const validate = (e, rules, fields, candidates, data) => {
    let formValid = true;
    let error;
    let fieldType = ('checked' in fields[e.target.name]) ? 'checked' : 'value';
    
    fields[e.target.name][fieldType] = e.target[fieldType];
    
    //handle target rules
    rules[e.target.name].forEach(rule => {
        let result = rule({ value: e.target[fieldType], field: e.target.name, candidates, data, fields });
        
        if (result) error = result;

        fields[e.target.name].error = error;
    });
    
    //handle all rules
    for (let field in fields ) {
        
        let currentType = ('checked' in fields[field]) ? 'checked' : 'value';

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