<template>
    <div class="shopping-cart">
      <header>
      <img src="https://placehold.co/400x200" alt="logo" />
    </header>
    <nav>
      <ul>
        <li>
          <router-link to="/" active-class="active-link">Home</router-link>
        </li>
        <li>
          <router-link to="/cart" active-class="active-link">Cart</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" active-class="active-link">Login</router-link>
        </li>
        <li v-if="isLoggedIn">
          <a @click="logout" class="logout-link">Logout</a>
        </li>
      </ul>
    </nav>
    <h1>Shopping Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Qty</th>
            <th>Product</th>
            <th>Price</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item?.cartItemId">
            <td>{{ item.quantity }}</td>
            <td>
              <router-link v-if="item.product" :to="`/products/${item.product.productId}`">{{ item.product.name }}</router-link>
            </td>
            <td>{{ formatCurrency(item.product.price) }}</td>
            <td>{{ formatCurrency(item.quantity * item.product.price) }}</td>
            <td>
              <button @click="removeItem(item.cartItemId)">
                <font-awesome-icon icon="xmark" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="cart-summary">
        <p>Subtotal: {{ formatCurrency(subtotal) }}</p>
        <p>Tax (6%): {{ formatCurrency(tax) }}</p>
        <p>Total: {{ formatCurrency(total) }}</p>
        <button @click="clearCart">
          <font-awesome-icon icon="trash-can" />
        </button>
      </div>
    </div>
    <footer>
    Copyright © 2025. All Rights Reserved.
  </footer>
  </template>


  <script>
  import axios from 'axios';

  export default {
    name: "ShoppingCartView",
    data() {
      return {
        cart: [],
      };
    },

    computed: {
      isLoggedIn() {
      return this.$store.state.token || localStorage.getItem('token');
      },
      subtotal() {
        return this.cart.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0);
      },
      tax() {
        return this.subtotal * 0.06;
      },
      total() {
        return this.subtotal + this.tax;
      },
    },

    methods: {
      logout() {
      this.$store.commit('LOGOUT');
      this.$router.push('/login');
      },
      async fetchCart() {
        try {
          const response = await axios.get("http://localhost:9000/cart");
          console.log("Cart API Response: ", response.data);
          this.cart = response.data.items || [];
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      },
      async removeItem(itemId) {
        try {
          await axios.delete(`http://localhost:9000/cart/items/${itemId}`);
          this.cart = this.cart.filter((item) => item.cartItemId !== itemId);
        } catch (error) {
          console.error("Error removing item:", error);
        }
      },
      async clearCart() {
        try {
          await axios.delete("http://localhost:9000/cart");
          this.cart = [];
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      },
      formatCurrency(amount) {
        if (isNaN(amount)) {
          return "$0.00";
        }
        return `$${amount.toFixed(2)}`;
      },
    },
    async created() {
      await this.fetchCart();
    },
  };
  </script>

  
  <style scoped>
  .shopping-cart {
    max-width: 800px;
    margin: 0 auto;
    padding-top: 100px;
  }

  header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

header img {
  height: 60px;
  width: auto;
}

nav {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

nav ul {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;
  margin: 0;
  list-style: none;
}

nav a, .logout-link {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
}

.active-link {
  font-weight: bold;
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.logout-link:hover, nav a:hover {
  background-color: #e9ecef;
}

  h1 {
    text-align: center;
    margin-top: 30px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  thead th {
    background-color: #f4f4f4;
    padding: 10px;
    text-align: left;
  }

  tbody td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .cart-summary {
    text-align: right;
    margin-top: 10px;
    margin-bottom: 50px;
  }

  button {
    background-color: #d9534f;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #c9302c;
  }

  footer {
    margin-top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background-color: #007bff;
    color: white;
    text-align: left;
    padding-left: 16px;
    line-height: 40px;
    font-size: 14px;
  }
  </style>