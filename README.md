# System Zarządzania Wypożyczalnią Samochodów
> Projekt z kursu: *Bazy danych i zarządzanie informacją*

## Stack technologiczny

### Backend
- **NestJS 11.x** - Progresywny framework Node.js
- **PostgreSQL 16** - Relacyjna baza danych
- **Prisma 7.2** - Type-safe ORM
- **Passport.js** - Middleware uwierzytelniania (JWT + strategie lokalne)
- **bcrypt** - Hashowanie haseł
- **Swagger/OpenAPI** - Dokumentacja API

### Frontend
- **Next.js 16.1** - Framework React z App Router
- **React 19.2** - Biblioteka UI
- **Tailwind CSS 4.x** - Framework CSS utility-first
- **shadcn/ui** - Biblioteka komponentów zbudowana na Radix UI
- **React Hook Form** - Zarządzanie formularzami
- **Zod** - Walidacja schematów
- **Axios** - Klient HTTP

### DevOps
- **Docker Compose** - Orkiestracja kontenerów
- **pnpm** - Szybki, oszczędzający miejsce menedżer pakietów
- **TypeScript** - Rozwój z bezpieczeństwem typów

## Struktura Projektu

```
university-db-car-rental/
├── apps/
│   ├── backend/             # Serwer API NestJS
│   │   ├── src/
│   │   │   ├── auth/        # Uwierzytelnianie i autoryzacja
│   │   │   ├── cars/        # Zarządzanie samochodami
│   │   │   ├── categories/  # Zarządzanie kategoriami
│   │   │   ├── features/    # Zarządzanie funkcjami
│   │   │   ├── maintenance/ # Rekordy konserwacji
│   │   │   ├── rentals/     # Zarządzanie wypożyczeniami
│   │   │   ├── reviews/     # System opinii
│   │   │   └── users/       # Zarządzanie użytkownikami
│   │   └── prisma/          # Schemat bazy danych i migracje
│   │
│   └── web/                 # Frontend Next.js
│       └── src/
│           ├── app/         # Strony App Router
│           ├── components/  # Komponenty React
│           ├── context/     # React Context (Auth)
│           └── types/       # Typy TypeScript
│
├── docker-compose.yml       # PostgreSQL + Adminer
└── pnpm-workspace.yaml      # Konfiguracja monorepo
```

## Wymagania Wstępne

- **Node.js** (v18 lub wyższy)
- **pnpm** (v10.25.0 lub wyższy)
- **Docker** i **Docker Compose** (dla bazy danych)

## Pierwsze Kroki

### 1. Sklonuj Repozytorium

```bash
git clone <url-repozytorium>
cd university-db-car-rental
```

### 2. Zainstaluj Zależności

```bash
pnpm install
```

### 3. Skonfiguruj Zmienne Środowiskowe `.env`

### 4. Uruchom Bazę Danych

```bash
docker-compose up -d
# lub
docker compose up -d
```

To uruchamia:
- Bazę danych PostgreSQL na `localhost:5432`
- Adminer (GUI bazy danych) na `http://localhost:8080`

### 5. Uruchom Migracje Bazy Danych

```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

### 6. Zseeduj bazę danych

Wypełnij bazę danych przykładowymi danymi:

```bash
npx prisma db seed
```

### 7. Uruchom Backend

```bash
cd apps/backend
pnpm start:dev
# lub
pnpm --filter backend start:dev
```

API będzie dostępne pod adresem `http://localhost:3000/v1`

Dokumentacja API (Swagger): `http://localhost:3000/docs`

### 8. Uruchom Frontend

W nowym terminalu:

```bash
cd apps/web
pnpm dev
# lub
pnpm --filter web dev
```

Aplikacja webowa będzie dostępna pod adresem `http://localhost:3001`

## Endpointy API

### Uwierzytelnianie

