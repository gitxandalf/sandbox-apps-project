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
}