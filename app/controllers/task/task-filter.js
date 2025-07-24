const { Task } = require('../../db/mongoose.js');
const FilterService = require('../../services/filter-service.js');

const VALID_LIMITS = [5, 10, 20, 50];
const DEFAULT_LIMIT = 10;

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

/**
 * Calculates todo and done counts based on filter conditions
 * @param {Object} where - Where clause for filtering
 * @param {number} totalCount - Total count of filtered tasks
 * @returns {Object} Object with todoCount and doneCount
 */
const calculateTaskStatistics = async (where, totalCount) => {
    if (where.isDone === true) 
        return { todoCount: 0, doneCount: totalCount };  
    if (where.isDone === false) 
        return { todoCount: totalCount, doneCount: 0 };
       
    const [todoCount, doneCount] = await Promise.all([
        Task.countDocuments({ ...where, isDone: false }),
        Task.countDocuments({ ...where, isDone: true })
    ]);
    
    return { todoCount, doneCount };
};

/**
 * Builds the where clause for filtering tasks
 * @param {Object} params - Filter parameters
 * @param {string} userId - User ID
 * @returns {Object} Mongoose where clause
 */
const buildWhereClause = (params, userId) => {
    const where = { user: userId };
    
    FilterService.addTextSearchCondition(where, params, 'taskName');
    
    if (params.dateFrom && params.dateFrom.trim() !== '') {
        where.dateFrom = { $gte: params.dateFrom };
    }
    
    if (params.dateTo && params.dateTo.trim() !== '') {
        // Create $and array to combine dateTo with other conditions
        const dateToCondition = {
            $or: [
                { dateTo: { $lte: params.dateTo } },
                { dateTo: null, dateFrom: { $lte: params.dateTo } }
            ]
        };
        
        // If we already have other conditions, use $and
        if (Object.keys(where).length > 1) {
            const existingConditions = { ...where };
            delete existingConditions.user; // Remove user condition temporarily
            
            where.$and = [
                existingConditions,
                dateToCondition
            ];
            delete where.dateFrom;
            delete where.taskName;
        } else {
            // If only user condition exists, just add dateTo
            Object.assign(where, dateToCondition);
        }
    }
    
    if (params.done === 'on') {
        where.isDone = true;
    }
    
    if (params.todo === 'on') {
        where.isDone = false;
    }
    return where;
};

/**
 * Creates task-specific statistics configuration
 * @param {number} todoCount - Number of todo tasks
 * @param {number} doneCount - Number of done tasks
 * @returns {Object} Statistics configuration
 */
const createTaskStatistics = (todoCount, doneCount) => {
    const totalCount = todoCount + doneCount;
    return {
        show: totalCount > 0,
        title: 'Statystyki zadań',
        items: [
            {
                id: 'todoCount',
                value: todoCount,
                label: 'Do zrobienia'
            },
            {
                id: 'doneCount',
                value: doneCount,
                label: 'Wykonane'
            }
        ]
    };
};

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Gets filtered and paginated tasks
 * @param {Object} params - Filter parameters (q, sort, page, limit, filterState)
 * @param {string} userId - User ID
 * @param {boolean} withoutPagination - If true, returns all filtered tasks without pagination
 * @returns {Object} Object containing tasks, pagination config, and statistics
 */
const getFilteredTasks = async (params, userId, withoutPagination = false) => {
    // Validate and prepare parameters using shared functions
    const limit = FilterService.validateLimit(params.limit, VALID_LIMITS, DEFAULT_LIMIT);
    const sort = params.sort || '';
    
    // Build where clause
    const where = buildWhereClause(params, userId);
    
    // Get total count for pagination
    const totalCount = await Task.countDocuments(where);
    const pagesCount = Math.ceil(totalCount / limit);
    
    // Validate page number using shared function
    const page = FilterService.validatePage(params.page, pagesCount);
    
    // Calculate statistics for all matching tasks (not just current page)
    const { todoCount, doneCount } = await calculateTaskStatistics(where, totalCount);

    // Build and execute query using shared functions
    let query = Task.find(where);
    query = FilterService.applySorting(query, sort);
    
    // Apply pagination only if not requesting all filtered tasks
    if (!withoutPagination) {
        query = FilterService.applyPagination(query, page, limit);
    }
    
    const tasks = await query.exec();

    return {
        tasks,
        paginationConfig: {
            page,
            pagesCount,
            resultsCount: totalCount,
            limit
        },
        statisticsConfig: createTaskStatistics(todoCount, doneCount)
    };
};

/**
 * Saves filter state to session
 * @param {Object} session - Express session object
 * @param {Object} query - Query parameters
 */
const saveFilterState = (session, query) => {
    session.filterState = {
        advancedFiltersOpen: query.advancedFiltersOpen === 'true',
        q: query.q || '', // Save search query
        sort: query.sort || '', // Save sort parameter
        dateFrom: query.dateFrom || '',
        dateTo: query.dateTo || '',
        enable_dateFrom: query.enable_dateFrom || null,
        enable_dateTo: query.enable_dateTo || null,
        done: query.done || null,
        todo: query.todo || null
    };
};

/**
 * Gets filter state from session with defaults
 * @param {Object} session - Express session object
 * @returns {Object} Filter state object
 */
const getFilterState = (session) => {
    return session.filterState || {
        advancedFiltersOpen: false,
        q: '', // Default empty search
        sort: '', // Default empty sort
        dateFrom: '',
        dateTo: '',
        enable_dateFrom: null,
        enable_dateTo: null,
        done: null,
        todo: null
    };
};

/**
 * Clears filter state from session
 * @param {Object} session - Express session object
 */
const clearFilterState = (session) => {
    session.filterState = null;
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    getFilteredTasks,
    saveFilterState,
    getFilterState,
    clearFilterState
}; 