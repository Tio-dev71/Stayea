# STAYEA PLATFORM AUDIT: DOMAIN & DATA FLOW ARCHITECTURE
**Document ID:** `STAYEA-AUD-02`  
**Date:** 2026-11-02  
**Baseline Commit:** `f9c97a7`

---

## 1. High-Level System Architecture & Subdomain Boundary

STAYEA runs as a Turborepo monorepo with NestJS powering the core domain services and Next.js 16 (App Router) serving the web interfaces.

```mermaid
flowchart TD
    subgraph Clients["Edge & Actor Clients"]
        C["Customer Browser<br/>(stayea.com)"]
        P["Partner Browser<br/>(hub.stayea.com)"]
        A["Admin Browser<br/>(admin.stayea.com)"]
    end

    subgraph Gateway["Edge Proxy & Reverse Proxy (Nginx)"]
        N1["stayea.com -> :8088 /"]
        N2["hub.stayea.com -> :8088 /hub"]
        N3["admin.stayea.com -> :8088 /stayea"]
        N4["api.stayea.com -> :3088 /api"]
    end

    subgraph Frontend["Next.js Application Layer (admin-shadcn)"]
        NextMW["Next.js Middleware & SSR Guard"]
        Store["Client State (React Query / Local)"]
    end

    subgraph Backend["NestJS Backend Core (api:3088)"]
        AuthM["Auth & Identity Module"]
        CatM["Stayea Catalog Module"]
        BookM["Stayea Booking Module"]
        PartM["Stayea Partner Module"]
        PayM["Stayea Payment Module"]
        AIM["Stayea AI Concierge"]
    end

    subgraph Persistence["PostgreSQL Database (Drizzle ORM)"]
        T_Users[("users & auth_identities")]
        T_Cat[("stayea_accommodations / experiences / transports / flights")]
        T_Book[("stayea_bookings & stayea_orders")]
        T_Part[("partner_profiles & partner_services")]
        T_Pay[("stayea_payments & partner_payouts")]
    end

    C --> N1 --> NextMW
    P --> N2 --> NextMW
    A --> N3 --> NextMW
    NextMW --> Store --> N4 --> Backend

    AuthM --> T_Users
    CatM --> T_Cat
    BookM --> T_Book
    PartM --> T_Part
    PayM --> T_Pay
    AIM --> T_Book
```

---

## 2. Booking & Payment Lifecycle (Current Flawed vs Target Architecture)

### 2.1 Current Flawed Flow (Vulnerable to Race Conditions & Unpaid Confirmation)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as Next.js Client
    participant BookingSvc as StayeaBookingService
    participant DB as PostgreSQL
    participant PaymentSvc as StayeaPaymentService
    actor Attacker

    Customer->>Frontend: Select dates & Submit Checkout
    Frontend->>BookingSvc: POST /api/stayea/bookings
    Note over BookingSvc,DB: Non-atomic collision check (Race Condition window)
    BookingSvc->>DB: SELECT bookings WHERE dates overlap
    DB-->>BookingSvc: None found
    BookingSvc->>DB: INSERT booking (status: 'confirmed', paymentStatus: 'unpaid')
    DB-->>BookingSvc: Booking Created
    BookingSvc-->>Frontend: Return bookingId
    Frontend->>PaymentSvc: POST /api/stayea/payments/initiate
    PaymentSvc-->>Frontend: Return static QR (MB Bank 0988776655)
    
    rect rgb(255, 230, 230)
        Note over Attacker,PaymentSvc: EXPLOIT: Unsigned Webhook or Dev Bypass
        Attacker->>PaymentSvc: POST /api/stayea/payments/webhook<br/>(Header: x-stayea-signature: skip_dev_check)
        PaymentSvc->>DB: UPDATE stayea_bookings SET paymentStatus = 'paid'
        PaymentSvc-->>Attacker: 200 OK (Booking marked fully paid without money transfer)
    end
```

### 2.2 Target Hardened Flow (Phase 1 Remediation)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as Next.js Client
    participant BookingSvc as StayeaBookingService
    participant DB as PostgreSQL (Txn with Lock)
    participant PaymentSvc as StayeaPaymentService
    participant Gateway as VietQR / SeAPay / VNPay Gateway

    Customer->>Frontend: Select dates & Click Reserve
    Frontend->>BookingSvc: POST /api/stayea/bookings
    activate BookingSvc
    BookingSvc->>DB: BEGIN TRANSACTION
    BookingSvc->>DB: SELECT * FROM stayea_accommodations WHERE id = $1 FOR UPDATE
    BookingSvc->>DB: Check date collision with EXCLUDE constraint / FOR UPDATE
    alt Dates Conflict
        DB-->>BookingSvc: Collision detected
        BookingSvc-->>Frontend: 409 Conflict ("Dates no longer available")
    else Inventory Available
        BookingSvc->>DB: INSERT booking (status: 'pending_payment', expires_at: NOW() + 15m)
        BookingSvc->>DB: COMMIT TRANSACTION
        BookingSvc-->>Frontend: Return booking (hold active for 15 mins)
    end
    deactivate BookingSvc

    Frontend->>PaymentSvc: POST /api/stayea/payments/initiate
    PaymentSvc->>Gateway: Generate Dynamic VietQR with unique transaction code
    Gateway-->>PaymentSvc: QR URL + Reference Code
    PaymentSvc-->>Frontend: Display Dynamic VietQR

    Customer->>Gateway: Transfers Money via Banking App
    Gateway->>PaymentSvc: Webhook POST (HMAC-SHA256 Signed)
    activate PaymentSvc
    Note over PaymentSvc: Verify Signature with Gateway Secret (Mandatory)
    PaymentSvc->>DB: UPDATE stayea_bookings SET status = 'confirmed', paymentStatus = 'paid'
    PaymentSvc->>DB: INSERT INTO stayea_orders (partnerId from accommodation)
    PaymentSvc-->>Gateway: 200 Success
    deactivate PaymentSvc
    Frontend->>BookingSvc: Poll status / WebSocket -> "Confirmed"
```

