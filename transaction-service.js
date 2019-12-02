const Dals = require('./dals');

module.exports = {
  /******************************************************************/
  startNewSession: async () => {
    const { db } = Dals;
    const session = await db.startSession();
    await session.startTransaction();
    return session;
  },
  endSession: (session) => session.commitTransaction(),
  abort: (session) => session.abortTransaction(),
};
