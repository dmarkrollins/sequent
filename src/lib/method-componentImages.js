import { Meteor } from 'meteor/meteor'
import fs from 'fs'
import { _ } from 'meteor/underscore'

Meteor.methods({
    componentImages() {
        const images = []

        const meteorRoot = fs.realpathSync(`${process.cwd()}/../`);
        const publicPath = `${meteorRoot}/web.browser/app/`;
        const backgroundPath = `${publicPath}/`;
        const bgs = fs.readdirSync(backgroundPath);
        const files = bgs.filter(function (elm) { return elm.match(/.*\.(png)/ig); })

        _.each(files, function (img) {
            images.push({ fileName: `/${img}` })
        })

        return images
    }
})
