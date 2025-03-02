<template>
  <div id="register">
    <header>
      <img src="https://placehold.co/400x200" alt="logo" />
    </header>
    <main>
    <form v-on:submit.prevent="register">
      <h1>Create Account</h1>
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
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Name"
          v-model="user.name"
          required
        />
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          v-model="user.password"
          required
        />
        <label for="confirmPassword">Confirm password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          v-model="user.confirmPassword"
          required
        />

        <label for="address">Address</label>
        <input
          type="text"
          id="address"
          placeholder="Address"
          v-model="user.address"
        />

        <label for="city">City</label>
        <input type="text" id="city" placeholder="City" v-model="user.city" />

        <label for="state">State</label>
        <input
          type="text"
          id="state"
          placeholder="State"
          v-model="user.stateCode"
          maxlength="2"
          required
        />

        <label for="zip">ZIP</label>
        <input
          type="number"
          id="zip"
          placeholder="ZIP"
          v-model="user.zip"
          required
          minlength="5"
          maxlength="5"
        />
        <div></div>
        <div>
          <button type="submit">Create Account</button>
        </div>
      </div>
      <hr />
      Have an account?
      <router-link v-bind:to="{ name: 'login' }">Sign in!</router-link>
    </form>
    </main>
    <footer>
      Copyright © 2025. All Rights Reserved.
    </footer>
  </div>
</template>

<script>
import authService from "../services/AuthService";

export default {
  data() {
    return {
      user: {
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        stateCode: "",
        zip: "",
        role: "user",
      },
    };
  },
  methods: {
    error(msg) {
      alert(msg);
    },
    success(msg) {
      alert(msg);
    },
    register() {
      if (this.user.password != this.user.confirmPassword) {
        this.error("Password & Confirm Password do not match");
      } else {
        authService
          .register(this.user)
          .then((response) => {
            if (response.status == 201) {
              this.success("Thank you for registering, please sign in.");
              this.$router.push({
                path: "/login",
              });
            }
          })
          .catch((error) => {
            const response = error.response;
            if (!response) {
              this.error(error);
            } else if (response.status === 400) {
              if (response.data.errors) {
                // Show the validation errors
                let msg = "Validation error: ";
                for (let err of response.data.errors) {
                  msg += `'${err.field}':${err.defaultMessage}. `;
                }
                this.error(msg);
              } else {
                this.error(response.data.message);
              }
            } else {
              this.error(response.data.message);
            }
          });
      }
    },
  },
};
</script>

<style scoped>
#register {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
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
  padding: 0 16px;
  z-index: 1000;
}


header img {
  height: 60px;
  width: auto;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-top: 60px;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-top: 60px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

#fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

button {
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  grid-column: span 2;
}

button:hover {
  background-color: #0056b3;
}

footer {
  justify-content: left;
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
  #fields {
    grid-template-columns: 1fr;
  }
  form {
    padding: 16px;
  }
  header nav a {
    font-size: 14px;
  }
  button {
    font-size: 14px;
  }
}
</style>