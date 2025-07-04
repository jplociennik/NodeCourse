# Przewodnik stylu kodowania

## Ogólne zasady

1. Używamy funkcji strzałkowych zamiast klas:
```javascript
// ❌ Nie używaj klas
class SearchModule {
    constructor(manager) {
        this.manager = manager;
    }
    
    search() {
        // ...
    }
}

// ✅ Używaj funkcji strzałkowych i domknięć
const SearchModule = (manager) => {
    const search = () => {
        // ...
    };
    
    return { search };
};
```

2. Unikamy nadmiernej abstrakcji - funkcje pomocnicze tylko gdy są faktycznie używane w wielu miejscach:
```javascript
// ❌ Nie twórz funkcji pomocniczych dla pojedynczego użycia
const getFilterCheckboxState = (filterId) => {
    return document.querySelector(`#filter_${filterId}`).checked;
};

// ✅ Używaj bezpośrednio DOM API dla prostych operacji
const checkbox = document.querySelector('#filter_done');
if (checkbox?.checked) {
    // ...
}
```

3. Grupujemy powiązane funkcje w moduły, ale nie tworzymy niepotrzebnych warstw abstrakcji:
```javascript
// ❌ Nie twórz niepotrzebnych warstw
const FilterUtils = {
    toggleContainer: (id, show) => {
        document.querySelector(id).style.display = show ? 'block' : 'none';
    }
};

// ✅ Używaj bezpośrednio DOM API dla prostych operacji
container.style.display = isVisible ? 'none' : 'block';
```

## Struktura modułów

1. Eksportuj tylko to, co jest faktycznie używane w innych modułach:
```javascript
// ❌ Nie eksportuj wszystkiego
export { 
    initModule,  // używane
    helperFunction,  // nieużywane
    internalFunction  // nieużywane
};

// ✅ Eksportuj tylko to, co jest używane
export { initModule };
```

2. Preferuj eksport domyślny dla głównej funkcjonalności modułu:
```javascript
// ✅ Eksport domyślny dla głównej funkcjonalności
const FilterModule = (manager) => {
    // ...
};

export default FilterModule;
```

## Obsługa DOM

1. Używaj uniwersalnych funkcji pomocniczych z `dom-utils.js` dla często wykonywanych operacji:
```javascript
// ❌ Nie duplikuj kodu
items.forEach(item => {
    item.style.display = 'none';
});

// ✅ Używaj funkcji pomocniczych
DOMUtils.hideItems(items);
```

2. Dla prostych, jednorazowych operacji używaj bezpośrednio DOM API:
```javascript
// ❌ Nie twórz funkcji pomocniczych dla prostych operacji
const setCheckboxState = (checkbox, state) => {
    checkbox.checked = state;
};

// ✅ Używaj bezpośrednio DOM API
checkbox.checked = false;
```

## Komentarze i dokumentacja

1. Używaj komentarzy JSDoc tylko dla funkcji eksportowanych i skomplikowanych:
```javascript
// ❌ Nie dokumentuj wszystkiego
/**
 * Sets display to none
 * @param {HTMLElement} element - Element to hide
 */
const hideElement = (element) => {
    element.style.display = 'none';
};

// ✅ Dokumentuj tylko złożone funkcje
/**
 * Applies advanced filters and updates URL state
 * @param {FilterManager} manager - Filter manager instance
 * @returns {Promise<void>}
 */
const applyAdvancedFilters = async (manager) => {
    // ...
};
```

2. Używaj krótkich, opisowych komentarzy dla sekcji kodu:
```javascript
// ❌ Nie używaj nadmiernych separatorów
// =============================================================================
// FILTER INITIALIZATION
// =============================================================================

// ✅ Używaj prostych, opisowych komentarzy
// Inicjalizacja filtrów
```

## Obsługa błędów

1. Używaj operatora opcjonalnego łańcuchowania dla bezpiecznego dostępu do właściwości:
```javascript
// ❌ Nie używaj wielokrotnych sprawdzeń
if (manager && manager.modules && manager.modules.search) {
    manager.modules.search.clear();
}

// ✅ Używaj operatora opcjonalnego łańcuchowania
if (manager?.modules?.search?.clear) {
    manager.modules.search.clear();
}
```

2. Zawsze obsługuj błędy w operacjach asynchronicznych:
```javascript
// ❌ Nie zostawiaj nieobsłużonych Promise
fetch(url).then(response => {
    // ...
});

// ✅ Zawsze obsługuj błędy
try {
    const response = await fetch(url);
    // ...
} catch (error) {
    console.error('Error:', error);
}
```

## Nazewnictwo

1. Używaj opisowych nazw zmiennych i funkcji:
```javascript
// ❌ Nie używaj niejasnych nazw
const h = (e) => {
    // ...
};

// ✅ Używaj opisowych nazw
const handleFilterToggle = (event) => {
    // ...
};
```

2. Używaj spójnych przedrostków dla powiązanych funkcji:
```javascript
// ❌ Niespójne nazewnictwo
const hideElement = () => {};
const showingItem = () => {};
const elementDisplay = () => {};

// ✅ Spójne nazewnictwo
const showItem = () => {};
const hideItem = () => {};
const toggleItem = () => {};
``` 