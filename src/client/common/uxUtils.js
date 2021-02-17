import { $ } from 'meteor/jquery'

const UXUtils = {}

UXUtils.findEmailInput = () => $('input#actionEmail')[0].value || ''

UXUtils.remainingChars = (value) => {
    let rem = 255 - value.length

    if (rem < 0) {
        rem = 0
    }

    return `${rem}/255`
}

module.exports = { UXUtils }
