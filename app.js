const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
  setup() {
    // Parameter Input
    const motorKm = ref(0);
    const mobilKm = ref(0);
    const transumumKm = ref(0);
    const listrikKwh = ref(0);
    const jamAc = ref(0);
    const porsiDaging = ref(0);

    // Faktor Emisi
    const EMISI_MOTOR = 0.09;
    const EMISI_MOBIL = 0.19;
    const EMISI_BUS = 0.05;
    const EMISI_LISTRIK = 0.85;
    const EMISI_AC_PER_JAM = 0.6;
    const EMISI_DAGING_PORSI = 3.5;
    const SERAP_POHON_PER_TAHUN = 22;

    // Computed Harian
    const emisiTransportasiHarian = computed(() => {
      return (
        (motorKm.value || 0) * EMISI_MOTOR +
        (mobilKm.value || 0) * EMISI_MOBIL +
        (transumumKm.value || 0) * EMISI_BUS
      );
    });

    const emisiEnergiHarian = computed(() => {
      return (
        (listrikKwh.value || 0) * EMISI_LISTRIK +
        (jamAc.value || 0) * EMISI_AC_PER_JAM
      );
    });

    const emisiMakananHarian = computed(() => {
      return ((porsiDaging.value || 0) * EMISI_DAGING_PORSI) / 7;
    });

    // Total Emisi Harian & Tahunan
    const emisiHarian = computed(() => {
      return (
        emisiTransportasiHarian.value +
        emisiEnergiHarian.value +
        emisiMakananHarian.value
      );
    });

    const emisiTahunan = computed(() => emisiHarian.value * 365);

    // Subtotal Tahunan
    const emisiTransportasiTahun = computed(() => emisiTransportasiHarian.value * 365);
    const emisiEnergiTahun = computed(() => emisiEnergiHarian.value * 365);
    const emisiMakananTahun = computed(() => emisiMakananHarian.value * 365);

    // Target Pohon
    const totalPohon = computed(() => {
      if (emisiTahunan.value <= 0) return 0;
      return Math.ceil(emisiTahunan.value / SERAP_POHON_PER_TAHUN);
    });

    // Inisialisasi Chart.js
    let chartInstance = null;

    const renderChart = () => {
      const ctx = document.getElementById('chartEmisi');
      if (!ctx) return;

      // Hancurkan chart lama jika ada sebelum membuat baru
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Transportasi', 'Energi', 'Makanan'],
          datasets: [{
            data: [
              emisiTransportasiTahun.value,
              emisiEnergiTahun.value,
              emisiMakananTahun.value
            ],
            backgroundColor: ['#0284c7', '#f59e0b', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 11 },
                usePointStyle: true,
                padding: 12
              }
            }
          },
          cutout: '70%'
        }
      });
    };

    const updateChart = () => {
      if (emisiHarian.value > 0) {
        // Jika elemen canvas baru muncul via v-show, inisialisasi jika belum ada
        if (!chartInstance) {
          setTimeout(renderChart, 50);
        } else {
          chartInstance.data.datasets[0].data = [
            emisiTransportasiTahun.value,
            emisiEnergiTahun.value,
            emisiMakananTahun.value
          ];
          chartInstance.update();
        }
      }
    };

    // Hilangkan onMounted(renderChart) agar tidak memaksa gambar chart saat data masih 0

    watch([emisiTransportasiTahun, emisiEnergiTahun, emisiMakananTahun], () => {
      updateChart();
    });

    onMounted(() => {
      renderChart();
    });
    return {
      motorKm,
      mobilKm,
      transumumKm,
      listrikKwh,
      jamAc,
      porsiDaging,
      emisiHarian,
      emisiTahunan,
      totalPohon
    };
  }
}).mount('#app');