import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Product, CartItem, User, Category } from '../types';

interface AppState {
  cart: CartItem[];
  user: User | null;
  searchQuery: string;
  selectedCategory: string;
  isAdminMode: boolean;
  products: Product[];
  categories: Category[];
  loading: boolean;
  currentPage: 'home' | 'orders' | 'profile' | 'admin' | 'search' | 'wishlist';
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'TOGGLE_ADMIN_MODE' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: 'home' | 'orders' | 'profile' | 'admin' | 'search' | 'wishlist' };

const getInitialUser = () => {
  try {
    const userData = localStorage.getItem('yapee_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Error parsing user from localStorage:', error);
    return null;
  }
};

// Load initial cart based on user
const getInitialCartWithUser = (): CartItem[] => {
  const user = getInitialUser();
  return loadCartFromStorage(user?.id);
};

const getInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined' || !('localStorage' in window)) return [];
  const raw = window.localStorage.getItem('yapee_cart');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (i) => i
            && typeof i.quantity === 'number'
            && i.product
            && typeof i.product.id === 'string'
        )
      : [];
  } catch (error) {
    console.warn('Error parsing cart from localStorage:', error);
    return [];
  }
};

// Enhanced cart persistence with user-specific storage
const saveCartToStorage = (cart: CartItem[], userId?: string) => {
  if (typeof window === 'undefined' || !('localStorage' in window)) return;

  const cartKey = userId ? `yapee_cart_${userId}` : 'yapee_cart';
  localStorage.setItem(cartKey, JSON.stringify(cart));

  // Also save to global cart for non-logged users
  if (!userId) {
    localStorage.setItem('yapee_cart', JSON.stringify(cart));
  }
};

const loadCartFromStorage = (userId?: string): CartItem[] => {
  if (typeof window === 'undefined' || !('localStorage' in window)) return [];

  // Try user-specific cart first
  if (userId) {
    const userCartRaw = window.localStorage.getItem(`yapee_cart_${userId}`);
    if (userCartRaw) {
      try {
        const parsed = JSON.parse(userCartRaw);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (i) => i
              && typeof i.quantity === 'number'
              && i.product
              && typeof i.product.id === 'string'
          );
        }
      } catch (error) {
        console.warn('Error parsing user cart from localStorage:', error);
      }
    }
  }

  // Fallback to global cart
  return getInitialCart();
};

const initialState: AppState = {
  cart: getInitialCartWithUser(),
  user: getInitialUser(),
  searchQuery: '',
  selectedCategory: '',
  isAdminMode: false,
  products: [],
  categories: [],
  loading: true,
  currentPage: 'home',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const cart = Array.isArray(state.cart) ? state.cart : [];
      const existingItem = cart.find(item => item.product.id === action.payload.id);
      let newCart;

      if (existingItem) {
        newCart = cart.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...cart, { product: action.payload, quantity: 1 }];
      }

      saveCartToStorage(newCart, state.user?.id);
      return { ...state, cart: newCart };
    }

    case 'REMOVE_FROM_CART': {
      const cart = Array.isArray(state.cart) ? state.cart : [];
      const newCart = cart.filter(item => item.product.id !== action.payload);
      saveCartToStorage(newCart, state.user?.id);
      return { ...state, cart: newCart };
    }

    case 'UPDATE_CART_QUANTITY': {
      const cart = Array.isArray(state.cart) ? state.cart : [];
      const nextQty = Number.isFinite(action.payload.quantity)
        ? Math.max(0, Math.floor(action.payload.quantity))
        : 0;
      const newCart = cart
        .map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: nextQty }
            : item
        )
        .filter(item => item.quantity > 0);
      saveCartToStorage(newCart, state.user?.id);
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART': {
      const newCart: CartItem[] = [];
      saveCartToStorage(newCart, state.user?.id);
      return { ...state, cart: newCart };
    }

    case 'SET_USER': {
      if (action.payload) {
        localStorage.setItem('yapee_user', JSON.stringify(action.payload));

        // Migrate cart from global to user-specific when user logs in
        const globalCart = getInitialCart();
        if (globalCart.length > 0) {
          saveCartToStorage(globalCart, action.payload.id);
          localStorage.removeItem('yapee_cart'); // Clear global cart
        }

        // Load user-specific cart
        const userCart = loadCartFromStorage(action.payload.id);
        return { ...state, user: action.payload, cart: userCart };
      } else {
        // Clear user but keep cart as global when user logs out
        localStorage.removeItem('yapee_user');
        const globalCart = getInitialCart();
        return { ...state, user: action.payload, cart: globalCart };
      }
    }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'TOGGLE_ADMIN_MODE':
      return { ...state, isAdminMode: !state.isAdminMode };

    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const auth = useAuth();
  const { products, loading: productsLoading } = useProducts(state.selectedCategory, state.searchQuery);
  const { categories, loading: categoriesLoading } = useCategories();

  // Update state when data changes
  React.useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, [products]);

  React.useEffect(() => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  }, [categories]);

  React.useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: productsLoading || categoriesLoading });
  }, [productsLoading, categoriesLoading]);

  React.useEffect(() => {
    if (auth.user) {
      dispatch({ type: 'SET_USER', payload: auth.user });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [auth.user]);

  return (
    <AppContext.Provider value={{ state, dispatch, auth }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}