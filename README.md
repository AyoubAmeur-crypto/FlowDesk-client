# FlowDesk — Freelance & Marketing Agency Platform

FlowDesk is a full-stack web platform that connects clients with skilled freelancers. Clients can browse available services, book them directly, reach out to freelancers for their projects, and manage everything from one place. The platform includes a powerful admin dashboard for managing users, services, categories, projects, earnings, and more.

---

## Features

### For Clients
- Browse and search services by category
- Book a service directly from the platform
- Contact freelancers and submit project requests
- Secure login and role-based access

### For Freelancers
- Manage incoming project requests
- Dedicated freelancer panel

### For Admins
- Full dashboard with management of:
  - Categories & Services
  - Users & Freelancers
  - Projects & Requests
  - Earnings & Settings
- Marketplace and Blog sections

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS 4, DaisyUI, Headless UI, Radix UI |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) + Axios |
| Routing | React Router DOM 7 |
| Animations | GSAP |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React, Remix Icons, Heroicons |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn



### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── admin/              # Admin dashboard panels and components
├── api/                # Axios API calls (auth, services, categories, projects)
├── client/             # Client panel
├── freelancer/         # Freelancer panel
├── globalState/        # Zustand global auth store
├── landingPage/        # Public-facing landing page (Hero, Banners, NavBar)
├── modals/             # Auth modal and info cards
├── pannelComponents/   # Shared panel UI components
├── utils/              # Protected route utility
└── validationClass/    # TypeScript validation helpers
```

---

## License

This project is fully owned and licensed by **Ayoub Ameur**. All rights reserved. No part of this project may be reproduced, distributed, or used without explicit written permission from the author.

---

## Author

**Ayoub Ameur**  
📧 [ayoubyameury@gmail.com](mailto:ayoubyameury@gmail.com)  
🔗 [linkedin.com/in/ayoub-ameur-772a70362](https://linkedin.com/in/ayoub-ameur-772a70362)
