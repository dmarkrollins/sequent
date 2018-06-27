import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'
import { Sequent } from '../../lib/sequent'

import './confirmDialog.html'

let dialogMode = 'modal-header-warning';

const ConfirmDialog = {}

ConfirmDialog.showConfirmation = function (message, title, mode, params, okCB, cancelCB) {
    if (!message) {
        message = Sequent.defaultConfirmMsg;
    }

    if (_.isUndefined(mode)) {
        dialogMode = 'modal-header-warning';
    } else {
        let dmode = _.find(['warning', 'success', 'info', 'primary', 'danger'], function (m) { return m === mode; });

        if (typeof dmode === 'undefined') {
            dmode = 'warning';
        }

        dialogMode = `modal-header-${dmode}`;
    }

    $('#dialogHeader').removeClass();
    $('#dialogHeader').addClass(dialogMode);

    $('#confirmMessage').html(message);

    if (title) {
        $('#confirmTitle').html(title);
    }

    const doCB = _.isFunction(okCB);
    const doCloseCB = _.isFunction(cancelCB)

    if (doCB && doCloseCB) {
        $('#confirmDialog').modal('show')
            .off('click', '#btnConfirm')
            .one('click', '#btnConfirm', function () { okCB(params); })
            .one('hidden.bs.modal', null, cancelCB);
    } else if (doCB) {
        $('#confirmDialog').modal('show')
            .off('click', '#btnConfirm')
            .one('click', '#btnConfirm', function () { okCB(params); });
    } else if (doCloseCB) {
        $('#confirmDialog').modal('show')
            .one('hidden.bs.modal', null, cancelCB);
    } else {
        $('#confirmDialog').modal('show');
    }
}

module.exports = { ConfirmDialog }
