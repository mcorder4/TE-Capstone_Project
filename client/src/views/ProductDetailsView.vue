<template>
  <div class="product-details-view">
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
    <main>
      <div class="back-button-container">
        <router-link to="/" class="back-button">&larr; Back to Home</router-link>
      </div>
      <div class="product-details">
        <h1>{{ product.name }}</h1>
        <p>SKU: {{ product.productSku }}</p>
        <p>Price: ${{ product.price }}</p>
        <p>{{ product.description }}</p>
        <img :src="product.imageName" alt="Product Image" />
        <button v-if="isAuthenticated" @click="addToCart" class="add-to-cart">
          <font-awesome-icon icon="cart-plus" />
        </button>
        <p v-if="cartMessage" class="cart-message">{{ cartMessage }}</p>
      </div>
    </main>
    <footer>
      Copyright © 2025. All Rights Reserved.
    </footer>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      product: {},
      error: null,
      cartMessage: "",
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.$store.state.token;
    },
    isLoggedIn() {
      return this.$store.state.token || localStorage.getItem('token');
    }
  },
  created() {
    const productId = this.$route.params.id;
    this.fetchProductDetails(productId);
  },
  methods: {
    async fetchProductDetails(id) {
      try {
        const response = await axios.get(
          `http://localhost:9000/products/${id}`
        );
        this.product = response.data;
      } catch (error) {
        this.error = "Failed to load product details. Please try again later.";
      }
    },
    async addToCart() {
      try {
        const response = await axios.post(
          "http://localhost:9000/cart/items",
          { productId: this.product.productId, quantity: 1 },
          { headers: { Authorization: `Bearer ${this.$store.state.token}` } }
        );
        if (response.status === 200 || response.status === 201) {
          this.cartMessage = "Item added to your cart!";
          setTimeout(() => (this.cartMessage = ""), 3000);
        }
      } catch (error) {
        this.cartMessage = "Failed to add item to your cart.";
        setTimeout(() => (this.cartMessage = ""), 3000);
      }
    },
    logout() {
      this.$store.commit("LOGOUT");
      this.$router.push("/login");
    },
  },
};
</script>


<style scoped>
.product-details-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

nav a,
.logout-link {
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

.logout-link:hover,
nav a:hover {
  background-color: #e9ecef;
}

.back-button-container {
  position: absolute;
  top: 10px;
  left: 20px;
}

.back-button {
  display: inline-block;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
}

.back-button:hover {
  background-color: #0056b3;
}

main {
  flex: 1;
  margin-top: 70px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.product-details {
  max-width: 600px;
  text-align: center;
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-details img {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
}

.add-to-cart {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.add-to-cart:hover {
  background-color: #0056b3;
}

.cart-message {
  margin-top: 10px;
  color: green;
  font-weight: bold;
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