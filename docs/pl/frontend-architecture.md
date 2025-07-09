# Architektura JavaScript Frontend

Dokumentacja techniczna systemu JavaScript w projekcie NodeCourse.

## Spis treści

1. [Przegląd systemu](#przegląd-systemu)
2. [Architektura modułowa](#architektura-modułowa)
3. [Struktura katalogów](#struktura-katalogów)
4. [Komponenty główne](#komponenty-główne)
5. [System filtrowania](#system-filtrowania)
6. [Zarządzanie zdarzeniami](#zarządzanie-zdarzeniami)
7. [Dodawanie funkcjonalności](#dodawanie-funkcjonalności)
8. [Konwencje kodowania](#konwencje-kodowania)
9. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
10. [Rozwój systemu](#rozwój-systemu)

---

## Przegląd systemu

System JavaScript frontend aplikacji NodeCourse implementuje architekturę modułową opartą na ES6 modules z następującymi charakterystykami:

### Charakterystyki techniczne:
- **Moduły ES6** - Wszystkie skrypty używają natywnych importów/eksportów
- **Delegacja zdarzeń** - Centralny system zarządzania zdarzeniami
- **System filtrowania** - Konfigurowalny moduł wyszukiwania i sortowania
- **Zarządzanie motywami** - System przełączania jasnego/ciemnego motywu
- **Optymalizacje wydajności** - Debouncing, lazy loading, cache

### Funkcjonalności:
- Wyszukiwanie tekstowe w zadaniach
- Sortowanie według różnych kryteriów
- Filtrowanie zaawansowane
- Przełączanie motywów
- Zarządzanie zadaniami (CRUD)
- Statystyki i liczniki

---

## Architektura modułowa

### Podział na moduły
System składa się z wyspecjalizowanych modułów:

```javascript
// Import modułów funkcjonalnych
import { search } from './search-module.js';
import { sort } from './sort-module.js';
import { changeTheme } from './theme.js';
```

### System delegacji zdarzeń
Centralny punkt obsługi wszystkich zdarzeń:

```html
<!-- Element z atrybutem data-action -->
<button data-action="toggle-theme">
    Zmień motyw
</button>
```

```javascript
// Centralny nasłuchiwacz zdarzeń
document.addEventListener('click', (event) => {
    if (event.target.dataset.action === 'toggle-theme') {
        changeTheme();
    }
});
```

### Architektura konfiguracyjna
Konfiguracja pól zamiast twardego kodowania:

```javascript
// Konfiguracja pól sortowania
const config = {
    taskName: {
        selector: '.card-title',
        type: 'text',
        transform: text => text.toLowerCase()
    },
    taskDate: {
        selector: '.task-date',
        type: 'date',
        transform: text => new Date(text)
    }
};
```

---

## Struktura katalogów

```
public/js/
├── theme.js                  # Zarządzanie motywami
├── tasks.js                  # Operacje na zadaniach
├── theme-prevention.js       # Zapobieganie migotaniu motywu
├── filtering/               # System filtrowania
│   ├── filter-manager.js    # Koordynator filtrów
│   ├── search-module.js     # Moduł wyszukiwania
│   ├── sort-module.js       # Moduł sortowania
│   ├── filter-module.js     # Filtry zaawansowane
│   ├── filter-constants.js  # Stałe filtrów
│   └── filter-ui.js         # Interfejs użytkownika
└── utils/                   # Narzędzia pomocnicze
    ├── helpers.js           # Funkcje podstawowe
    ├── dom-utils.js         # Manipulacja DOM
    ├── event-handlers.js    # Obsługa zdarzeń
    └── statistics.js        # Statystyki
```

---

## Komponenty główne

### theme.js - Zarządzanie motywami

**Funkcjonalności:**
- Wykrywanie preferencji systemowych
- Zapisywanie wyboru użytkownika w localStorage
- Synchronizacja motywów między zakładkami
- Zapobieganie migotaniu przy ładowaniu

**Implementacja:**
```javascript
function changeTheme() {
    const currentTheme = localStorage.getItem('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
}
```

### tasks.js - Zarządzanie zadaniami

**Funkcjonalności:**
- Oznaczanie zadań jako wykonane/niewykonane
- Usuwanie zadań
- Aktualizacja liczników
- Powiadomienia o statusie operacji

**Implementacja:**
```javascript
function markTaskAsDone(taskId, checkbox) {
    const isDone = checkbox.checked;
    
    fetch(`/tasks/${taskId}/status`, {
        method: 'POST',
        body: JSON.stringify({ done: isDone })
    });
    
    const task = checkbox.closest('.task-item');
    task.classList.toggle('completed', isDone);
}
```

### System utils/

#### helpers.js - Funkcje podstawowe
```javascript
// Skróty dla często używanych funkcji
const d = document;
const $ = selector => d.querySelector(selector);

// Bezpieczne ustawianie tekstu
function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

// Centralne klasy CSS
const CSS_CLASSES = {
    TASK_ITEM: 'col-md-6',
    TASK_CHECKBOX: 'form-check-input',
    CARD_TITLE: 'card-title'
};
```

#### dom-utils.js - Manipulacja DOM
```javascript
// Znajdowanie elementów
function findAllTasks() {
    return document.querySelectorAll('.task-item');
}

// Pokazywanie/ukrywanie elementów
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}
```

---

## System filtrowania

### Filter Manager - Koordynator główny

**Odpowiedzialności:**
- Koordynacja modułów wyszukiwania, sortowania i filtrów
- Dynamiczne ładowanie modułów
- Zarządzanie URL-ami z parametrami filtrów

**Konfiguracja:**
```javascript
const filterManager = {
    features: ['search', 'sort', 'filters'],
    container: '#task-container',
    searchFields: ['name', 'description', 'category'],
    sortFields: {
        name: { selector: '.card-title', type: 'text' },
        date: { selector: '.task-date', type: 'date' }
    }
};
```

### Search Module - Wyszukiwanie

**Funkcjonalności:**
- Wyszukiwanie tekstowe w zadaniach
- Filtrowanie wyników w czasie rzeczywistym
- Liczenie znalezionych elementów

**Implementacja:**
```javascript
function performSearch(text) {
    const tasks = findAllTasks();
    let found = 0;
    
    tasks.forEach(task => {
        const taskName = task.querySelector('.card-title').textContent;
        const taskDescription = task.querySelector('.task-description').textContent;
        const allText = (taskName + ' ' + taskDescription).toLowerCase();
        
        if (allText.includes(text.toLowerCase())) {
            showElement(task);
            found++;
        } else {
            hideElement(task);
        }
    });
    
    document.querySelector('.search-results').textContent = 
        `Znaleziono ${found} zadań`;
}
```

### Sort Module - Sortowanie

**Funkcjonalności:**
- Sortowanie według różnych kryteriów
- Obsługa różnych typów danych
- Zarządzanie kierunkiem sortowania

**Implementacja:**
```javascript
function sortTasks(field, direction = 'ascending') {
    const tasks = Array.from(findAllTasks());
    
    tasks.sort((a, b) => {
        let valueA, valueB;
        
        if (field === 'name') {
            valueA = a.querySelector('.card-title').textContent;
            valueB = b.querySelector('.card-title').textContent;
        } else if (field === 'date') {
            valueA = new Date(a.querySelector('.task-date').textContent);
            valueB = new Date(b.querySelector('.task-date').textContent);
        }
        
        if (direction === 'ascending') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    
    const container = document.querySelector('#task-container');
    tasks.forEach(task => container.appendChild(task));
}
```

---

## Zarządzanie zdarzeniami

### System delegacji zdarzeń

**Implementacja:**
```javascript
// Centralny nasłuchiwacz
document.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    
    switch(action) {
        case 'toggle-theme':
            changeTheme();
            break;
        case 'search-clear':
            clearSearch();
            break;
        case 'filter-reset':
            resetFilters();
            break;
    }
});
```

### Rejestracja obsługi zdarzeń
```javascript
function registerActionHandler(actionName, handler) {
    actionHandlers[actionName] = handler;
}
```

---

## Dodawanie funkcjonalności

### Dodanie nowej akcji

**Krok 1: HTML**
```html
<button data-action="custom-action" data-task-id="123">
    Akcja niestandardowa
</button>
```

**Krok 2: JavaScript**
```javascript
registerActionHandler('custom-action', (element, eventType, data) => {
    const taskId = data.taskId;
    // Implementacja logiki
});
```

### Dodanie nowego pola wyszukiwania

**Krok 1: HTML**
```html
<div class="task-item" data-field="priority">
    <span class="task-priority">Wysoki</span>
</div>
```

**Krok 2: Konfiguracja**
```javascript
const config = {
    searchFields: ['name', 'description', 'priority'],
    sortFields: {
        priority: {
            selector: '.task-priority',
            type: 'text',
            transform: text => {
                const priorities = { 'Niski': 1, 'Średni': 2, 'Wysoki': 3 };
                return priorities[text] || 0;
            }
        }
    }
};
```

### Dodanie nowego modułu

**Krok 1: Utworzenie pliku**
```javascript
// public/js/custom-module.js
export default {
    init() {
        this.setupEventListeners();
    },
    
    mainFunction() {
        // Implementacja funkcjonalności
    },
    
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.dataset.action === 'custom-action') {
                this.mainFunction();
            }
        });
    }
};
```

**Krok 2: Import**
```javascript
import customModule from './custom-module.js';

document.addEventListener('DOMContentLoaded', () => {
    customModule.init();
});
```

---

## Konwencje kodowania

### Organizacja plików
```javascript
// 1. Importy na początku
import { helper1, helper2 } from './utils/helpers.js';

// 2. Stałe
const CONSTANTS = {
    TIMEOUT: 300,
    CSS_CLASSES: {
        ACTIVE: 'active',
        HIDDEN: 'hidden'
    }
};

// 3. Funkcje pomocnicze
function helper1() { /* implementacja */ }
function helper2() { /* implementacja */ }

// 4. Funkcje główne
function mainFunction() { /* implementacja */ }

// 5. Eksport
export { mainFunction };
```

### Nazewnictwo
- **Stałe**: `UPPER_SNAKE_CASE`
- **Zmienne**: `camelCase`
- **Funkcje**: `camelCase`
- **Pliki**: `kebab-case.js`

### Dokumentacja funkcji
```javascript
/**
 * Wyszukuje zadania pasujące do podanego tekstu
 * @param {string} searchText - Tekst do wyszukania
 * @param {Array} tasks - Lista zadań do przeszukania
 * @returns {Array} Lista pasujących zadań
 */
function searchTasks(searchText, tasks) {
    return tasks.filter(task => {
        const taskName = task.querySelector('.card-title').textContent;
        return taskName.toLowerCase().includes(searchText.toLowerCase());
    });
}
```

---

## Rozwiązywanie problemów

### Problem: Wyszukiwanie nie działa

**Diagnostyka:**
```javascript
// Sprawdzenie elementów
const searchField = document.querySelector('.search-input');
console.log('Pole wyszukiwania:', searchField);

const tasks = document.querySelectorAll('.task-item');
console.log('Liczba zadań:', tasks.length);

// Sprawdzenie wywołania funkcji
document.querySelector('.search-input').addEventListener('input', (e) => {
    console.log('Wyszukiwanie:', e.target.value);
});
```

### Problem: Motyw się resetuje

**Diagnostyka:**
```javascript
// Sprawdzenie localStorage
console.log('Zapisany motyw:', localStorage.getItem('theme'));

// Sprawdzenie załadowania modułu
if (typeof changeTheme === 'undefined') {
    console.error('Moduł theme.js nie został załadowany');
}
```

### Problem: Sortowanie nieprawidłowe

**Diagnostyka:**
```javascript
// Sprawdzenie konfiguracji
const config = getConfig();
console.log('Konfiguracja sortowania:', config.sortFields);

// Sprawdzenie selektorów
const testElement = document.querySelector('.task-date');
console.log('Element daty:', testElement);
```

### Tryb debugowania
```javascript
// Włączenie szczegółowego logowania
localStorage.setItem('debug', 'true');
```

---

## Rozwój systemu

### Planowane funkcjonalności
- Synchronizacja w czasie rzeczywistym
- Aplikacja mobilna
- Kategorie zadań
- Widok kalendarza
- System powiadomień
- Raporty produktywności
- Motywy niestandardowe

### Ulepszenia techniczne
- Szybsze ładowanie modułów
- Dodatkowe zabezpieczenia
- Obsługa trybu offline
- Ulepszone wyszukiwanie
- Testy automatyczne

### Rozważane technologie
- TypeScript dla bezpieczeństwa typów
- Web Components dla lepszej enkapsulacji
- Service Worker dla funkcjonalności offline
- Virtual Scrolling dla dużych list

---

## Podsumowanie

System JavaScript frontend implementuje nowoczesną architekturę modułową z następującymi zaletami:

- **Modularność** - Jasny podział odpowiedzialności
- **Skalowalność** - Łatwe dodawanie nowych funkcjonalności
- **Wydajność** - Optymalizacje dla szybkiego działania
- **Konserwowalność** - Czytelny i dobrze udokumentowany kod
- **Niezawodność** - Przemyślana obsługa błędów

Dokumentacja powinna być aktualizowana przy każdej zmianie architektury lub dodaniu nowych funkcjonalności.