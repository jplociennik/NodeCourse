const FilterConfigService = require('../../services/filter-config-service.js');

const UserControllerConfig = {
  /**
   * Gets sort fields configuration for users
   * @returns {Object} Sort fields configuration
   */
  getSortFieldsConfig: () => {
    return {
      label: 'Sortuj według',
      options: [
        { value: '', text: 'Domyślne', field: null, direction: null },
        { value: 'name|asc', text: 'Nazwa A-Z', field: 'name', direction: 'asc' },
        { value: 'name|desc', text: 'Nazwa Z-A', field: 'name', direction: 'desc' },
        { value: 'createdAt|asc', text: 'Najstarsze', field: 'createdAt', direction: 'asc' },
        { value: 'createdAt|desc', text: 'Najnowsze', field: 'createdAt', direction: 'desc' }
      ]
    };
  },

  /**
   * Gets complete filter configuration for users
   * @returns {Object} Complete filter configuration
   */
  getMainFilterConfig: () => {
    return FilterConfigService.createFilterConfig({
      formAction: '/profile',
      title: 'Wyszukiwanie i sortowanie',
      icon: 'bi bi-funnel',
      searchConfig: {
        placeholder: 'Szukaj użytkowników...',
        label: 'Szukaj użytkowników'
      },
      sortConfig: UserControllerConfig.getSortFieldsConfig(),
      features: ['search', 'sort']
    });
  }

};

module.exports = { UserControllerConfig }; 