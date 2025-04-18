<template>
  <div class="min-vh-100 bg">
    <div class="container py-5">
      <!-- Tombol Kembali -->
      <div class="containers mb-4">
        <nuxt-link to="/barang/stok" class="btn btn-dark">
          <i class="bi bi-arrow-left"></i> Kembali
        </nuxt-link>
    </div>
    <div class="text-center mb-5">
      <h1 class="display-4">Detail Barang</h1>
      <p class="lead">Kode Barang: <strong>{{ barang.kode }}</strong></p>
      <p class="lead">Nama Barang: <strong>{{ barang.nama_barang }}</strong></p>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Tanggal</th>
            <th scope="col">Nama Barang</th>
            <th scope="col">Masuk</th>
            <th scope="col">Keluar</th>
            <th scope="col">Sisa Barang</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="riwayat.length === 0">
            <td colspan="5" class="text-center">Tidak ada riwayat transaksi.</td>
          </tr>
          <tr v-for="(row, index) in riwayat" :key="index">
            <td>{{ formatDate(row.tanggal) }}</td>
            <td>{{ row.nama_barang }}</td>
            <td class="text-success">{{ row.masuk }}</td>
            <td class="text-danger">{{ row.keluar }}</td>
            <td class="font-weight-bold">{{ row.sisa }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
useHead({
  title: "Stok Barang - Daya Honda"
});
  
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();

export default {
  data() {
    return {
      barang: {
        kode: '',
        nama_barang: '',
        stok: 0
      },
      riwayat: []
    };
  },
  async created() {
    const kode = this.$route.params.kode;
    if (!kode) {
      alert('Kode barang tidak valid.');
      this.$router.push('/');
      return;
    }

    await this.fetchBarang(kode);
    await this.fetchTransaksi(kode);
  },
  methods: {
    async fetchBarang(kode) {
      const { data, error } = await supabase
        .from('barang')
        .select('kode, nama_barang, stok')
        .eq('kode', kode)
        .single();

      if (error) {
        alert('Barang tidak ditemukan.');
        this.$router.push('/');
        return;
      }

      this.barang = data;
    },
    async fetchTransaksi(kode) {
      const { data, error } = await supabase
        .from('transaksi')
        .select('waktu, jumlah, jenis')
        .eq('kode', kode)
        .order('waktu', { ascending: false });

      if (error) {
        alert('Gagal mengambil riwayat transaksi.');
        return;
      }

      let sisaBarang = this.barang.stok;
      this.riwayat = data.map(trx => {
        if (trx.jenis === 'masuk') {
          sisaBarang += trx.jumlah;
        } else if (trx.jenis === 'keluar') {
          sisaBarang -= trx.jumlah;
        }

        return {
          tanggal: trx.waktu,
          nama_barang: this.barang.nama_barang,
          masuk: trx.jenis === 'masuk' ? trx.jumlah : 0,
          keluar: trx.jenis === 'keluar' ? trx.jumlah : 0,
          sisa: sisaBarang
        };
      }).reverse();
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
.bg {
  background: linear-gradient(135deg, #de6565, #5c494b);
  min-height: 100vh;
  padding: 1rem;
}

.container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.table {
  margin-top: 20px;
}

.thead-dark {
  background-color: #343a40;
  color: white;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.font-weight-bold {
  font-weight: bold;
}
</style>
