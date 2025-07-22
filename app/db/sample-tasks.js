const sampleTasks = [
    // 2023 - Zadania historyczne
    {
        taskName: 'Analiza wymagań projektu',
        dateFrom: '2023-01-10',
        dateTo: '2023-01-15',
        isDone: true
    },
    {
        taskName: 'Projektowanie architektury systemu',
        dateFrom: '2023-02-20',
        dateTo: '2023-03-05',
        isDone: true
    },
    {
        taskName: 'Setup środowiska deweloperskiego',
        dateFrom: '2023-03-15',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Implementacja podstawowych komponentów',
        dateFrom: '2023-04-01',
        dateTo: '2023-04-30',
        isDone: true
    },
    {
        taskName: 'Testy alpha wersji',
        dateFrom: '2023-05-10',
        dateTo: '2023-05-25',
        isDone: true
    },
    {
        taskName: 'Optymalizacja wydajności',
        dateFrom: '2023-06-01',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Dokumentacja techniczna',
        dateFrom: '2023-07-15',
        dateTo: '2023-07-30',
        isDone: true
    },
    {
        taskName: 'Szkolenie zespołu',
        dateFrom: '2023-08-10',
        dateTo: '2023-08-20',
        isDone: true
    },
    {
        taskName: 'Deployment beta wersji',
        dateFrom: '2023-09-01',
        dateTo: '2023-09-15',
        isDone: true
    },
    {
        taskName: 'Testy beta z użytkownikami',
        dateFrom: '2023-10-01',
        dateTo: '2023-10-31',
        isDone: true
    },
    {
        taskName: 'Naprawa błędów krytycznych',
        dateFrom: '2023-11-15',
        dateTo: '2023-11-30',
        isDone: true
    },
    {
        taskName: 'Przygotowanie do produkcji',
        dateFrom: '2023-12-01',
        dateTo: '2023-12-20',
        isDone: true
    },
    
    // 2024 - Zadania aktualne
    {
        taskName: 'Przygotować prezentację dla zespołu',
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
        isDone: false
    },
    {
        taskName: 'Przejrzeć dokumentację projektu',
        dateFrom: '2024-01-16',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Spotkanie z klientem - analiza wymagań',
        dateFrom: '2024-01-17',
        dateTo: '2024-01-17',
        isDone: false
    },
    {
        taskName: 'Implementacja modułu logowania',
        dateFrom: '2024-02-18',
        dateTo: '2024-02-25',
        isDone: false
    },
    {
        taskName: 'Testy jednostkowe dla API',
        dateFrom: '2024-02-19',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Aktualizacja bazy danych',
        dateFrom: '2024-03-20',
        dateTo: '2024-03-21',
        isDone: false
    },
    {
        taskName: 'Code review pull requestów',
        dateFrom: '2024-03-21',
        dateTo: null,
        isDone: false
    },
    {
        taskName: 'Szkolenie nowego członka zespołu',
        dateFrom: '2024-04-22',
        dateTo: '2024-04-24',
        isDone: false
    },
    {
        taskName: 'Optymalizacja wydajności aplikacji',
        dateFrom: '2024-04-23',
        dateTo: '2024-04-30',
        isDone: false
    },
    {
        taskName: 'Przygotowanie raportu miesięcznego',
        dateFrom: '2024-05-24',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Integracja z systemem płatności',
        dateFrom: '2024-05-25',
        dateTo: '2024-06-01',
        isDone: false
    },
    {
        taskName: 'Backup danych produkcyjnych',
        dateFrom: '2024-06-26',
        dateTo: '2024-06-26',
        isDone: true
    },
    {
        taskName: 'Aktualizacja dokumentacji API',
        dateFrom: '2024-06-27',
        dateTo: null,
        isDone: false
    },
    {
        taskName: 'Deployment na środowisko testowe',
        dateFrom: '2024-07-28',
        dateTo: '2024-07-28',
        isDone: false
    },
    {
        taskName: 'Analiza błędów z logów',
        dateFrom: '2024-07-29',
        dateTo: '2024-07-31',
        isDone: false
    },
    {
        taskName: 'Spotkanie standup dzienne',
        dateFrom: '2024-08-30',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Refaktoryzacja kodu legacy',
        dateFrom: '2024-08-31',
        dateTo: '2024-09-05',
        isDone: false
    },
    {
        taskName: 'Przygotowanie demo dla zarządu',
        dateFrom: '2024-09-01',
        dateTo: '2024-09-03',
        isDone: false
    },
    {
        taskName: 'Monitoring wydajności systemu',
        dateFrom: '2024-10-02',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Planowanie sprintu następnego',
        dateFrom: '2024-11-03',
        dateTo: '2024-11-04',
        isDone: false
    },
    {
        taskName: 'Aktualizacja systemu bezpieczeństwa',
        dateFrom: '2024-11-15',
        dateTo: '2024-11-20',
        isDone: false
    },
    {
        taskName: 'Przygotowanie dokumentacji końcowej',
        dateFrom: '2024-12-10',
        dateTo: null,
        isDone: true
    },
    {
        taskName: 'Testy integracyjne',
        dateFrom: '2024-12-15',
        dateTo: '2024-12-22',
        isDone: false
    },
    {
        taskName: 'Deployment na produkcję',
        dateFrom: '2024-12-28',
        dateTo: '2024-12-31',
        isDone: false
    },
    
    // 2025 - Zadania przyszłe
    {
        taskName: 'Planowanie nowych funkcjonalności',
        dateFrom: '2025-01-05',
        dateTo: '2025-01-15',
        isDone: false
    },
    {
        taskName: 'Analiza konkurencji',
        dateFrom: '2025-01-20',
        dateTo: null,
        isDone: false
    },
    {
        taskName: 'Projektowanie UI/UX',
        dateFrom: '2025-02-01',
        dateTo: '2025-02-28',
        isDone: false
    },
    {
        taskName: 'Implementacja nowych modułów',
        dateFrom: '2025-03-01',
        dateTo: '2025-03-31',
        isDone: false
    },
    {
        taskName: 'Testy nowych funkcji',
        dateFrom: '2025-04-01',
        dateTo: null,
        isDone: false
    },
    {
        taskName: 'Optymalizacja wydajności',
        dateFrom: '2025-05-01',
        dateTo: '2025-05-15',
        isDone: false
    },
    {
        taskName: 'Szkolenie użytkowników',
        dateFrom: '2025-06-01',
        dateTo: '2025-06-30',
        isDone: false
    },
    {
        taskName: 'Deployment nowej wersji',
        dateFrom: '2025-07-01',
        dateTo: '2025-07-15',
        isDone: false
    },
    {
        taskName: 'Monitoring po wdrożeniu',
        dateFrom: '2025-08-01',
        dateTo: null,
        isDone: false
    },
    {
        taskName: 'Zbieranie feedbacku',
        dateFrom: '2025-09-01',
        dateTo: '2025-09-30',
        isDone: false
    },
    {
        taskName: 'Iteracja na podstawie feedbacku',
        dateFrom: '2025-10-01',
        dateTo: '2025-10-31',
        isDone: false
    },
    {
        taskName: 'Finalizacja projektu',
        dateFrom: '2025-11-01',
        dateTo: '2025-11-30',
        isDone: false
    },
    {
        taskName: 'Dokumentacja końcowa',
        dateFrom: '2025-12-01',
        dateTo: '2025-12-15',
        isDone: false
    }
];

module.exports = { sampleTasks }; 