- `POST /v1/auth/login` - Logowanie użytkownika
- `POST /v1/auth/register` - Rejestracja użytkownika
- `GET /v1/auth/profile` - Pobranie profilu aktualnego użytkownika
- `PATCH /v1/auth/profile` - Aktualizacja profilu użytkownika

### Samochody (Publiczne)

- `GET /v1/cars` - Lista wszystkich samochodów
- `GET /v1/cars/:id` - Szczegóły samochodu

### Kategorie (Publiczne)

- `GET /v1/categories` - Lista wszystkich kategorii
- `GET /v1/categories/:id` - Szczegóły kategorii

### Funkcje (Publiczne)

- `GET /v1/features` - Lista wszystkich funkcji
- `GET /v1/features/:id` - Szczegóły funkcji

### Wypożyczenia (Wymagane uwierzytelnienie)

- `POST /v1/rentals` - Utworzenie wypożyczenia
- `GET /v1/rentals/my` - Pobranie wypożyczeń użytkownika
- `GET /v1/rentals` - Lista wszystkich wypożyczeń (Admin/Pracownik)
- `PATCH /v1/rentals/:id` - Aktualizacja statusu wypożyczenia (Admin/Pracownik)

### Opinie (Wymagane uwierzytelnienie)

- `GET /v1/reviews` - Lista wszystkich opinii
- `POST /v1/reviews` - Utworzenie opinii
- `PATCH /v1/reviews/:id` - Aktualizacja własnej opinii
- `DELETE /v1/reviews/:id` - Usunięcie opinii (Admin)

### Konserwacja (Admin/Pracownik)

- `GET /v1/maintenance` - Lista rekordów konserwacji
- `POST /v1/maintenance` - Utworzenie rekordu konserwacji
- `PATCH /v1/maintenance/:id` - Aktualizacja rekordu
- `DELETE /v1/maintenance/:id` - Usunięcie rekordu

### Użytkownicy (Tylko Admin)

- `GET /v1/users` - Lista wszystkich użytkowników
- `POST /v1/users` - Utworzenie użytkownika
- `GET /v1/users/:id` - Szczegóły użytkownika
- `PATCH /v1/users/:id` - Aktualizacja użytkownika
- `DELETE /v1/users/:id` - Usunięcie użytkownika

Pełna dokumentacja API jest dostępna w Swagger UI pod adresem `http://localhost:3000/docs` gdy backend jest uruchomiony.

## Schemat Bazy Danych

System używa PostgreSQL z Prisma ORM. Kluczowe encje obejmują:

- **User** - Użytkownicy systemu z rolami (USER, ADMIN, EMPLOYEE)
- **Car** - Inwentarz pojazdów ze specyfikacjami
- **Category** - Kategorie samochodów (SUV, Sedan, Hatchback, itp.)
- **Feature** - Funkcje samochodów (GPS, AC, Bluetooth, itp.)
- **Rental** - Transakcje wypożyczeń ze śledzeniem statusu
- **Review** - Opinie i oceny klientów
- **Maintenance** - Rekordy konserwacji pojazdów

Zobacz Diagram Encji-Związków w `/apps/backend/ERD.png` dla wizualnej reprezentacji.

## Role Użytkowników

System implementuje kontrolę dostępu opartą na rolach (RBAC) z trzema rolami:

- **USER** - Zwykli klienci (mogą przeglądać samochody, tworzyć wypożyczenia, pisać opinie)
- **EMPLOYEE** - Członkowie personelu (zarządzają samochodami, wypożyczeniami i konserwacją)
- **ADMIN** - Administratorzy systemu (pełny dostęp włącznie z zarządzaniem użytkownikami)

## Dostęp do Bazy Danych

### Adminer

Dostęp do GUI bazy danych pod adresem `http://localhost:8080`:
- System: **PostgreSQL**
- Serwer: **db**
- Użytkownik: **user**
- Hasło: **password**
- Baza danych: **car_rental**

### Prisma Studio

```bash
cd apps/backend
npx prisma studio
```