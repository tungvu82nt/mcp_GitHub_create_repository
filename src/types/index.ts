export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  tags: string[];
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  parentId?: string;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string; // Keep for internal use
  username: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  discount?: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'cash';
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: Address;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  oldStatus: Order['status'];
  newStatus: Order['status'];
  updatedBy: string;
  notes?: string;
  timestamp: string;
}

export interface ShippingProvider {
  id: string;
  name: string;
  code: string;
  logo?: string;
  trackingUrl?: string;
  estimatedDeliveryDays: number;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  bio?: string;
  preferences: {
    language: 'vi' | 'en';
    currency: 'VND' | 'USD';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  category: string;
  price: number;
  addedAt: string;
  priceAlert?: {
    enabled: boolean;
    targetPrice: number;
    notified: boolean;
  };
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  shareUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseCount: number;
}

// Admin Management Types
export interface AdminUser extends User {
  role: 'admin' | 'moderator' | 'editor';
  permissions: AdminPermission[];
  lastLogin: string;
  createdBy: string;
  isActive: boolean;
}

export interface AdminPermission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  stock: number;
  tags: string[];
  isActive: boolean;
}

export interface AdminAnalytics {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    revenueByPeriod: { date: string; revenue: number }[];
    ordersByPeriod: { date: string; orders: number }[];
  };
  users: {
    totalUsers: number;
    newUsersToday: number;
    activeUsersToday: number;
    userGrowthRate: number;
    userRegistrationsByPeriod: { date: string; users: number }[];
    userActivityByPeriod: { date: string; activeUsers: number }[];
  };
  products: {
    totalProducts: number;
    topSellingProducts: { product: Product; sales: number }[];
    lowStockProducts: Product[];
    averageRating: number;
    productViewsByPeriod: { date: string; views: number }[];
  };
  system: {
    totalReviews: number;
    averageReviewRating: number;
    wishlistItems: number;
    serverUptime: number;
  };
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'sales' | 'users' | 'products' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  data: any;
  generatedAt: string;
  generatedBy: string;
}

export interface BulkOperation {
  type: 'activate' | 'deactivate' | 'delete' | 'update_category' | 'update_price';
  target: 'products' | 'users' | 'orders';
  items: string[];
  parameters?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: {
    completed: number;
    total: number;
    errors: string[];
  };
}

// Search & Filter Types
export interface SearchFilters {
  query: string;
  category?: string;
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  tags?: string[];
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: SearchFilters;
  suggestions?: string[];
  searchTime: number;
}

export interface SearchAnalytics {
  popularSearches: {
    term: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  noResultsQueries: {
    query: string;
    count: number;
  }[];
  conversionRates: {
    searchTerm: string;
    conversionRate: number;
    totalSearches: number;
    totalConversions: number;
  }[];
  averageSearchTime: number;
  searchSuccessRate: number;
}

export interface FilterOption {
  id: string;
  label: string;
  count: number;
  selected: boolean;
  children?: FilterOption[];
}

export interface PriceRangeOption {
  label: string;
  min: number;
  max: number;
  count: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag';
  count?: number;
  image?: string;
}

export interface SearchHistory {
  id: string;
  userId?: string;
  query: string;
  filters: Partial<SearchFilters>;
  timestamp: string;
  resultsCount: number;
  clickedProductId?: string;
}

export interface AdvancedSearchConfig {
  enableFuzzySearch: boolean;
  enableAutoComplete: boolean;
  enableSearchSuggestions: boolean;
  enableSearchHistory: boolean;
  maxSuggestions: number;
  searchTimeout: number;
  cacheResults: boolean;
  cacheTimeout: number;
}