<template>
  <div class="login-page d-flex align-items-center justify-content-center vh-100">
    <div class="card login-card shadow-lg">
      <div class="card-body p-5">
        <h2 class="card-title text-center mb-4">
          <i class="bi bi-person-circle text-primary me-2"></i>Login PT Honda
        </h2>
        <p v-if="message" class="text-danger text-center">{{ message }}</p>
        <form @submit.prevent="login">
          <!-- email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person-circle"></i>
              </span>
              <input
                type="text"
                id="email"
                v-model="email"
                class="form-control"
                placeholder="Masukkan Email"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-shield-lock-fill"></i>
              </span>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <!-- Login -->
          <button type="submit" class="btn btn-primary w-100 mb-3">
            <i class="bi bi-box-arrow-in-right me-2"></i>Login
          </button>

          <!-- Daftar -->
          <p class="text-center mt-3">
            Belum memiliki akun? Daftar <nuxt-link to="/akun/" class="text-primary">disini</nuxt-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hallogin'
});

useHead({
  title: "Login Akun - Daya Honda"
});

import { ref } from "vue";
import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();

const login = async () => {
  try {
    const { data: user, error } = await supabase
      .from("login") 
      .select("id, email, password, namaLengkap")
      .eq("email", email.value)
      .single();

    if (error || !user || user.password !== password.value) {
      message.value = "email atau password salah";
      return;
    }

    localStorage.setItem("email", user.email);

    router.push("/utama");
  } catch (err) {
    console.error("Error login:", err);
    message.value = "Terjadi kesalahan";
  }
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f0f3ef, #d7d6da);
}

.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
  border-radius: 12px;
}

.card-title {
  font-size: 1.75rem;
  font-weight: bold;
}

.input-group-text {
  background-color: #e9ecef;
  border: none;
}

.form-control {
  border-radius: 8px;
}

.btn-primary {
  background-color: #c10d0d;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #7e040c;
}

.text-primary {
  color: #b9051d !important;
}

.text-danger {
  font-size: 0.9rem;
  font-weight: bold;
}
</style>