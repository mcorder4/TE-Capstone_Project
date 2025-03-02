<template>
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
  <div class="products-view">
    <div class="search-bar">
      <input v-model="searchTerm" @keyup.enter="performSearch" type="text" placeholder="Search products..." />
      <button @click="performSearch">
        <font-awesome-icon icon="magnifying-glass"/>
      </button>
    </div>
    <div v-if="!$store.state.token" class="login-message">
      <p>Welcome. You may browse anonymously as much as you wish, but you must 
        <router-link :to="{ name: 'login' }">Login</router-link> to add items to your shopping cart.</p>
    </div>
    <div class="view-switch">
      <button @click="currentView = 'tiles'" :class="{ active: currentView === 'tiles' }">Tile View</button>
      <button @click="currentView = 'table'" :class="{ active: currentView === 'table' }">Table View</button>
    </div>
    <div v-if="currentView === 'tiles'" class="product-list">
      <div v-for="product in filteredProducts" :key="product.productId" class="product-card">
        <img :src="product.imageName" :alt="product.name"/>
        <h2>
          <router-link :to="`/products/${product.productId}`" class="product-link">
          {{ product.name }}
        </router-link>
        </h2>
        <p>SKU: {{ product.productSku }}</p>
        <p><strong>Price: ${{ product.price }}</strong></p>
        <button @click="addToCart(product)" :disabled="!$store.state.token">
          <font-awesome-icon icon="cart-plus" />
        </button>
      </div>
    </div>
    <table v-else class="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.productId">
          <td>
          <router-link :to="`/products/${product.productId}`" class="product-link">
          {{ product.name }}
          </router-link>
          </td>
          <td>{{ product.productSku }}</td>
          <td>${{ product.price }}</td>
          <td>
            <button @click="addToCart(product)" :disabled="!$store.state.token">
              Add to Cart
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <footer>
    Copyright © 2025. All Rights Reserved.
  </footer>
</template>

<script>
export default {
  name: 'ProductsView',

  data() {
    return {
      searchTerm: '',
      currentView: 'tiles',
      cartMessage: ""
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.state.token || localStorage.getItem('token');
    },

    filteredProducts() {
      const term = this.searchTerm.toLowerCase();
      return this.$store.state.products.filter( (product) =>
          product.name.toLowerCase().includes(term) ||
          product.productSku.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }
  },

  methods: {
    logout() {
      this.$store.commit('LOGOUT');
      this.$router.push('/login');
    },

    performSearch() {

    },

    addToCart(product) {
      this.$store.dispatch('addToCart', product).then( () => {
        product.cartMessage = "Item added to your cart!";
        setTimeout( () => {
          product.cartMessage = "";
        }, 3000);
      });
    }
  },

  mounted() {
    if (!this.$store.state.products.length) {
      this.$store.dispatch('fetchProducts');
    }
  }
};
</script>

<style scoped>
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

.nav-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  background-color: #333;
  color: #fff;
  padding: 8px 0;
  margin: 0;
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

.search-bar {
  margin-top: 80px;
  padding: 8px 16px;
  background-color: white;
}

.search-bar input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  width: 80%;
}

.search-bar button {
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.login-message {
  margin-bottom: 20px;
  font-size: 14px;
  color: #555;
}

.products-view {
  margin-top: 16px;
  padding: 16px;
}

.view-switch {
  margin-bottom: 20px;
  padding: 16px;
}

.view-switch button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.view-switch button.active {
  background-color: #007bff;
  color: white;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 40px;
}

.product-card {
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card img {
  max-width: 100%;
  border-radius: 4px;
}

.product-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.product-link:hover {
  text-decoration: underline;
  color: #0056b3;
}

.product-card button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.product-card button:disabled {
  background-color: #ccc;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.product-table th {
  background-color: #f0f0f0;
  text-align: left;
}

.product-table button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.product-table button:disabled {
  background-color: #ccc;
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

@media (max-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 425px) {
  .product-list {
    grid-template-columns: 1fr;
  }
  .product-card {
    width: 100%;
    padding: 12px;
  }
}
</style>