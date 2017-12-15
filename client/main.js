import moment from 'moment'

Meteor.startup( () => {
    BlazeLayout.setRoot('body')
})

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}

Template.registerHelper('formatDate', function(value) {
    if(_.isDate(value)){
        var d = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
        return moment(d).format("MM-DD-YYYY");
    }
    else{
        return "";
    }
});