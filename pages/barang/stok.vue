<template>
  <div class="bg-light min-vh-100">
    <!-- Header -->
    <header class="bg-success text-white py-5">
      <div class="container text-center">
        <h1 class="display-4 fw-bold">Stok Barang</h1>
        <p class="lead">Kelola stok barang dengan mudah dan terorganisir.</p>
      </div>
    </header>

    <!-- Tombol Kembali -->
    <div class="container mt-4">
      <nuxt-link to="/utama" class="btn btn-dark">
        <i class="bi bi-arrow-left"></i> Kembali
      </nuxt-link>
    </div>

    <main class="container py-5">
      <!-- Pencarian -->
      <div class="search-container mb-4">
        <form @submit.prevent="cariBarang" class="d-flex">
          <input
            type="text"
            v-model="search"
            class="form-control me-2"
            placeholder="Cari nama barang"
          />
          <button type="submit" class="btn btn-success">
            <i class="bi bi-search"></i>Cari
          </button>
        </form>
      </div>

      <!-- Tabel -->
      <div class="card shadow">
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Stok</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="barang.length === 0">
                <td colspan="3" class="text-center text-muted">Tidak ada data barang.</td>
              </tr>
              <tr
                v-for="item in barang"
                :key="item.kode"
                @click="lihatDetail(item.kode)"
                style="cursor: pointer;"
              >
                <td>{{ item.kode }}</td>
                <td>{{ item.nama_barang }}</td>
                <td>{{ item.stok }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: "Stok Barang - Daya Honda"
});
  
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const router = useRouter();

const barang = ref([]);
const search = ref('');

const getBarang = async () => {
  try {
    let query = supabase
      .from('barang')
      .select('kode, nama_barang, stok');

    if (search.value) {
      query = query.ilike('nama_barang', `%${search.value}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    barang.value = data;
  } catch (err) {
    console.error('Error fetching barang:', err);
  }
};

const cariBarang = () => {
  getBarang();
};

const lihatDetail = (kode) => {
  router.push({ path: `/barang/detail-barang/${kode}` });
};

onMounted(() => {
  getBarang();
});
</script>

<style scoped>
header {
  background: linear-gradient(45deg, #28a745, #218838);
}

.search-container {
  max-width: 600px;
  margin: 0 auto 20px;
}

.table th {
  background-color: #28a745;
  color: white;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
