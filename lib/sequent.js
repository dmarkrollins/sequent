import { Mongo } from 'meteor/mongo'
import { Schemas } from './schemas'


// global var
const Sequent = {

}

const Retros = new Mongo.Collection('retros')
const RetroActions = new Mongo.Collection('retro-actions')

Retros.attachSchema(Schemas.Retros)
RetroActions.attachSchema(Schemas.Actions)

module.exports = { Sequent, Retros, RetroActions }
