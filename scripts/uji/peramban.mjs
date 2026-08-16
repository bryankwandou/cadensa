/**
 * Konteks peramban dengan batas waktu yang pantas untuk jaringan sungguhan.
 *
 * Batas bawaan Playwright — 30 detik — disusun untuk server uji di mesin yang
 * sama. Rangkaian di sini menembak situs yang benar-benar tayang, lewat
 * internet, dan sering menjalankan tiga mesin peramban berbarengan. Tiga puluh
 * detik cukup hampir selalu, dan "hampir" itulah yang membuat rangkaian
 * melaporkan kegagalan pada aplikasi yang tidak berubah sedikit pun.
 *
 * Kegagalan semacam itu lebih merugikan daripada tidak ada uji: yang membacanya
 * tidak bisa lagi membedakan mana bug dan mana jaringan, lalu berhenti membaca
 * keduanya.
 *
 * Angkanya sengaja longgar. Uji yang lambat masih memberi jawaban; uji yang
 * menuduh tidak memberi apa-apa.
 */
export async function konteks(browser, opsi = {}) {
  const ctx = await browser.newContext(opsi);
  ctx.setDefaultTimeout(60_000);
  ctx.setDefaultNavigationTimeout(120_000);
  return ctx;
}

/**
 * Navigasi yang mencoba sekali lagi sebelum menyerah.
 *
 * `networkidle` menunggu jaringan benar-benar sepi, dan di halaman yang punya
 * animasi berjalan serta pemuatan fon, kesepian itu kadang tidak pernah datang
 * pada percobaan pertama. Percobaan kedua memakai `domcontentloaded`, yang
 * cukup untuk semua yang diperiksa rangkaian ini.
 */
export async function buka(p, url, opsi = {}) {
  try {
    return await p.goto(url, { waitUntil: "networkidle", timeout: 60_000, ...opsi });
  } catch {
    return p.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  }
}
