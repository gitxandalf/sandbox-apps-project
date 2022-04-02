import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import ProfilesDAO from "./data-access-object/profilesDAO.js"

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.PROFILES_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    },
).catch(err => {
    console.error(err.stack)
    process.exit(1)
})
    .then(async client => {
        await ProfilesDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`Now listening on port ${port}...`)
        })
    })
