import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import { Sequent, RetroActions } from '../lib/sequent'
import { Constants } from '../lib/constants'

RetroActions._ensureIndex('createdBy', 1)
RetroActions._ensureIndex('status', 1)
RetroActions._ensureIndex('createdAt', 1)

Meteor.publish('open-actions', function () {
    if (!this.userId) {
        this.stop()
        return null
    }

    return RetroActions.find({
        createdBy: this.userId,
        status: Constants.RetroItemStatuses.PENDING
    })
});

Meteor.publish('all-actions', function (search) {
    if (!this.userId) {
        return null
    }

    if (!Match.test(search, { limit: Number, showAll: Boolean })) {
        return null
    }

    const query = {
        createdBy: this.userId
    }

    if (!search.showAll) {
        query.status = Constants.RetroItemStatuses.PENDING
    }

    return RetroActions.find(query, { sort: { completedAt: 1 }, limit: search.limit })
});

/*
messages.find({'metadata.thread': threadId},
  {
    sort: {'date' : sort},
    limit: limit,
    disableOplog: true,
    pollingThrottleMs: 12000,
    pollingIntervalMs: 12000
  }
);
*/
