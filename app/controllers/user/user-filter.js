const { User } = require('../../db/mongoose.js');
const FilterService = require('../../services/filter-service.js');

/**
 * Gets filtered and sorted users
 * @param {Object} params - Filter parameters (q, sort)
 * @returns {Object} Object containing users and statistics
 */
const getFilteredUsers = async (params) => {
    const { items: users, statisticsConfig } = await FilterService.getFilteredItems(
        User, 
        params, 
        'name', 
        'Statystyki użytkowników', 
        'użytkowników'
    );

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