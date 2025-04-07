<template>
  <div class="bg-light min-vh-100">
    <!-- Header -->
    <header class="bg-gradient-primary text-white py-5 shadow">
      <div class="container text-center">
        <h1 class="display-4 fw-bold mb-3">
          <i class="bi bi-box-seam me-2"></i>Manajemen Barang
        </h1>
        <p class="lead mb-4">Sistem Pengelolaan Stok Gudang Terintegrasi</p>
        <button @click="logout" class="btn btn-outline-light btn-lg">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </header>

    <main class="container py-5">
      <div class="mb-5">
        <div class="row g-4 mb-4">
          <!-- Barang Masuk -->
          <div class="col-md-6">
            <div class="card card-hover h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="icon-wrapper bg-primary bg-opacity-10 rounded-circle p-3 mb-4 mx-auto">
                  <i class="bi bi-box-arrow-in-down text-primary fs-1"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Barang Masuk</h3>
                <p class="text-muted mb-4">Catat barang masuk ke gudang dengan sistem terintegrasi</p>
                <nuxt-link to="/barang/masuk" class="btn btn-primary px-4 stretched-link">
                  <i class="bi bi-arrow-right-circle me-2"></i>Masuk
                </nuxt-link>
              </div>
            </div>
          </div>

          <!-- Barang Keluar -->
          <div class="col-md-6">
            <div class="card card-hover h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="icon-wrapper bg-danger bg-opacity-10 rounded-circle p-3 mb-4 mx-auto">
                  <i class="bi bi-box-arrow-up text-danger fs-1"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Barang Keluar</h3>
                <p class="text-muted mb-4">Kelola pengeluaran barang dari gudang</p>
                <nuxt-link to="/barang/keluar" class="btn btn-danger px-4 stretched-link">
                  <i class="bi bi-arrow-right-circle me-2"></i>Keluar
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Stok Barang -->
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div class="card card-hover h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="icon-wrapper bg-success bg-opacity-10 rounded-circle p-3 mb-4 mx-auto">
                  <i class="bi bi-clipboard2-data text-success fs-1"></i>
                </div>
                <h3 class="h5 fw-bold mb-3">Stok Barang</h3>
                <p class="text-muted mb-4">Pantau stok barang secara real-time</p>
                <nuxt-link to="/barang/stok" class="btn btn-success px-4 stretched-link">
                  <i class="bi bi-arrow-right-circle me-2"></i>Stok
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        </div>

      <!-- Bulanan -->
      <div class="row mb-5">
        <div class="col-md-6 mb-4 mb-md-0">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 fw-bold mb-0">
                  <i class="bi bi-graph-up-arrow text-primary me-2"></i>Barang Masuk
                </h3>
                <span class="badge bg-primary bg-opacity-10 text-primary">Bulan Ini</span>
              </div>
              <h2 class="display-4 fw-bold text-primary mb-3">{{ totalMasuk }}</h2>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" :style="`width: ${progressMasuk}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 fw-bold mb-0">
                  <i class="bi bi-graph-down-arrow text-danger me-2"></i>Barang Keluar
                </h3>
                <span class="badge bg-danger bg-opacity-10 text-danger">Bulan Ini</span>
              </div>
              <h2 class="display-4 fw-bold text-danger mb-3">{{ totalKeluar }}</h2>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-danger" role="progressbar" :style="`width: ${progressKeluar}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Stok Barang -->
      <div class="card border-0 shadow">
        <div class="card-header bg-white py-3 border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="h5 fw-bold mb-0">
              <i class="bi bi-boxes me-2"></i>Daftar Stok Barang
            </h3>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">No</th>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th class="text-end pe-4">Stok</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="stokBarang.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">
                    <i class="bi bi-database-exclamation fs-1 d-block mb-2"></i>
                    Belum ada data stok barang
                  </td>
                </tr>
                <tr v-for="(barang, index) in stokBarang" :key="barang.id" class="align-middle">
                  <td class="ps-4">{{ index + 1 }}</td>
                  <td>
                    <span class="badge bg-primary bg-opacity-10 text-primary">{{ barang.kode }}</span>
                  </td>
                  <td>{{ barang.nama_barang }}</td>
                  <td class="text-end pe-4">
                    <span :class="`badge ${barang.stok < 10 ? 'bg-danger' : 'bg-success'}`">
                      {{ barang.stok }} pcs
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-white py-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Menampilkan {{ stokBarang.length }} dari {{ stokBarang.length }} barang</small>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const router = useRouter();

const stokBarang = ref([]);
const totalMasuk = ref(0);
const totalKeluar = ref(0);

const progressMasuk = computed(() => {
  const max = Math.max(totalMasuk.value, totalKeluar.value) || 100;
  return (totalMasuk.value / max) * 100;
});

const progressKeluar = computed(() => {
  const max = Math.max(totalMasuk.value, totalKeluar.value) || 100;
  return (totalKeluar.value / max) * 100;
});

const fetchData = async () => {
  try {
    const { data: barang, error: barangError } = await supabase
      .from('barang')
      .select('kode, nama_barang, stok')
      .order('stok', { ascending: false });

    if (barangError) throw barangError;
    stokBarang.value = barang;

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    const { data: masuk, error: masukError } = await supabase
      .from('transaksi')
      .select('jumlah, waktu')
      .eq('jenis', 'masuk')
      .gte('waktu', firstDay)
      .lte('waktu', lastDay);

    if (masukError) throw masukError;
    console.log('Data masuk bulan ini:', masuk); 
    totalMasuk.value = masuk.reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const { data: keluar, error: keluarError } = await supabase
      .from('transaksi')
      .select('jumlah, waktu')
      .eq('jenis', 'keluar')
      .gte('waktu', firstDay)
      .lte('waktu', lastDay);

    if (keluarError) throw keluarError;
    console.log('Data keluar bulan ini:', keluar); 
    totalKeluar.value = keluar.reduce((sum, item) => sum + (item.jumlah || 0), 0);

    console.log('Total Masuk:', totalMasuk.value, 'Total Keluar:', totalKeluar.value);
  } catch (err) {
    console.error('Error mengambil data:', err);
  }
};

const logout = async () => {
  await supabase.auth.signOut();
  router.push('/');
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
}

.card-hover {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #6c757d;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  padding: 5px 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.progress {
  border-radius: 100px;
  background-color: #f0f3f7;
}
</style>