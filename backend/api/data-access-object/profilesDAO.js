let profiles

export default class ProfilesDAO {
    static async injectDB(conn) {
        if (profiles) {
            return
        }
        try{
            profiles = await conn.db(process.env.PROFILES_DB_NS).collection("")
        }
    }
}