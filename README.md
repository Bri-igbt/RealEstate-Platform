# Real Estate Platform
<p align="center">
  <img src="https://res.cloudinary.com/dhdcmkuhx/image/upload/f_auto/q_auto/Screenshot_2026-10-08_at_11.41.50_l8i07u.png" alt="Home Page" width="800"/>
</p>
A full-stack real estate marketplace where sellers list properties, buyers browse, save, enquire and chat in real time, and admins moderate the whole platform.

Built with **Next.js (App Router)** on the frontend and **Express + MongoDB** on the backend, with **Socket.IO** for live chat and **Cloudinary** for image storage.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [User Roles & Access](#user-roles--access)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Real-Time Chat](#real-time-chat)
- [Frontend Routes](#frontend-routes)
- [Image Uploads](#image-uploads)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Known Issues & Roadmap](#known-issues--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Buyers
- Register, verify email with a 6-digit code, log in, reset a forgotten password
- Browse and search properties with filters: city, property type, BHK, furnishing, price range, sort order
- View detailed property pages with an image gallery, lightbox, amenities, seller details and similar listings
- Save properties to a wishlist
- Send inquiries to sellers
- Chat with sellers in real time
- Contact the platform team through a contact form
- Manage a personal profile (name, phone, address, profile picture)

### Sellers
- Register as a seller (new sellers require admin approval before they can use the dashboard)
- Dashboard with views, leads, live listings and sold counts
- Add, edit, delete and mark listings as sold or available (up to 10 images per listing)
- View inquiries from buyers and reply through chat
- Export listings to CSV

### Admins
- Platform overview with user, property, active listing and sold counts
- Manage users: filter by role, block or unblock, delete
- Approve pending seller accounts
- Moderate and delete property listings
- Review all buyer-to-seller inquiries
- Read messages submitted through the contact form

### Platform
- Role-based route protection on both the client and the API
- Unique view counting per visitor (logged-in user ID or IP address)
- Email notifications for verification codes, password resets and new contact messages
- Responsive layouts with a sidebar shell for sellers and admins

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Axios, React Icons |
| Styling | Tailwind CSS plus a central styles object (`assets/dummyStyles.js`) |
| Backend | Node.js 20+, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JSON Web Tokens, bcrypt password hashing |
| Real time | Socket.IO |
| File storage | Cloudinary, with Multer for multipart parsing |
| Email | Transactional email via `utils/sendEmail.js` |

---

## Project Structure

> Adjust the trees below if your folders differ slightly.

```
real_estate_platform/
├── backend/
│   ├── config/
│   │   ├── db.js                  # Mongoose connection
│   │   └── cloudinary.js          # Cloudinary client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── inquiryController.js
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js      # protect + authorize(...roles)
│   │   └── uploadMiddleware.js    # Multer (memory storage)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── property.model.js
│   │   ├── inquiry.model.js
│   │   ├── contact.model.js
│   │   ├── chat.model.js
│   │   └── wishlist.model.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── inquiryRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── adminRoutes.js
│   │   └── chatRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── uploadCloudinary.js
│   └── server.js
│
└── frontend/
    ├── app/
    │   ├── (public)/              # login, register (redirect away if already logged in)
    │   ├── (protected)/           # any logged-in user: profile, wishlist, chat, inquiries
    │   ├── (seller)/              # seller-only: dashboard, add/edit property, my-properties
    │   ├── (admin)/               # admin-only: admin dashboard and management pages
    │   ├── components/
    │   │   ├── commons/           # Navbar, Logo, PropertyCard, RoleAwareShell
    │   │   ├── admin/             # Sidebar, DashboardNavbar
    │   │   ├── seller/            # SellerSidebar, PendingApproval
    │   │   ├── Home/              # Hero, Category, Features, HowItWorks, FeaturedCollection
    │   │   └── (ProtectedRoutes)/ # RouteGuards.jsx (ProtectedRoute, PublicRoute)
    │   ├── layout.jsx             # Root layout, wraps AuthProvider and ChatProvider
    │   └── page.jsx               # Landing page
    ├── assets/
    │   └── dummyStyles.js         # Style objects used across components
    ├── context/
    │   ├── AuthContext.jsx
    │   └── ChatContext.jsx
    ├── public/                    # Static files, including placeholder-property.jpg
    ├── config.js                  # Exports API_URL
    ├── jsconfig.json              # "@/*" path alias
    └── next.config.mjs            # Allowed remote image hosts
```

**Route groups** such as `(seller)` and `(admin)` organise code and attach layouts. They do not appear in the URL, so `app/(seller)/dashboard/page.jsx` is served at `/dashboard`.

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB Atlas cluster and a database user
- A Cloudinary account
- Credentials for your email provider

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd real_estate_platform
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env` using the [variables below](#environment-variables), then start the server:

```bash
npm run dev      # nodemon server.js
```

You should see:

```
Server Started on http://localhost:5000
DB CONNECTED
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Make sure `frontend/config.js` points at your API:

```javascript
const API_URL = "http://localhost:5000";
export default API_URL;
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Create your first admin

There is no admin sign-up form. Register a normal account, verify it, then open your `users` collection in MongoDB Atlas and change that user's `role` to `"admin"`. Log out and back in so the stored session refreshes.

### Path alias

The frontend uses `@/` as an alias for the project root, configured in `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

If the project also contains a `tsconfig.json`, add the same `paths` block there. Next.js prefers `tsconfig.json` when both exist. Restart the dev server after changing either file.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string with your real database username and password (no `<placeholders>`) |
| `JWT_SECRET` | Long random string used to sign tokens |
| `EMAIL_USER` | Sender address, also used as the admin address for contact-form notifications |
| `CLIENT_URL` | Frontend origin used in password-reset links, e.g. `http://localhost:3000` |
| Cloudinary keys | Cloud name, API key and API secret, as read by `config/cloudinary.js` |
| Email provider keys | API key or SMTP credentials, as read by `utils/sendEmail.js` |

Check `config/cloudinary.js` and `utils/sendEmail.js` for the exact variable names they expect, and mirror them in your `.env`.

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/RealEstate
JWT_SECRET=replace-with-a-long-random-string
EMAIL_USER=you@example.com
CLIENT_URL=http://localhost:3000
```

> If your password contains special characters (`@ # % : /`), URL-encode them in the connection string. Never commit `.env` files.

### Frontend

The API base URL lives in `frontend/config.js`. Remote images are allowed in `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
```

---

## User Roles & Access

| Role | Can do | Landing page after login |
|---|---|---|
| **buyer** | Browse, wishlist, inquire, chat, contact, edit profile | `/` |
| **seller** | Everything above that applies, plus manage listings and view leads. Dashboard access requires `isApproved: true` | `/dashboard` |
| **admin** | Moderate users, sellers, properties, inquiries and contact messages | `/admin-dashboard` |

New sellers are created with `isApproved: false`. Until an admin approves them, the seller layout shows a "Pending Approval" screen instead of the dashboard. Profile and contact pages remain available.

The server enforces roles with `protect` (valid JWT required) and `authorize(...roles)` middleware. Client-side guards only improve the user experience.

---

## Authentication Flow

1. **Register** → `POST /api/auth/register` creates the user with `isVerified: false` and emails a 6-digit code.
2. **Verify** → `POST /api/auth/verify-email` with `{ email, code }` marks the account verified. The frontend then redirects to `/login`.
3. **Login** → `POST /api/auth/login` returns `{ token, user }`. Unverified and blocked accounts are rejected.
4. **Session** → the token is stored in `localStorage` and sent as `Authorization: Bearer <token>`. `AuthContext` restores it on page load.
5. **Forgot password** → `POST /api/auth/forgot-password` emails a reset link valid for 15 minutes. Only a SHA-256 hash of the token is stored in the database.
6. **Reset** → `POST /api/auth/reset-password/:token` with `{ password }`. Tokens are single-use.

If the API returns a `403` whose message mentions the account being blocked, the client logs the user out automatically.

---

## API Reference

All routes are prefixed with the API origin (default `http://localhost:5000`). Unless noted as public, a bearer token is required.

### Auth: `/api/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account and email a verification code |
| POST | `/login` | Public | Log in and receive a JWT |
| GET | `/me` | Any user | Current user profile |
| POST | `/verify-email` | Public | Verify email with a code |
| POST | `/forgot-password` | Public | Email a reset link |
| POST | `/reset-password/:token` | Public | Set a new password |

### User: `/api/user`

| Method | Path | Access | Description |
|---|---|---|---|
| PUT | `/profile` | Any user | Update name, phone, address and profile picture (multipart) |

### Properties: `/api/properties`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List properties (see filters below) |
| GET | `/counts` | Public | Count of active listings per property type |
| GET | `/:id` | Public | Property details, similar listings, and view tracking |
| POST | `/` | Seller | Create a listing (multipart, field `images`, max 10) |
| GET | `/my` | Seller | The seller's own listings |
| GET | `/seller/dashboard` | Seller | Dashboard statistics |
| PUT | `/:id` | Seller (owner) | Update a listing; accepts `existingImages` (JSON) plus new `images` |
| PATCH | `/:id/status` | Seller (owner) | Set status to `sale` or `sold` |
| DELETE | `/:id` | Seller (owner) | Delete a listing and its Cloudinary images |

**List filters** (query string): `city`, `area`, `pincode`, `propertyType` (comma-separated), `bhk` (use `5+` for five or more), `furnishing` (comma-separated), `minPrice`, `maxPrice`, `amenities` (comma-separated), `seller`, `sort` (`latest`, `priceLow`, `priceHigh`).

### Inquiries: `/api/inquiry`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Buyer | Send an inquiry `{ propertyId, message }` |
| POST | `/seller` | Seller | Inquiries received by the seller |
| POST | `/:id/read` | Any user | Mark an inquiry as read |

### Wishlist: `/api/wishlist`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Buyer | Saved properties |
| POST | `/:propertyId` | Buyer | Add to wishlist |
| DELETE | `/:propertyId` | Buyer | Remove from wishlist |

### Contact: `/api/contact`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit `{ name, email, phone, role, message }`. The role must be `buyer` or `seller` |
| GET | `/` | Admin | All contact messages |

### Chat: `/api/chat`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/start` | Buyer or seller | Get or create a chat `{ propertyId, sellerId }` |
| POST | `/send` | Participant | Save a message `{ chatId, text, image }` |
| POST | `/user` | Any user | The user's conversations |
| POST | `/:chatId` | Participant | Messages in a chat |
| DELETE | `/:chatId` | Participant | Delete a conversation |
| DELETE | `/:chatId/message/:messageId` | Sender | Delete a message |

### Admin: `/api/admin` (admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Totals for users, properties, active and sold listings |
| GET | `/users` | All users, excluding passwords |
| PATCH | `/users/:id/block` | Toggle blocked status |
| DELETE | `/users/:id` | Delete a user |
| GET | `/pending-sellers` | Sellers awaiting approval |
| PATCH | `/approve-seller/:id` | Approve a seller |
| GET | `/properties` | All listings |
| DELETE | `/properties/:id` | Delete any listing |
| GET | `/inquiries` | All inquiries |

### Response shape

Successful responses include `success: true`; failures include `success: false` and a `message`. Use the `message` field for error display.

---

## Real-Time Chat

Messages are saved through the REST API, then broadcast over Socket.IO so the other participant sees them instantly.

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `joinChat` | client → server | `chatId` | Join the room for a conversation |
| `sendMessage` | client → server | `{ chatId, sender, text, image, createdAt, _id }` | Broadcast a message to the room |
| `recieveMessage` | server → clients | same as above | Delivered to everyone in the room |

The event name `recieveMessage` is misspelled in both the server and the client. It works because both sides match. If you rename it, change `server.js`, `ChatContext.jsx` and the chat page together.

`ChatProvider` must be mounted inside `AuthProvider` in `app/layout.jsx`, because it reads the logged-in user:

```jsx
<AuthProvider>
  <ChatProvider>{children}</ChatProvider>
</AuthProvider>
```

---

## Frontend Routes

### Public
| Path | Page |
|---|---|
| `/` | Landing page with featured collection |
| `/properties` | Property listing with filters |
| `/properties/[id]` | Property details |
| `/contact` | Contact form (also reachable by logged-in users) |
| `/login`, `/register` | Auth pages (redirect away when logged in) |
| `/verify-email?email=` | Enter the emailed code |
| `/forgot-password` | Request a reset link |
| `/reset-password/[token]` | Set a new password |

### Any logged-in user
| Path | Page |
|---|---|
| `/profile` | Edit profile |
| `/wishlist` | Saved properties (buyers) |
| `/chat-messages?chatId=` | Conversations and live chat |
| `/inquiries` | Inquiries (seller view or buyer view) |

`/chat-messages`, `/inquiries` and `/contact` are shared between buyers and sellers. They use `RoleAwareShell`, which renders the public navbar for buyers and the sidebar shell for sellers.

### Seller (`allowedRoles: seller`)
`/dashboard`, `/add-property`, `/my-properties`, `/edit-property/[id]`

### Admin (`allowedRoles: admin`)
`/admin-dashboard`, `/admin/users`, `/admin/seller-requests`, `/admin/properties`, `/admin/inquiries`, `/admin/contacts`

### Guards

`RouteGuards.jsx` exports two client components:

```jsx
<ProtectedRoute allowedRoles={["seller"]}>{children}</ProtectedRoute>  // must be logged in with a matching role
<PublicRoute>{children}</PublicRoute>                                   // redirects logged-in users to their home
```

Redirects happen inside `useEffect`, never during render.

---

## Image Uploads

1. The browser sends `multipart/form-data` with images under the field name **`images`**.
2. Multer (`uploadMiddleware.js`) keeps files in memory, up to 10 per request.
3. `uploadCloudinary.js` uploads each buffer to the `properties` folder and returns a `secure_url`.
4. URLs are stored in the property's `images` array.
5. Deleting a listing removes its images from Cloudinary.

Add a fallback image at `frontend/public/placeholder-property.jpg`. `PropertyCard` and the details page use it when a listing has no photo, so `next/image` never receives an empty `src`.

---

## Deployment Notes

- **`CLIENT_URL`**: set it to your production frontend URL, otherwise password-reset emails link to `localhost`.
- **CORS**: add your production origin to `allowedOrigins` in `server.js`. Socket.IO's CORS list needs the same origin.
- **API URL**: update `frontend/config.js` (or move it to a `NEXT_PUBLIC_` environment variable) for production.
- **Reverse proxy**: if the API runs behind nginx, a load balancer or a platform proxy, add `app.set('trust proxy', 1)` so `req.ip` is the real visitor IP. View counting for anonymous users depends on it.
- **Image hosts**: keep every host you load images from in `next.config.mjs`.
- **Secrets**: rotate any credential that has ever been pasted into a chat, ticket or commit.

---

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `MongoServerError: bad auth` | The connection string still contains `<db_username>` or has the wrong password. Replace the placeholder, and URL-encode special characters |
| `Module not found: Can't resolve '@/...'` | The file is not where the alias points. `@/` maps to the project root, so check whether the folder lives at `components/` or `app/components/`. Make sure `paths` exists in your `jsconfig.json` or `tsconfig.json`, and restart the dev server |
| `hostname "ui-avatars.com" is not configured under images` | Add the host to `remotePatterns` in `next.config.mjs` and restart |
| `Image ... is missing required "width" property` | `next/image` needs `width` and `height`, or `fill` inside a positioned parent |
| `An empty string ("") was passed to the src attribute` | A property has no image. Use the placeholder guard in `PropertyCard` |
| API calls return 404 | Check the URL against the route tables above. Routes are plural (`/api/properties`), and chat or inquiry reads may still be `POST` |
| Reset link says "Invalid or expired" | The token is single-use, expires after 15 minutes, and is replaced each time a new link is requested. Also confirm the page lives at `app/reset-password/[token]/page.jsx` |
| "Email already verified" right after registering | `isVerified` must default to `false` in the User schema |
| Admin sidebar missing | In `Sidebar.jsx`, the backdrop and the `<aside>` must be siblings, and the sidebar needs a desktop class such as `md:translate-x-0` |
| `useSearchParams() should be wrapped in a suspense boundary` | Wrap the page component in `<Suspense>` |
| Admin pages show "Request failed with status code 404" | Confirm the page calls `/api/admin/...` with the exact path from the admin table above |

---

## Known Issues & Roadmap

**Known issues**
- Chat reads (`/user`, `/:chatId`) and the seller inquiries read (`/seller`) are `POST` routes. They should be `GET`; update the routers and the matching Axios calls together.
- The socket event name `recieveMessage` is misspelled on both sides.
- `status` supports only `sale` and `sold`. Rental fields (`securityDeposit`, `maintenance`) appear in some forms but are not in the Property schema and are ignored by the API.
- Password strength is only checked with `minLength` on the client. Add server-side validation.
- `bhk` is stored as a string, so the `5+` filter relies on string comparison. Store it as a number for reliable range queries.
- Wishlist controller response shape: pages defensively accept either an array or `{ wishlist: [...] }`. Settle on one and simplify.

**Roadmap ideas**
- Rejecting seller applications, not only approving them
- Rental listings with deposit and maintenance fields
- Property map view and saved searches
- Email or push notifications for new chat messages
- Pagination on listing, admin and inbox pages
- Automated tests for controllers and route guards
- Unit tests for the `AuthContext` login and logout flows

---

## Contributing

1. Fork the repository and create a branch: `git checkout -b feature/your-feature`
2. Make your changes and test both the buyer and seller flows
3. Commit with a clear message and push the branch
4. Open a pull request describing what changed and why

Please keep new API routes consistent with the existing response shape (`success`, `message`) and protect them with `protect` and `authorize(...)` where appropriate.

---

## License

Add your license here (for example MIT) and include a `LICENSE` file in the repository root.