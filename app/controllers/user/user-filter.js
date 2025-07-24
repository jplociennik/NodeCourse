const { User } = require('../../db/mongoose.js');
const FilterService = require('../../services/filter-service.js');

/**
 * Gets filtered and sorted users
 * @param {Object} params - Filter parameters (q, sort)
 * @returns {Object} Object containing users and statistics
 */
const getFilteredUsers = async (params) => {
    // Custom statistics configuration for users - only created when needed
    let customStatistics = {
        counter: async (where) => {
            const [adminCount, regularUserCount] = await Promise.all([
                User.countDocuments({ ...where, isAdmin: true }),
                User.countDocuments({ ...where, isAdmin: false })
            ]);
            return { adminCount, regularUserCount };
        },
        creator: (counts, title) => {
            return FilterService.createBasicStatistics(
                [], // items array not needed for custom stats
                title,
                'użytkowników',
                {
                    firstCount: counts.adminCount,
                    secondCount: counts.regularUserCount,
                    firstLabel: 'Administratorzy',
                    secondLabel: 'Użytkownicy',
                    firstId: 'adminCount',
                    secondId: 'regularUserCount'
                }
            );
        }
    };

    const { items: users, statisticsConfig } = await FilterService.getFilteredItems(
        Model = User, 
        params = params, 
        searchField = 'name', 
        statisticsTitle = 'Statystyki użytkowników', 
        itemLabel = 'użytkowników',
        paginationEnabled = false,
        customStatistics = customStatistics
    );

    console.log(statisticsConfig)
    return {
        users,
        statisticsConfig
    };
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    getFilteredUsers
}; 