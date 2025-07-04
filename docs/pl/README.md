# Dokumentacja w języku polskim

Witamy w dokumentacji projektu NodeCourse. Ten folder zawiera kompleksowe przewodniki i dokumentację techniczną wszystkich aspektów projektu.

## 📚 Dostępna dokumentacja

### Architektura Frontend
- **[Architektura JavaScript Frontend](./frontend-architecture.md)** - Kompletny przewodnik po systemie JavaScript frontend
  - Architektura modułów ES6
  - Uniwersalny system delegacji zdarzeń
  - Modularny system filtrowania
  - Zarządzanie motywami
  - Optymalizacje wydajności



## 🏗️ Przegląd architektury projektu

```
NodeCourse/
├── app/                     # Aplikacja backend
│   ├── controllers/         # Kontrolery routingu
│   ├── db/                  # Modele bazy danych i konfiguracja
│   ├── middleware/          # Niestandardowe middleware
│   └── routes/              # Definicje tras
├── public/                  # Zasoby statyczne
│   ├── js/                  # Moduły JavaScript frontend
│   └── css/                 # Arkusze stylów
├── views/                   # Szablony EJS
│   ├── layouts/             # Układy stron
│   ├── pages/               # Szablony stron
│   └── partials/            # Komponenty wielokrotnego użytku
├── docs/                    # Dokumentacja projektu
└── tests/                   # Pliki testowe
```

## 🚀 Szybki start

1. **Rozwój Frontend** - Przeczytaj przewodnik [Architektura Frontend](./frontend-architecture.md)
2. **Dodawanie nowych funkcji** - Sprawdź sekcję "Dodawanie nowych funkcji" w dokumentacji frontend
3. **Konwencje kodowania** - Postępuj zgodnie z konwencjami opisanymi w odpowiednich dokumentach architektury

## 📋 Standardy dokumentacji

Cała dokumentacja w tym projekcie przestrzega następujących standardów:

- **Format Markdown** - Łatwe do czytania i utrzymania
- **Przykłady kodu** - Praktyczne przykłady wszystkich konceptów
- **Przejrzysta struktura** - Spis treści i logiczne sekcje
- **Żywe dokumenty** - Aktualizowane wraz ze zmianami kodu

## 🔄 Aktualizowanie dokumentacji

Podczas wprowadzania zmian w kodzie:

1. **Aktualizuj odpowiednią dokumentację** - Jeśli zmieniasz architekturę lub dodajesz funkcje
2. **Dodaj nowe sekcje** - Dla nowych modułów lub systemów
3. **Dołącz przykłady** - Pokaż, jak działają nowe funkcje
4. **Sprawdź dokładność** - Upewnij się, że dokumentacja odpowiada aktualnemu kodowi

## 📞 Uzyskiwanie pomocy

Jeśli potrzebujesz pomocy w zrozumieniu jakiejkolwiek części systemu:

1. Sprawdź najpierw odpowiednią dokumentację
2. Przejrzyj przykłady kodu w dokumentach
3. Przejrzyj rzeczywiste pliki kodu, aby poznać szczegóły implementacji
4. Sprawdź historię git, aby uzyskać kontekst zmian

---

🔙 **[Powrót do głównej dokumentacji](../README.md)**