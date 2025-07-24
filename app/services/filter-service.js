/**
 * Validates and returns a safe limit value
 * @param {number} limit - The requested limit
 * @param {Array} validLimits - Array of valid limit values
 * @param {number} defaultLimit - Default limit value
 * @returns {number} Validated limit
 */
const validateLimit = (limit, validLimits, defaultLimit) => {
    const parsedLimit = parseInt(limit) || defaultLimit;
    return validLimits.includes(parsedLimit) ? parsedLimit : defaultLimit;
};

/**
 * Validates and returns a safe page number
 * @param {number} page - The requested page
 * @param {number} pagesCount - Total number of pages
 * @returns {number} Validated page number
 */
const validatePage = (page, pagesCount) => {
    const parsedPage = parseInt(page) || 1;
    if (parsedPage > pagesCount && pagesCount > 0) {
        return 1; // Reset to first page if current page is out of range
    }
    return parsedPage;
};

// =============================================================================
// QUERY MANIPULATION FUNCTIONS
// =============================================================================

/**
 * Applies sorting to the query
 * @param {Object} query - Mongoose query object
 * @param {string} sort - Sort parameter (e.g., "taskName|asc")
 * @returns {Object} Query with sorting applied
 */
const applySorting = (query, sort) => {
    if (sort && sort.trim() !== '') {
        const sortParts = sort.split('|');
        const sortDirection = sortParts[1] === 'desc' ? -1 : 1;
        return query.sort({ [sortParts[0]]: sortDirection });
    }
    return query;
};

/**
 * Applies pagination to the query
 * @param {Object} query - Mongoose query object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Query with pagination applied
 */
const applyPagination = (query, page, limit) => query.skip((page - 1) * limit).limit(limit);

// =============================================================================
// SHARED FILTERING FUNCTIONS
// =============================================================================

/**
 * Adds text search condition to where clause
 * @param {Object} where - Where clause object
 * @param {Object} params - Filter parameters
 * @param {string} searchField - Field name to search in
 */
const addTextSearchCondition = (where, params, searchField) => {
    if (params.q && params.q.trim() !== '') 
        where[searchField] = { $regex: params.q, $options: 'i' };
};

/**
 * Creates basic statistics configuration
 * @param {Array} items - Array of items
 * @param {string} title - Statistics title
 * @param {string} itemLabel - Label for items (e.g., 'użytkowników', 'zadań')
 * @returns {Object} Statistics configuration
 */
const createBasicStatistics = (items, title, itemLabel) => {
    const totalCount = items.length;
    return {
        show: totalCount > 0,
        title: title,
        items: [
            {
                id: 'totalCount',
                value: totalCount,
                label: `Wszystkich ${itemLabel}`
            },
            {
                id: 'visibleCount',
                value: totalCount,
                label: `Widocznych ${itemLabel}`
            }
        ]
    };
};

/**
 * Generic filtering function for simple cases
 * @param {Object} Model - Mongoose model
 * @param {Object} params - Filter parameters
 * @param {string} searchField - Field to search in
 * @param {string} statisticsTitle - Title for statistics
 * @param {string} itemLabel - Label for items in statistics
 * @returns {Object} Object containing items and statistics
 */
const getFilteredItems = async (Model, params, searchField, statisticsTitle, itemLabel) => {
    const where = {};
    addTextSearchCondition(where, params, searchField);
    
    let query = Model.find(where);
    query = applySorting(query, params.sort || '');
    query = applyPagination(query, params.page || 1, params.limit || 10);
    
    const items = await query.exec();
    const statisticsConfig = createBasicStatistics(items, statisticsTitle, itemLabel);

    return {
        items,
        statisticsConfig
    };
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    validateLimit,
    validatePage,
    applySorting,
    applyPagination,
    addTextSearchCondition,
    createBasicStatistics,
    getFilteredItems
}; 