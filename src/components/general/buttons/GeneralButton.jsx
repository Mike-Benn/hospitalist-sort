
function GeneralButton ({  buttonType , buttonText , onClick, value, name }) {
    return (
        <button type={buttonType} onClick={onClick} value={value} name={name} >{buttonText}</button>
    )
}


export default GeneralButton