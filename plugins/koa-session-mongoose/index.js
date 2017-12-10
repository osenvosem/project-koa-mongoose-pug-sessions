const createModel = require("./SessionModel");

class MongooseSessionStore {
  constructor(options) {
    this.Model = createModel(options);
  }
  async get(sid, maxAge, options) {
    const session = await this.Model.findOne({ sid }).lean();
    return session ? session.data : null;
  }
  async set(sid, sessionData, maxAge, options) {
    await this.Model.findOneAndUpdate(
      { sid },
      { data: sessionData },
      { upsert: true }
    );
  }
  async destroy(sid) {
    await this.Model.findOneAndRemove({ sid });
  }
}

module.exports = MongooseSessionStore;
