<template>
  <div>
    <footer class="bg-dark text-white py-3 text-center jarak">
      <p class="mb-0">&copy; 2025 - {{ tahun }} Manajemen Barang AHASS Tasikmalaya. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup>
let tahun = new Date().getFullYear()
</script>

<style scoped>
.jarak {
  margin-top: 20vh;
}
</style>