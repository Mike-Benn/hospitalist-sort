import PropTypes from 'prop-types'

function DateField({ fieldClass , fieldId , labelText , onChange , value , name}) {
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="date" id={fieldId} value={value} onChange={onChange} name={name}></input>
        </div>
    )
}

function NumberField({ fieldClass , fieldId , labelText , onChange , value , name }) {
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="number" id={fieldId} value={value} onChange={onChange} name={name} />
        </div>
    )
}

function GeneralInputField({ inputType, fieldClass, fieldId, labelText, onChange, value, name }) {
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type={inputType} id={fieldId} value={value} onChange={onChange} name={name} />
        </div>
    )
}

function TextField({ fieldClass , fieldId , labelText , onChange , value , name }) {

    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="text" id={fieldId} value={value} onChange={onChange} name={name}></input>
        </div>
    )       
}

function PasswordField({ fieldClass , fieldId , labelText , onChange , value }) {

    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="password" id={fieldId} value={value} onChange={onChange}></input>
        </div>
    )       
}

function FileAttachField({ fieldClass, fieldId, labelText, onChange, accepts, file }) {
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="file" id={fieldId} onChange={onChange} accept={accepts}></input>
            {file && <p>Uploaded File: {file.name}</p>}
        </div>
    )
}

function SelectField({ fieldClass , fieldId , labelText , optionList = [] , onChange , value , optionTextAccessor , optionIdAccessor , name , defaultOptions = [] }) {
    let options = [
        ...defaultOptions,
        ...optionList.map(option =>
            <option key={option[optionIdAccessor]} value={option[optionIdAccessor]}>{option[optionTextAccessor]}</option>
        )
    ]
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <select id={fieldId} value={value} onChange={onChange} name={name}>{options}</select>
        </div>
    )
}

function CheckboxField({ fieldClass, fieldId, labelText, onChange, checked, name }) {
    return (
        <div className={fieldClass}>
            <label htmlFor={fieldId}>{labelText}</label>
            <input type="checkbox" id={fieldId} checked={checked} onChange={onChange} name={name} />
        </div>
    )
}

CheckboxField.propTypes = {
    fieldClass: PropTypes.string,
    fieldId: PropTypes.string,
    labelText: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    name: PropTypes.string,

}

GeneralInputField.propTypes = {
    inputType: PropTypes.string,
    fieldClass: PropTypes.string,
    fieldId: PropTypes.string,
    labelText: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string,
}

PasswordField.propTypes = {
   fieldClass: PropTypes.string,
   fieldId: PropTypes.string,
   labelText: PropTypes.string,
   onChange: PropTypes.func,
   value: PropTypes.string,
}

TextField.propTypes = {
   fieldClass: PropTypes.string,
   fieldId: PropTypes.string,
   labelText: PropTypes.string,
   onChange: PropTypes.func,
   value: PropTypes.string,
   name: PropTypes.string,
}

SelectField.propTypes = {
    fieldClass: PropTypes.string,
    fieldId: PropTypes.string,
    labelText: PropTypes.string,
    optionList: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
    optionTextAccessor: PropTypes.string,
    optionIdAccessor: PropTypes.string,
    name: PropTypes.string,
    defaultOptions: PropTypes.array,
}

DateField.propTypes = {
    fieldClass: PropTypes.string,
    fieldId: PropTypes.string,
    labelText: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string,
}

NumberField.propTypes = {
    fieldClass: PropTypes.string,
    fieldId: PropTypes.string,
    labelText: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    name: PropTypes.string,
}



export { 
    TextField, 
    DateField, 
    NumberField,
    PasswordField,
    SelectField,
    GeneralInputField,
    CheckboxField,
    FileAttachField,
}