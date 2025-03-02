<template>
  <div id="app">
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
        <li>
          <router-link v-if="!isLoggedIn" to="/login" active-class="active-link">Login</router-link>
        </li>
        <a v-if="isLoggedIn" @click="logout" class="logout-link">Logout</a>
      </ul>
    </nav>
  </div>

  <main>
  <div id="login">
    <form v-on:submit.prevent="login">
      <h1>Please Sign In</h1>
      <div id="fields">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          v-model="user.username"
          required
          autofocus
        />
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          v-model="user.password"
          required
        />
        <div><button type="submit">Sign in</button></div>
      </div>
      <hr/>
      Need an account? <router-link v-bind:to="{ name: 'register' }">Register!</router-link>
    </form>
  </div>
  </main>
  <footer>
    Copyright © 2025. All Rights Reserved.
  </footer>
</template>

<script>
import authService from "../services/AuthService";

export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.authToken;
    }
  },
  methods: {
    login() {
      authService
        .login(this.user)
        .then((response) => {
          if (response.status == 200) {
            this.$store.commit("SET_AUTH_TOKEN", response.data.token);
            this.$store.commit("SET_USER", response.data.user);
            this.$router.push("/");
          }
        })
        .catch((error) => {
          const response = error.response;
          if (!response) {
            alert(error);
          } else if (response.status === 401) {
            alert("Invalid username and password!");
          } else {
            alert(response.message);
          }
        });
    },
    logout() {
      this.$store.commit("CLEAR_AUTH_TOKEN");
      this.$store.commit("CLEAR_USER");
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

nav ul {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;
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

main {
  margin-top: 70px;
  padding: 40px 20px;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 240px);
  background-color: #f4f4f4;
}

#login {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin-bottom: 40px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
}

label {
  font-weight: bold;
  margin-bottom: 6px;
}

input, button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input {
  margin-bottom: 8px;
}

button {
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-weight: bold;
  margin-top: 12px;
}

button:hover {
  background-color: #0056b3;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 16px 0;
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


@media (max-width: 425px) {
  nav ul {
    gap: 12px;
  }
  h1 {
    font-size: 20px;
  }
  input,
  button {
    font-size: 14px;
    padding: 10px;
  }
  header {
    height: 50px;
  }
  nav {
    top: 50px;
  }
  main {
    margin-top: 140px;
  }
}
</style>