import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Settings, Retros } from '../lib/sequent'
import { ConvertRetro } from './convertRetro'


WebApp.connectHandlers.use('/export/retro', (req, res, next) => {
    const { id } = req.query

    console.log('The id in the query string', id)

    const retro = Retros.findOne(id)
    if (!retro) {
        res.writeHead(400);
        res.end('Retro not found!');
    }

    console.log(retro)

    let settings = Settings.findOne({ createdBy: retro.createdBy })
    if (!settings) {
        settings = {
            happyPlaceholder: ':)',
            mehPlaceholder: ':-',
            sadPlaceholder: ':('
        }
    }

    console.log(settings)

    const doc = ConvertRetro(settings, retro)

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sequentexport.csv')

    res.end(doc);
});
