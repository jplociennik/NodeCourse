// =============================================================================
// CSV EXPORT SERVICE
// =============================================================================

const { Parser } = require('json2csv');

/**
 * Service for handling CSV export functionality
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const CSV_CONFIG = {
    TASK_FIELDS: [
        { label: 'Nazwa zadania', value: 'taskName' },
        { label: 'Data od', value: 'dateFrom' },
        { label: 'Data do', value: 'dateTo' },
        { label: 'Status', value: 'isDone' }
    ],
    FILENAME_PREFIX: 'tasks',
    BOM: '\uFEFF'
};

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

/**
 * Maps task data for CSV export
 * @param {Object} task - Task object from database
 * @returns {Object} Task data formatted for CSV
 */
const mapTaskForCsv = (task) => ({
    taskName: task.taskName,
    dateFrom: task.dateFrom ? new Date(task.dateFrom).toLocaleDateString('pl-PL') : '',
    dateTo: task.dateTo ? new Date(task.dateTo).toLocaleDateString('pl-PL') : '',
    isDone: task.isDone ? 'Wykonane' : 'Do wykonania'
});

/**
 * Sets CSV response headers
 * @param {Object} res - Express response object
 * @param {string} filename - Custom filename (optional)
 */
const setCsvHeaders = (res, filename = null) => {
    const defaultFilename = `${CSV_CONFIG.FILENAME_PREFIX}-${Date.now()}.csv`;
    const finalFilename = filename || defaultFilename;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${finalFilename}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.attachment(finalFilename);
};

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Exports tasks to CSV format
 * @param {Array} tasks - Array of task objects
 * @param {Object} res - Express response object
 * @param {string} filename - Custom filename (optional)
 * @returns {Promise<string>} CSV content
 */
const exportTasksToCsv = async (tasks, res, filename = null) => {
    try {
        // Set response headers
        setCsvHeaders(res, filename);
        
        // Map tasks for CSV
        const data = tasks.map(mapTaskForCsv);
        
        // Parse to CSV
        const parser = new Parser({ fields: CSV_CONFIG.TASK_FIELDS });
        const csv = parser.parse(data);
        
        // Add BOM for proper UTF-8 encoding
        const csvWithBom = CSV_CONFIG.BOM + csv;
        
        return csvWithBom;
    } catch (error) {
        throw new Error(`Błąd podczas eksportu CSV: ${error.message}`);
    }
};

/**
 * Gets CSV configuration for tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Object} CSV configuration object
 */
const getCsvConfig = (tasks) => {
    const data = tasks.map(mapTaskForCsv);
    
    return {
        fields: CSV_CONFIG.TASK_FIELDS,
        data: data
    };
};

/**
 * Exports filtered tasks to CSV (for filtered export)
 * @param {Array} tasks - Array of filtered task objects
 * @param {Object} res - Express response object
 * @param {Object} filterParams - Filter parameters used (for filename)
 * @returns {Promise<string>} CSV content
 */
const exportFilteredTasksToCsv = async (tasks, res, filterParams = {}) => {
    const timestamp = Date.now();
    const filterSuffix = filterParams.q ? `-${filterParams.q}` : '';
    const filename = `${CSV_CONFIG.FILENAME_PREFIX}-filtered${filterSuffix}-${timestamp}.csv`;
    
    return await exportTasksToCsv(tasks, res, filename);
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    exportTasksToCsv,
    exportFilteredTasksToCsv,
    getCsvConfig,
    mapTaskForCsv
}; 