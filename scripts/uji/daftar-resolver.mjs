import { register } from "node:module";

// Dipasang lewat `--import` supaya resolver sudah aktif sebelum modul pertama
// dimuat. Memanggil `register` dari dalam berkas uji sendiri sudah terlambat.
register("./resolusi-ts.mjs", import.meta.url);
