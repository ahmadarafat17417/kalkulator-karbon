const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    // Parameter Input
    const motorKm = ref(0);
    const mobilKm = ref(0);
    const transumumKm = ref(0);
    const listrikKwh = ref(0);
    const jamAc = ref(0);
    const porsiDaging = ref(0);

    // Faktor Emisi (Standar Rata-rata)
    // Transportasi (kg CO2 per km)
    const EMISI_MOTOR = 0.09;
    const EMISI_MOBIL = 0.19;
    const EMISI_BUS = 0.05;

    // Energi (kg CO2 per kWh / Jam)
    const EMISI_LISTRIK = 0.85; // Grid Indonesia rata-rata
    const EMISI_AC_PER_JAM = 0.6; // AC 1/2 PK rata-rata

    // Makanan (kg CO2 per porsi)
    const EMISI_DAGING_PORSI = 3.5;

    // Daya Serap Pohon (kg CO2 per tahun)
    const SERAP_POHON_PER_TAHUN = 22;

    // Computed: Emisi Harian per Kategori (kg CO2)
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
      // Input porsi mingguan dibagi 7 untuk emisi harian
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

    const emisiTahunan = computed(() => {
      return emisiHarian.value * 365;
    });

    // Subtotal Tahunan
    const emisiTransportasiTahun = computed(() => emisiTransportasiHarian.value * 365);
    const emisiEnergiTahun = computed(() => emisiEnergiHarian.value * 365);
    const emisiMakananTahun = computed(() => emisiMakananHarian.value * 365);

    // Total Pohon Wajib Ditanam
    const totalPohon = computed(() => {
      if (emisiTahunan.value <= 0) return 0;
      return Math.ceil(emisiTahunan.value / SERAP_POHON_PER_TAHUN);
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
      emisiTransportasiTahun,
      emisiEnergiTahun,
      emisiMakananTahun,
      totalPohon
    };
  }
}).mount('#app');