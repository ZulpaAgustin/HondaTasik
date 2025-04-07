<template>
  <div class="bg-light min-vh-100">
    <!-- Header -->
    <header class="bg-danger text-white py-5">
      <div class="container text-center">
        <h1 class="display-4 fw-bold">Barang Keluar</h1>
        <p class="lead">Catat barang keluar dengan mudah dan terorganisir.</p>
      </div>
    </header>

    <!-- Tombol Kembali -->
    <div class="container mt-4">
      <router-link to="/utama" class="btn btn-dark">
        <i class="bi bi-arrow-left"></i> Kembali
      </router-link>
    </div>

    <main class="container py-5">
      <div class="row">
        <!-- Form -->
        <div class="col-md-6 mb-4">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">
                <i class="bi bi-box-arrow-down text-danger"></i> Tambah Barang Keluar
              </h2>
              <form @submit.prevent="tambahBarangKeluar">
                <div class="mb-3">
                  <label for="kodeBarang" class="form-label">Kode Barang</label>
                  <select
                    id="kodeBarang"
                    v-model="form.kodeBarang"
                    class="form-select"
                    required
                    @change="getNamaBarang"
                  >
                    <option value="" disabled selected>Pilih Kode Barang</option>
                    <option v-for="barang in daftarBarang" :key="barang.kode" :value="barang.kode">
                      {{ barang.kode }} - {{ barang.nama_barang }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="namaBarang" class="form-label">Nama Barang</label>
                  <input
                    type="text"
                    id="namaBarang"
                    v-model="form.namaBarang"
                    class="form-control"
                    readonly
                  />
                </div>
                <div class="mb-3">
                  <label for="jumlah" class="form-label">Jumlah</label>
                  <input
                    type="number"
                    id="jumlah"
                    v-model="form.jumlah"
                    class="form-control"
                    placeholder="Masukkan jumlah barang"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="tanggal" class="form-label">Tanggal Keluar</label>
                  <input
                    type="date"
                    id="tanggal"
                    v-model="form.tanggal"
                    class="form-control"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-danger w-100">
                  <i class="bi bi-save2"></i> Simpan
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Tabel -->
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="card-title mb-0">
                  <i class="bi bi-box-seam text-danger"></i> Barang Keluar Terbaru
                </h2>
                <div>
                  <select v-model="printFilter" class="form-select me-2" style="width: auto; display: inline-block;">
                    <option value="hari-ini">Hari Ini</option>
                    <option value="bulan-ini">Bulan Ini</option>
                  </select>
                  <button @click="printBarangKeluar" class="btn btn-success">
                    <i class="bi bi-printer"></i> Print
                  </button>
                </div>
              </div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="transaksi.length === 0">
                    <td colspan="5" class="text-center text-muted">Belum ada data barang keluar.</td>
                  </tr>
                  <tr v-for="(trx, index) in transaksi" :key="trx.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ trx.kode }}</td>
                    <td>{{ trx.nama_barang }}</td>
                    <td>{{ trx.jumlah }}</td>
                    <td>{{ formatTanggal(trx.waktu) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const router = useRouter();

const daftarBarang = ref([]);
const transaksi = ref([]);
const loading = ref(true);
const printFilter = ref('hari-ini');
const form = ref({
  kodeBarang: '',
  namaBarang: '',
  jumlah: 0,
  tanggal: new Date().toISOString().slice(0, 10), 
});

const getDaftarBarang = async () => {
  try {
    const { data, error } = await supabase
      .from('barang')
      .select('kode, nama_barang');

    if (error) throw error;
    daftarBarang.value = data;
  } catch (err) {
    console.error('Error mengambil barang:', err);
  }
};

const getNamaBarang = () => {
  const selectedBarang = daftarBarang.value.find((barang) => barang.kode === form.value.kodeBarang);
  form.value.namaBarang = selectedBarang ? selectedBarang.nama_barang : '';
};

const getTransaksiKeluar = async () => {
  try {
    const { data, error } = await supabase
      .from('transaksi')
      .select('id, kode, jumlah, waktu, barang(nama_barang)')
      .eq('jenis', 'keluar')
      .order('waktu', { ascending: false });

    if (error) throw error;
    transaksi.value = data.map((trx) => ({
      id: trx.id,
      kode: trx.kode,
      nama_barang: trx.barang.nama_barang,
      jumlah: trx.jumlah,
      waktu: trx.waktu,
    }));
  } catch (err) {
    console.error('Error mengambil data:', err);
  } finally {
    loading.value = false;
  }
};

const tambahBarangKeluar = async () => {
  try {
    const { data: barangData, error: barangError } = await supabase
      .from('barang')
      .select('stok')
      .eq('kode', form.value.kodeBarang)
      .single();

    if (barangError) throw barangError;

    if (barangData.stok < form.value.jumlah) {
      alert('Stok tidak mencukupi!');
      return;
    }

    const { error: transaksiError } = await supabase
      .from('transaksi')
      .insert([
        {
          kode: form.value.kodeBarang,
          jumlah: parseInt(form.value.jumlah),
          jenis: 'keluar',
          waktu: form.value.tanggal,
        },
      ]);

    if (transaksiError) throw transaksiError;

    const { error: updateError } = await supabase
      .from('barang')
      .update({ stok: barangData.stok - parseInt(form.value.jumlah) })
      .eq('kode', form.value.kodeBarang);

    if (updateError) throw updateError;

    form.value = {
      kodeBarang: '',
      namaBarang: '',
      jumlah: 0,
      tanggal: new Date().toISOString().slice(0, 10),
    };

    await getTransaksiKeluar();
    alert('Barang keluar berhasil di catat!');
  } catch (err) {
    console.error('Error:', err);
    alert('Error mengurangi barang keluar:', err);
  }
};

const formatTanggal = (waktu) => {
  return new Date(waktu).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const printBarangKeluar = () => {
  const filteredData = transaksi.value.filter((trx) => {
    const tanggalTransaksi = new Date(trx.waktu);
    const sekarang = new Date();

    if (printFilter.value === 'hari-ini') {
      return (
        tanggalTransaksi.getDate() === sekarang.getDate() &&
        tanggalTransaksi.getMonth() === sekarang.getMonth() &&
        tanggalTransaksi.getFullYear() === sekarang.getFullYear()
      );
    } else if (printFilter.value === 'bulan-ini') {
      return (
        tanggalTransaksi.getMonth() === sekarang.getMonth() &&
        tanggalTransaksi.getFullYear() === sekarang.getFullYear()
      );
    }
    return true;
  });

  // Calculate total
  const totalJumlah = filteredData.reduce((sum, trx) => sum + trx.jumlah, 0);

  // print
  const printContent = `
    <div style="text-align: center;">
      <img src="${logo}" alt="Logo" style="width: 100px; height: auto; margin-bottom: 10px;">
      <h2 style="font-size: 18px; font-weight: bold;">Daya Anugrah Motor Tasikmalaya</h2>
      <h5 style="font-size: 14px; font-weight: bold;">Jl. Sutisna Senjaya No.55, Empangsari, Kec. Tawang, Kab. Tasikmalaya, Jawa Barat 46111</h5>
      <h3 style="font-size: 16px; margin-bottom: 20px;">Barang Keluar</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>     
          </tr>
        </thead>
        <tbody>
          ${filteredData
            .map(
              (trx, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${formatTanggal(trx.waktu)}</td>
              <td>${trx.kode}</td>
              <td>${trx.nama_barang}</td>
              <td>${trx.jumlah}</td>  
            </tr>
          `
            )
            .join('')}
          <tr>
            <td colspan="4" style="text-align: center; font-weight: bold;">Total</td>
            <td style="font-weight: bold;">${totalJumlah}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // Lnjt
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Cetak Barang Keluar</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

onMounted(() => {
  getDaftarBarang();
  getTransaksiKeluar();
});
</script>

<style scoped>
header {
  background: linear-gradient(45deg, #dc3545, #ff6b6b);
}

.card {
  border: none;
  border-radius: 10px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.table th {
  background-color: #343a40;
  color: white;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}
</style>