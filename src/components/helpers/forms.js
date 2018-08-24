import React from 'react';
import { USER, MANAGER, PW_REGEX } from '../../../lib/constants.js';

import FieldInput from '../forms/field-input';
import FieldCheckbox from '../forms/field-checkbox';
import FieldSelect from '../forms/field-select';
import FieldTextarea from '../forms/field-textarea';

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
    return candidates ? ((candidates.find(c => (value === c[field]) && (!data || (c._id !== data._id)))) ? `${ value } already exists` : undefined) : undefined;
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

//will replace validate
export const customValidate = ({ event, fields, customFields, candidates, data }) => {
    let formValid = true;
    let error;
    
    const validateFields = (fields) => {
        fields.forEach(field => {
            
            //update target field value
            if (event && (field.name === event.target.name)) {
                (field.type === 'checkbox')
                    ? field.checked = event.target.checked
                    : field.value = event.target.value;
            }
            
            if (field.rules) {
                field.rules.forEach(rule => {
                    let value = field.type === 'checkbox' ? field.checked : field.value;
                    
                    let result = rule({ value: value, field: field.name, candidates, data });
                    
                    //handle target error
                    if (event && (field.name === event.target.name)) {
                        if (result) error = result;
                        field.error = error;
                    }
                    
                    if (result) {
                        //update match error
                        if (rule === passwordMatch) customFields.passwordConfirmation.error = 'Passwords must match';
                        
                        //set formValid false if the field in question has an error
                        formValid = false;
                    } else {
                        if (rule === passwordMatch) customFields.passwordConfirmation.error = undefined;
                    }
                });
            }
        });
    };
    
    validateFields(fields);
    
    if (customFields) {
        validateFields(customFields);
        return { fields, customFields, formValid };
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

export const initializeForm2 = (fields, data) => {
    fields.forEach(field => {
        let fieldType = (field.type === 'checkbox') ? CHECKED : VALUE;
        
        if (!field.name.includes('password')) {
            field[fieldType] = data[field.name];
        }
    });
    
    return fields;
};

export const initializeCustomFields = (customFields, data) => {
    
    if (data.customFields[0]) {
        customFields.forEach(field => {
            let fieldType = (field.type === 'checkbox') ? CHECKED : VALUE;
            
            if (data.customFields[0][field.name]) field[fieldType] = data.customFields[0][field.name];
        });
    }
    
    return customFields;
};

//formSubmit
export const formSubmit = ({ fields, excludeKeys, customFields, action, id }) => {
    for (let key in fields) {
        let fieldType = (CHECKED in fields[key]) ? CHECKED : VALUE;

        if (excludeKeys && excludeKeys.find(excludeKey => excludeKey === key) && !fields[key][fieldType]) {
            delete fields[key];
        } else {
            fields[key] = fields[key][fieldType];
        }
    }
    
    if (customFields) {
        fields.customFields = {};
    
        customFields.forEach(field => {
            if (field.type === 'checkbox' && field.checked) fields.customFields[field.name] = field.checked;
            if (field.type !== 'checkbox' && field.value) fields.customFields[field.name] = field.value;
        });
    }
    
    id ? action(id, fields) : action(fields);
};

//formSubmit
export const formSubmit2 = ({ fields, customFields, excludeKeys, action, id }) => {
    const data = {};

    fields.forEach(field => {
        if (!excludeKeys || !excludeKeys.find(excludeKey => excludeKey === field.name)) {
            if (field.type === 'checkbox' && field.checked) data[field.name] = field.checked;
            if (field.type !== 'checkbox' && field.value) data[field.name] = field.value;
        }
    });
    
    if (customFields) {
        data.customFields = {};
    
        customFields.forEach(field => {
            if (field.type === 'checkbox' && field.checked) data.customFields[field.name] = field.checked;
            if (field.type !== 'checkbox' && field.value) data.customFields[field.name] = field.value;
        });
    }
    
    id ? action(id, data) : action(data);
};

//buildFields
export const buildFields = ({ fields, handleUserInput }) => {
    
    return fields.map(field => {
        switch(field.type) {
            case ('text' || 'email' || 'number'):
                return (
                    <FieldInput
                        key={ field.name }
                        name={ field.name }
                        type={ field.type }
                        placeholder={ field.label }
                        value={ field.value }
                        handleUserInput={ handleUserInput }
                        error={ field.error }
                    />
                );
            case ('checkbox'):
                return (
                    <FieldCheckbox
                        key={ field.name }
                        name={ field.name }
                        label={ field.label }
                        value="true"
                        checked={ field.checked }
                        handleUserInput={ handleUserInput }
                        error={ field.error }
                    />
                );
            case ('textarea'):
                return (
                    <FieldTextarea
                        key={ field.name }
                        name={ field.name }
                        label={ field.label }
                        value={ field.value }
                        handleUserInput={ handleUserInput }
                        error={ field.error }
                    />
                );
            case ('select'):
                return (
                    <FieldSelect
                        key={ field.name }
                        name={ field.name }
                        value={ field.value }
                        handleUserInput={ handleUserInput }
                        error={ field.error }
                        options={ [['Select ' + field.label, '']].concat(field.options) }
                    />
                );
        }
    });
}

export const buildCustomFieldsModel = leadFields => {
    const customFields = [];
    
    leadFields.forEach(field => {
        if (field.isActive) {
            switch(field.type) {
                case 'Checkbox':
                    customFields.push({
                        name: field.name,
                        label: field.label,
                        type: field.type.toLowerCase(),
                        rules: [],
                        value: '',
                        error: ''
                    });
                    break;
                
                case 'Select':
                    customFields.push({
                        name: field.name,
                        label: field.label,
                        type: field.type.toLowerCase(),
                        rules: [],
                        options: field.options,
                        value: '',
                        error: ''
                    });
                    break;
                
                case 'Text Area':
                    customFields.push({
                        name: field.name,
                        label: field.label,
                        type: 'textarea',
                        rules: [],
                        value: '',
                        error: ''
                    });
                    break;
                
                default:
                    customFields.push({
                        name: field.name,
                        label: field.label,
                        type: field.type.toLowerCase(),
                        rules: [],
                        value: '',
                        error: ''
                    });
            }
        }
    });
    
    return customFields;
}