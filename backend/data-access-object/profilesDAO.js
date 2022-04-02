let profiles

export default class ProfilesDAO {
    static async injectDB(conn) {
        if (profiles) {
            return
        }
        try {
            profiles = await conn.db(process.env.PROFILES_DB_NS).collection("profiles")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in profilesDAO: ${e}`
            )
        }
    }

    static async getProfiles({
        filters = null,
        page = 0,
        profilesPerPage = 3,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            } else if ("email" in filters) {
                query = { "email": { $eq: filters["email"] } }
            } else if ("password" in filters) {
                query = { "password": { $eq: filters["password"] } }
            }
        }

        let cursor

        try {
            cursor = await profiles
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { profilesList: [], totalNumProfiles: 0 }
        }

        const displayCursor = cursor.limit(profilesPerPage).skip(profilesPerPage * page)

        try {
            const profilesList = await displayCursor.toArray()
            const totalNumProfiles = await profiles.countDocuments(query)

            return { profilesList, totalNumProfiles }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem encountered when counting documents, ${e}`
            )
            return { profilesList: [], totalNumProfiles: 0 }
        }
    }
}