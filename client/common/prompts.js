import { Random } from 'meteor/random'
const RetroPrompts = {
    
    prompts: [
        "How's the balanced team thing going?",
        "Cite examples of what's working well",
        "Choose an Engineering Challenge",
        "Where do we have room for improvement?",
        "Express your feelings in single words",
        "We succeed when...",
        "Compliment someone!",
        "Invent a feature our product needs",
        "Who else should we talk too?",
        "It would be amazing if...",
        "What's blocking us?",
        "What timing issues do we have?",
        "How can we boost our momentum?",
        "How can we improve team mechanics?",
        "How could we market ourselves better?",
        "What do we still need to discover?",
        "Do we have stake holder alignment concerns?",
        "Choose a PM Challenge",
        "What have we succeeded at so far?",
        "What are we avoiding that we shouldn't be?",
        "What makes us feel uncomfortable?",
        "How could we become more empowered?",
        "What information do we need to succeed?",
        "Team building ideas",
        "Who can we partner with to be more effective?",
        "Pick a location and date for our next team lunch",
        "Team member cross training ideas",
        "How can we make our demo better?",
        "Identify upcoming product sales opportunities",
        "Customer engagement ideas",
        "How can we make our feature announcements better?",
        "Are we talking to our customers enough?",
        "Pick a week to innnovate",
        "Choose a Design Challenge"
    ],

    getRandomPromptSet() {

        const happy = Random.choice(this.prompts)
        const meh = Random.choice(this.prompts)
        const sad = Random.choice(this.prompts)
        
        while (happy === meh) {
            meh = Random.choice(this.prompts)
        }

        while(sad === meh || sad === happy) {
            sad = Random.choice(this.prompts)
        }

        return {
            happyPlaceholder: happy,
            mehPlaceholder: meh,
            sadPlaceholder: sad
        }

    }
}

module.exports = { RetroPrompts }
