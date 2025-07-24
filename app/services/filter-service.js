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
 * @param {Object} customConfig - Optional custom configuration for dual statistics
 * @param {number} customConfig.firstCount - Count for first category
 * @param {number} customConfig.secondCount - Count for second category
 * @param {string} customConfig.firstLabel - Label for first category
 * @param {string} customConfig.secondLabel - Label for second category
 * @param {string} customConfig.firstId - ID for first category element
 * @param {string} customConfig.secondId - ID for second category element
 * @returns {Object} Statistics configuration
 */
const createBasicStatistics = (items, title, itemLabel, customConfig = null) => {
    // If custom config is provided, create dual statistics
    if (customConfig && customConfig.firstCount !== undefined && customConfig.secondCount !== undefined) {
        const totalCount = customConfig.firstCount + customConfig.secondCount;
        return {
            show: totalCount > 0,
            title: title,
            items: [
                {
                    id: customConfig.firstId || 'firstCount',
                    value: customConfig.firstCount,
                    label: customConfig.firstLabel
                },
                {
                    id: customConfig.secondId || 'secondCount',
                    value: customConfig.secondCount,
                    label: customConfig.secondLabel
                }
            ]
        };
    }
    
    // Default statistics
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
 * @param {boolean} paginationEnabled - Whether to enable pagination
 * @param {Object} customStatistics - Optional custom statistics configuration
 * @param {Function} customStatistics.counter - Function to count items for custom statistics
 * @param {Function} customStatistics.creator - Function to create statistics config
 * @returns {Object} Object containing items and statistics
 */
const getFilteredItems = async (Model, params, searchField, statisticsTitle, itemLabel, paginationEnabled, customStatistics = null) => {
    const where = {};
    addTextSearchCondition(where, params, searchField);
    
    let query = Model.find(where);
    query = applySorting(query, params.sort || '');
    if (paginationEnabled) {
        query = applyPagination(query, params.page || 1, params.limit || 10);
    }
    
    const items = await query.exec();
    
    let statisticsConfig;
    // Only use custom statistics if customStatistics is provided and has required functions
    if (customStatistics && typeof customStatistics.counter === 'function' && typeof customStatistics.creator === 'function') {
        // Use custom statistics
        const counts = await customStatistics.counter(where);
        statisticsConfig = customStatistics.creator(counts, statisticsTitle);
    } else {
        // Use default statistics
        statisticsConfig = createBasicStatistics(items, statisticsTitle, itemLabel);
    }

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