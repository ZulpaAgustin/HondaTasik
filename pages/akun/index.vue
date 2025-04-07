<template>
  <div class="login-page d-flex align-items-center justify-content-center vh-100">
    <div class="card login-card shadow-lg">
      <div class="card-body p-5">
        <h2 class="card-title text-center mb-4">
          <i class="bi bi-person-circle text-primary me-2"></i>Daftar Akun PT Honda
        </h2>
        <p v-if="message" :class="{'text-danger': isError, 'text-success': !isError}" class="text-center">{{ message }}</p>
        
        <form @submit.prevent="Daftar">
          <!-- Nama Lengkap -->
          <div class="mb-3">
            <label for="namaLengkap" class="form-label">Nama Lengkap</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person-badge"></i>
              </span>
              <input
                type="text"
                id="namaLengkap"
                v-model="namaLengkap"
                class="form-control"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                placeholder="Masukkan email"
                required
              />
            </div>
          </div>

          <!-- Nomor Handphone -->
          <div class="mb-3">
            <label for="handphone" class="form-label">Nomor Handphone</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-phone"></i>
              </span>
              <input
                type="tel"
                id="handphone"
                v-model="handphone"
                class="form-control"
                placeholder="Masukkan nomor handphone"
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

          <!-- Daftar -->
          <button type="submit" class="btn btn-primary w-100 mb-3">
            <i class="bi bi-person-plus me-2"></i>Daftar
          </button>

          <!-- Login -->
          <p class="text-center mt-3">
            Sudah memiliki akun? Login <nuxt-link to="/" class="text-primary">disini</nuxt-link>
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
  title: "Daftar Akun - Daya Honda"
});

import { ref } from "vue";
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();

const namaLengkap = ref("");
const email = ref("");
const handphone = ref("");
const password = ref("");

const message = ref("");
const isError = ref(false);

const Daftar = async () => {
  try {
    const { data, error } = await supabase.from("login").insert([
      {
        namaLengkap: namaLengkap.value,
        email: email.value,
        handphone: handphone.value,
        password: password.value,
      },
    ]);

    if (error) {
      message.value = "Pendaftaran gagal, silakan coba lagi.";
      isError.value = true;
      console.error("Error:", error);
      return;
    }

    namaLengkap.value = "";
    email.value = "";
    handphone.value = "";
    password.value = "";

    message.value = "Pendaftaran berhasil! Silakan login.";
    isError.value = false;
  } catch (err) {
    console.error("Error register:", err);
    message.value = "Terjadi kesalahan, silakan coba lagi.";
    isError.value = true;
  }
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f0f3ef, #d7d6da);
}

.login-card {
  width: 100%;
  max-width: 450px;
  border: none;
  border-radius: 12px;
}

.card-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #000000;
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
  font-weight: 500;
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

.text-success {
  font-size: 0.9rem;
  font-weight: bold;
  color: #28a745;
}
</style>