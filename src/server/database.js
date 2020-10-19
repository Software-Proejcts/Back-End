const { MongoClient } = require('mongodb');

// https://docs.mongodb.com/drivers/node/quick-start
class MongoDBHandler {
    constructor(user, pass, cluster) {
        this.uri = `mongodb+srv://${user}:${pass}@${cluster}?retryWrites=true&w=majority`;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    
    async connect() {
        try {
            await this.client.connect();
            this.connected = true;
        } catch (e) {
            console.error(e);
        }
    }
    
    async listDatabases() {
        var databasesList = await this.client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    }

    async Find(database, collection, query) {
        return await this.client.db(database).collection(collection).findOne(query);
    }

    async close() {
        await this.client.close();
    }
}

module.exports = MongoDBHandler