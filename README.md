# ShopFlow API

A single-vendor e-commerce backend API built with **Node.js, Express.js, TypeScript, Prisma, PostgreSQL, and Stripe**.

ShopFlow provides authentication, customer management, category and product management, cart management, order checkout, Pay Later support, and Stripe payment integration.

---

## 🚀 Features

- 🔐 User authentication and email verification
- 👤 Customer profile management
- 🗂️ Category management
- 📦 Product management
- 🛒 Shopping cart
- 🧾 Order management
- 💳 Stripe payment integration
- ⏳ Pay Later order option
- 📊 Admin and customer role-based access
- 🔒 Protected API endpoints

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Stripe
- Zod
- JWT / Authentication
- Multer & Cloudinary (for product images)

---

# 📚 API Documentation

> Base URL example: `http://localhost:5000`

### 🔑 Access Levels

- **Public** — No authentication required
- **Login User** — Any authenticated user
- **Customer** — Authenticated customer
- **Admin** — Authenticated admin

---

# 🗂️ Category APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST   | `/categories` | Admin | Create a category |
| GET    | `/categories` | Admin | Get all categories |
| PATCH  | `/categories/:categoryId` | Admin | Update a category |
| DELETE | `/categories/:categoryId` | Admin | Delete a category |

---

# 🔐 Authentication APIs

| Method | Endpoint | Access | Description |
|--------|--- -------|-------|--------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login`    | Public | Login user |
| POST | `/auth/refresh`  | Public | Refresh access token |
| POST | `/auth/logout`   | Login User | Logout user |
| POST | `/auth/verify-email` | Public | Verify user email |

---

# 👤 Customer APIs

| Method | Endpoint | Access | Description |
|--------|----------|----------|------------|
| GET   | `/customers` | Admin | Get all customers |
| GET   | `/customers/customerId` | Admin | Get customer by ID |
| GET   | `/customers/me` | Login User | Get logged-in user's profile |
| PATCH | `/customers/me` | Login User | Update logged-in user's profile |
| DELETE| `/customers/me` | Login User | Delete logged-in user's account |

---

# 📦 Product APIs

| Method | Endpoint | Access | Description |
|-------|---------- |--------|-------------|
| POST  | `/products` | Admin | Create a product |
| GET   | `/products` | Public | Get all products |
| GET   | `/products/:productId` | Public | Get product by ID |
| PATCH | `/products/:productId` | Admin | Update a product |
|DELETE | `/products/:productId` | Admin | Delete a product |

---

# 🛒 Cart APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST  | `/cart/items` | Customer | Add product to cart |
|  GET  | `/cart` | Customer | Get current user's cart |
| PATCH | `/cart/items/:productId` | Customer | Update cart item quantity |
|DELETE | `/cart/items/:productId` | Customer | Remove product from cart |

---

# 🧾 Order APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST   | `/orders/checkout` | Customer | Create order and start Stripe payment |
|  GET   | `/orders` | Admin, Customer | Get orders |
|  GET   | `/orders/:orderId` | Admin, Customer | Get order by ID |
| POST   | `/orders/product-with-pay-later` | Customer | Create order with Pay Later |
| POST   | `/orders/initiate-payment/:orderId` | Customer | Initiate/retry payment for an existing order |

---

# 💳 Payment Flow

### Pay Now

1. Customer adds products to the cart.
2. Customer calls:
   POST:  `/orders/checkout`
3. The server validates the cart and stock.
4. Stock is atomically decreased.
5. Order and order items are created.
6. A Stripe Checkout Session is created.
7. The API returns a `paymentUrl`.
8. Customer completes payment through Stripe Checkout.
9. Stripe sends a webhook event.
10. The webhook updates the payment and order status.

### Pay Later

1. Customer calls:
   POST : `/orders/product-with-pay-later`
2. Order is created.
3. Stock is reserved/decreased.
4. Payment record is created as `UNPAID`.
5. Customer can later call:
   POST :`/orders/initiate-payment/:orderId`
6. Stripe Checkout is created for that order.
7. Stripe webhook updates the payment and order status after successful payment.

---

# 🔒 Authorization

Protected endpoints require authentication.

Admin-only endpoints are marked with **[admin]**, while customer endpoints are marked with **[customer]**.

Examples:

```text
POST /categories          → Admin
POST /products            → Admin
GET  /products            → Public
POST /cart/items          → Customer
POST /orders/checkout     → Customer
```

---



# ▶️ Run the Project

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

---

# 🧪 Stripe Webhook

For local development, use Stripe CLI to forward webhook events to the backend:

```bash
npm run stripe:webhook
```

The webhook is responsible for updating payment and order status after Stripe payment events.

---

# 📁 Main API Modules

```text
Auth
├── Register
├── Login
├── Refresh Token
├── Logout
└── Email Verification

Category
├── Create
├── Get All
├── Update
└── Delete

Customer
├── Get All
├── Get By ID
├── Get Me
├── Update Me
└── Delete Me

Product
├── Create
├── Get All
├── Get By ID
├── Update
└── Delete

Cart
├── Add Item
├── Get Cart
├── Update Item
└── Delete Item

Order
├── Checkout / Pay Now
├── Pay Later
├── Initiate Payment
├── Get All Orders
└── Get Order By ID
```

---

## 👨‍💻 Project Goal

ShopFlow is designed as a practical e-commerce backend project focusing on real-world backend concepts such as **authentication, authorization, inventory management, database transactions, concurrency-safe stock updates, order processing, payment handling, and Stripe webhook integration**.

The project is structured to provide a reliable foundation for a production-style single-vendor e-commerce application.
