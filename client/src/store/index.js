import { createStore as _createStore } from 'vuex';
import axios from 'axios';

export function createStore(currentToken, currentUser) {
  let store = _createStore({
    state: {
      token: currentToken || '',
      user: currentUser || {},
      products: [],
      cart: [],
    },
    mutations: {
      SET_AUTH_TOKEN(state, token) {
        state.token = token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      },
      SET_USER(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      },
      LOGOUT(state) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.token = '';
        state.user = {};
        axios.defaults.headers.common = {};
      },
      SET_PRODUCTS(state, products) {
        state.products = products;
      },
      ADD_TO_CART(state, cartItem) {
        const existingItem = state.cart.find(item => item.productId === cartItem.productId);
        if (existingItem) {
          existingItem.quantity += cartItem.quantity;
        } else {
          state.cart.push(cartItem);
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    actions: {
      async fetchProducts({ commit }) {
        try {
          const response = await axios.get('/products');
          commit('SET_PRODUCTS', response.data);
        } catch (error) {
          console.error('Error fetching products', error);
        }
      },
      async addToCart({ commit }, product) {
        try {
          const response = await axios.post('/cart/items', {
            productId: product.productId,
            quantity: 1
          });
          commit('ADD_TO_CART', response.data);
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      }
      
    },
  });
  return store;
}