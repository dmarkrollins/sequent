import { Meteor } from 'meteor/meteor'
import fs from 'fs'
import { Backgrounds } from '../lib/sequent'

Meteor.publish('backgrounds', function() {
    const self = this;
    const meteorRoot = fs.realpathSync( process.cwd() + '/../' );
    const publicPath = meteorRoot + '/web.browser/app/';
    const backgroundPath = publicPath + '/backgrounds/';
    const bgs = fs.readdirSync(backgroundPath);
    _.each(bgs, function(background) {
            const backgroundName = background.split('.')[0].toProperCase()
            // console.log('background', backgroundName, background)
            self.added('backgrounds', background, { name: backgroundName, 'value': '/backgrounds/' + background });
    })
    this.ready();
});