import ProfilesDAO from "../data-access-object/profilesDAO.js"

export default class ProfilesController {

    static async apiGetProfiles(req, res, next) {

        const profilesPerPage = req.query.profilesPerPage ? parseInt(req.query.profilesPerPage, 1) : 3
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}

        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.email) {
            filters.email = req.query.email
        } else if (req.query.password) {
            filters.password = req.query.password
        } else if (req.query.bio) {
            filters.bio = req.query.bio
        } else if (req.query.profile_image) {
            filters.profile_image = req.query.profile_image
        }

        const { profilesList, totalNumProfiles } = await ProfilesDAO.getProfiles({
            filters,
            page,
            profilesPerPage
        })

        let response = {
            profiles: profilesList,
            page: page,
            filters: filters,
            entries_per_page: profilesPerPage,
            total_results: totalNumProfiles
        }
        res.json(response)
    }


    static async apiUpdateProfile(req, res, next) {
        try {

            const profileId = req.body._id
            const bio = req.body.bio
            const profileImage = req.body.profile_image
            const name = req.body.name
            const userId = req.body.user_id

            // const userInfo = {
            //     name: req.body.name,
            //     _id: req.body.user_id,
            // }

            const updateResponse = await ProfilesDAO.updateProfile(
                profileId,
                userId,
                name,
                bio,
                profileImage,
            )

            const { error } = updateResponse

            if (error) {
                res.status(400).json({ error })
            }

            if (updateResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update profile - user may not be original profile owner."
                )
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}