<script setup lang='ts'>
const runtimeConfig = useRuntimeConfig();
const enteredPassword = useCookie('enteredPassword', { maxAge: 60604800 });

const wrongPassword = ref(false)

const passwordInputValue = ref('')

const login = () => {
  enteredPassword.value = passwordInputValue.value;

  if (passwordInputValue.value === runtimeConfig.public.ADMIN_PASSWORD) {
    navigateTo('/data');
  } else {
    wrongPassword.value = true
  }
};

const logout = () => {
  enteredPassword.value = ''
}
</script>


<template>
  <div class="admin-page" v-if="enteredPassword !== runtimeConfig.public.ADMIN_PASSWORD">
    <h1>Admin Login</h1>
    <p class="error" v-if="wrongPassword">Fel lösenord</p>
    <div class="flex">
      <input type="password" placeholder="Lösenord" v-model="passwordInputValue">
      <button @click="login()">Login</button>
    </div>
  </div>
  <div class="admin-page" v-else>
    <h1>Du är inloggad</h1>
    <button @click="logout()">Logga ut</button>
  </div>
</template>


<style>
.admin-page {
  max-width: 30rem;
  width: 100%;
  margin: 5rem auto;
  border: 1px solid var(--border-color);
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.admin-page input {
  flex-grow: 1;
}

.admin-page .flex {
  display: flex;
}

.admin-page .error {
  margin: 0;
  text-align: start;
  margin-left: 0.25rem;
  color: var(--primary-red);
}
</style>