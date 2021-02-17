import { _ } from 'meteor/underscore'

const ConvertRetro = (settings, retro) => {
    const items = []

    let doc = ''

    doc += `"${settings.happyPlaceholder}","${settings.mehPlaceholder}","${settings.sadPlaceholder}"\n`

    const happy = _.filter(retro.items, item => item.itemType.toLowerCase() === 'happy')
    happy.forEach((item) => {
        items.push({
            happy: item.title.replace('"', ''),
            meh: '',
            sad: ''
        })
    })

    const meh = _.filter(retro.items, item => item.itemType.toLowerCase() === 'meh')
    meh.forEach((item) => {
        const next = _.find(items, i => i.meh === '')
        if (next) {
            next.meh = item.title
        } else {
            items.push({
                happy: '',
                meh: item.title.replace('"', ''),
                sad: ''
            })
        }
    })

    const sad = _.filter(retro.items, item => item.itemType.toLowerCase() === 'sad')
    sad.forEach((item) => {
        const next = _.find(items, i => i.sad === '')
        if (next) {
            next.sad = item.title
        } else {
            items.push({
                happy: '',
                meh: '',
                sad: item.title.replace('"', '')
            })
        }
    })

    items.forEach((item) => {
        doc += `"${item.happy}","${item.meh}","${item.sad}"\n`
    })

    return doc
}

module.exports = { ConvertRetro }
