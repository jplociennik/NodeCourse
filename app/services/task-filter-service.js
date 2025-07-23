// =============================================================================
// TASK FILTER SERVICE
// =============================================================================

const { Task } = require('../db/mongoose');

/**
 * Service for handling task filtering, sorting, and pagination
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const VALID_LIMITS = [5, 10, 20, 50];
const DEFAULT_LIMIT = 10;

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

/**
 * Validates and returns a safe limit value
 * @param {number} limit - The requested limit
 * @returns {number} Validated limit
 */
const validateLimit = (limit) => {
    const parsedLimit = parseInt(limit) || DEFAULT_LIMIT;
    return VALID_LIMITS.includes(parsedLimit) ? parsedLimit : DEFAULT_LIMIT;
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

/**
 * Builds the where clause for filtering tasks
 * @param {Object} params - Filter parameters
 * @param {string} userId - User ID
 * @returns {Object} Mongoose where clause
 */
const buildWhereClause = (params, userId) => {
    const where = { user: userId };
    
    // Text search (from main form)
    if (params.q && params.q.trim() !== '') {
        where.taskName = { $regex: params.q, $options: 'i' };
    }
    
    // Advanced filters (from session)
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
            delete where.dateFrom; // Remove dateFrom as it's now in $and
            delete where.taskName; // Remove taskName as it's now in $and
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
    
    console.log('buildWhereClause final where:', JSON.stringify(where, null, 2));
    return where;
};

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
const applyPagination = (query, page, limit) => {
    return query.skip((page - 1) * limit).limit(limit);
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
    // Validate and prepare parameters
    const limit = validateLimit(params.limit);
    const q = params.q || '';
    const sort = params.sort || '';
    
    // Build where clause
    const where = buildWhereClause(params, userId);
    
    // Get total count for pagination
    const totalCount = await Task.countDocuments(where);
    const pagesCount = Math.ceil(totalCount / limit);
    
    // Validate page number
    const page = validatePage(params.page, pagesCount);
    
    // Build and execute query
    let query = Task.find(where);
    query = applySorting(query, sort);
    
    // Apply pagination only if not requesting all filtered tasks
    if (!withoutPagination) {
        query = applyPagination(query, page, limit);
    }
    
    const tasks = await query.exec();
    
    // Calculate statistics for all matching tasks (not just current page)
    const todoCount = await Task.countDocuments({ ...where, isDone: false });
    const doneCount = await Task.countDocuments({ ...where, isDone: true });

    return {
        tasks,
        paginationConfig: {
            page,
            pagesCount,
            resultsCount: totalCount,
            limit
        },
        statisticsConfig: {
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
        }
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