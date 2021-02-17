import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Settings, Retros } from '../lib/sequent'
import { ConvertRetro } from './convertRetro'


WebApp.connectHandlers.use('/export/retro', (req, res, next) => {
    const { id } = req.query

    const retro = Retros.findOne(id)
    if (!retro) {
        res.writeHead(400);
        res.end('Retro not found!');
    }

    let settings = Settings.findOne({ createdBy: retro.createdBy })
    if (!settings) {
        settings = {
            happyPlaceholder: ':)',
            mehPlaceholder: ':|',
            sadPlaceholder: ':('
        }
    }

    const user = Meteor.users.findOne({ _id: retro.createdBy })
    if (!user) {
        user.username = 'sequent'
    }

    const doc = ConvertRetro(settings, retro)

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${user.username}-export.csv`)

    res.end(doc);
});
