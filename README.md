# 🛒 YA PEE E-COMMERCE PLATFORM

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-purple.svg)](https://vitejs.dev/)

## 🌟 Tổng quan

**YA PEE** là nền tảng thương mại điện tử hiện đại được xây dựng bằng React 18, TypeScript và Node.js, cung cấp giải pháp E-commerce toàn diện với giao diện thân thiện và kiến trúc backend mạnh mẽ.

### ✨ Tính năng chính

#### 🎨 Frontend
- **React 18** với TypeScript và hooks
- **TailwindCSS** responsive design
- **Vite** fast development và HMR
- **Component-based architecture**

#### 🔐 Authentication
- Sign Up/Sign In/Sign Out với validation
- JWT Authentication (backend)
- Role-based Access Control (User/Admin)
- Profile management

#### 🛍️ E-commerce
- Product catalog với categories
- Advanced search với filters
- Shopping cart và checkout
- Order history và tracking
- Wishlist và reviews
- Admin panel quản lý

#### 🗄️ Backend
- **Node.js + Express** RESTful API
- **MySQL** với Alibaba Cloud RDS
- **Connection pooling** performance
- **bcryptjs** password hashing
- **JWT** authentication

## 🚀 Quick Start

### 📋 Yêu cầu
- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 8.0

### 🛠️ Cài đặt

```bash
# Clone repository
git clone https://github.com/[username]/yapee-ecommerce.git
cd yapee-ecommerce

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development
npm run dev
```

### 🌐 Truy cập
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

## 📁 Cấu trúc dự án

```
yapee-ecommerce/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── data/           # Mock data
│   └── context/        # React Context
├── server/             # Backend API
├── database/           # DB schema & migrations
├── public/             # Static assets
└── docs/               # Documentation
```

## 🎯 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Code linting
npm run db:create    # Create database
npm run db:migrate   # Run migrations
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL2** - Database client
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database
- **MySQL 8.0+**
- **Alibaba Cloud RDS**
- **Connection pooling**

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Products
```
GET /api/products
GET /api/products/:id
GET /api/categories
```

### Cart & Orders
```
GET /api/cart
POST /api/cart
POST /api/orders
```

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Manual
```bash
npm run build
npm run start
```

## 📊 Features

- ✅ **Modern UI/UX** với TailwindCSS
- ✅ **Responsive Design** mobile-first
- ✅ **Authentication** với JWT
- ✅ **Product Management** CRUD operations
- ✅ **Shopping Cart** real-time updates
- ✅ **Admin Panel** quản lý hệ thống
- ✅ **Search & Filters** advanced search
- ✅ **Order Management** tracking & history
- ✅ **Performance Monitoring** tích hợp
- ✅ **Error Handling** comprehensive
- ✅ **Testing** unit & E2E
- ✅ **Docker** containerization

## 🤝 Contributing

1. Fork project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

---

<div align="center">

**🎉 YA PEE - Nền tảng thương mại điện tử hiện đại! 🚀**

Made with ❤️ using React, TypeScript & Node.js

</div>