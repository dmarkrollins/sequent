import { $ } from 'meteor/jquery'

const UXUtils = {}

UXUtils.findEmailInput = () => $('input#actionEmail')[0].value || ''

module.exports = { UXUtils }
