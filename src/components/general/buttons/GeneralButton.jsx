import PropTypes from "prop-types";

function GeneralButton ({  buttonType , buttonText , onClick, value, name }) {
    return (
        <button type={buttonType} onClick={onClick} value={value} name={name} >{buttonText}</button>
    )
}

GeneralButton.propTypes = {
    buttonType: PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
    name: PropTypes.string,
}

export default GeneralButton