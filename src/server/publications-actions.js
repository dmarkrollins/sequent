import { Meteor } from 'meteor/meteor'
import { Sequent, RetroActions } from '../lib/sequent'
import { Constants } from '../lib/constants'

RetroActions._ensureIndex('createdBy', 1)
RetroActions._ensureIndex('status', 1)
RetroActions._ensureIndex('createdAt', 1)


Meteor.publish('open-actions', function () {
    if (!Meteor.userId()) {
        return null
    }

    return RetroActions.find({
        createdBy: Meteor.userId(),
        $or: [
            { status: Constants.RetroItemStatuses.PENDING },
            {
                status: Constants.RetroItemStatuses.COMPLETE,
                completedAt: { $gt: new Date(Date.now() - (24 * 60 * 60 * 1000)) }
            }
        ]
    })
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