---

## 3. Partner Listing to Public Catalog Synchronization

When a partner registers a villa, homestay, or scuba diving tour in `hub.stayea.com`, the system automatically provisions catalog representations for public booking and admin moderation:

```mermaid
flowchart TD
    subgraph Hub["Partner Hub (hub.stayea.com)"]
        P1["Partner creates service<br/>(Drive Link / Upload / Pricing / Units)"]
        P2["POST /api/stayea/partner/services"]
    end

    subgraph ServiceLayer["Partner Service Layer"]
        P3["StayeaPartnerService.createService()"]
        P4["Validate Partner KYC & Business Category"]
        P5["INSERT partner_services (partnerId = auth.user.id)"]
        P6["syncServiceToCatalog()"]
    end

    subgraph CatalogTables["PostgreSQL Master Catalog"]
        T1["stayea_accommodations (villas, homestays, hotels)"]
        T2["stayea_experiences (scuba, boat tours, fishing)"]
        T3["stayea_transports (car rental, motorbike)"]
    end

    subgraph Consumers["Public & Admin Consumers"]
        Pub["stayea.com (/stay, /experiences)<br/>Instant Public Visibility"]
        Adm["admin.stayea.com (/stayea/properties)<br/>Admin Oversight & Commission"]
    end

    P1 --> P2 --> P3 --> P4 --> P5 --> P6
    P6 -- If category = villa/homestay --> T1
    P6 -- If category = tour/experience --> T2
    P6 -- If category = transport/car --> T3
    T1 --> Pub
    T2 --> Pub
    T3 --> Pub
    T1 --> Adm
    T2 --> Adm
    T3 --> Adm
```

---

## 4. Booking State Machine

```mermaid
stateDiagram-v2
    [*] --> pending_payment: Customer creates booking (15 min lock)
    pending_payment --> confirmed: Valid payment webhook received (HMAC verified)
    pending_payment --> expired: 15 min TTL timeout without payment
    pending_payment --> cancelled: Customer cancels checkout
    confirmed --> checked_in: Customer arrives at property
    checked_in --> completed: Stay finished, checkout complete
    completed --> paid_out: Partner net payout disbursed by Admin
    confirmed --> refunded: Admin or Partner approves cancellation
    expired --> [*]
    cancelled --> [*]
    refunded --> [*]
    paid_out --> [*]
```

---

## 5. Entity Relationship Model (Core Stayea Schema)

```mermaid
erDiagram
    users ||--o{ partner_profiles : "owns (1:1)"
    users ||--o{ stayea_bookings : "books"
    partner_profiles ||--o{ partner_services : "publishes"
    partner_profiles ||--o{ partner_payouts : "receives"
    partner_services ||--o| stayea_accommodations : "syncs to (source_service_id)"
    partner_services ||--o| stayea_experiences : "syncs to (source_service_id)"
    stayea_accommodations ||--o{ stayea_bookings : "booked for dates"
    stayea_bookings ||--o{ stayea_payments : "funded by"
    stayea_bookings ||--o{ stayea_orders : "generates partner fulfillment order"

    users {
        uuid id PK
        string email
        string role "CUSTOMER | PARTNER | ADMIN"
        string fullName
        string phoneNumber
    }

    partner_profiles {
        uuid id PK
        uuid userId FK
        string businessName
        string businessType "stay | tour | transport"
        string status "pending | approved | suspended"
        decimal commissionRate "default 0.10"
        string bankAccount
        string bankName
    }

    partner_services {
        uuid id PK
        uuid partnerId FK
        string title
        string serviceType
        decimal price
        string location
        string imageUrl
        string status "active | paused"
    }

    stayea_accommodations {
        uuid id PK
        uuid partnerId FK
        uuid sourceServiceId FK
        string title
        string category "villa | homestay | hotel | resort"
        decimal pricePerNight
        integer bedrooms
        integer maxGuests
        string location
        string status "active | inactive"
    }

    stayea_bookings {
        uuid id PK
        uuid userId FK
        uuid accommodationId FK
        date checkIn
        date checkOut
        decimal totalPrice
        string status "pending_payment | confirmed | completed | cancelled"
        string paymentStatus "unpaid | paid | refunded"
    }

    stayea_payments {
        uuid id PK
        uuid bookingId FK
        decimal amount
        string provider "vietqr | seapay | stripe"
        string transactionReference
        string status "pending | successful | failed"
    }
```

