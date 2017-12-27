const fixtures = {
    resetAll: function () {
        // make sure the DDP connection is not logged in before clearing the database
        server.call('logout')
        server.execute(function () {
            Package['xolvio:cleaner'].resetDatabase()
        })
    }
}

  module.exports = fixtures

