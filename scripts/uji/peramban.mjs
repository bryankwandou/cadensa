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
 * Galat yang datang dari mesin dan jaringannya, bukan dari aplikasi.
 *
 * Selama menyusun rangkaian ini, tiga kali laporan kegagalan ternyata berakar di
 * sini: jaringan mesin tertidur di tengah jalan, atau satu navigasi kehabisan
 * waktu karena tiga peramban berjalan berbarengan. Setiap kali, yang tercetak
 * adalah "rangkaian gagal" — kalimat yang sama persis dengan yang tercetak
 * ketika aplikasinya benar-benar rusak.
 *
 * Uji yang tidak bisa membedakan keduanya lebih merugikan daripada tidak ada
 * uji: yang membacanya berhenti mempercayai kegagalan, lalu berhenti membaca
 * keberhasilan juga.
 */
const GALAT_JARINGAN =
  /NETWORK_IO_SUSPENDED|INTERNET_DISCONNECTED|NETWORK_CHANGED|CONNECTION_RESET|CONNECTION_CLOSED|EMPTY_RESPONSE|NAME_NOT_RESOLVED|Failed to fetch|Timeout .* exceeded|net::ERR_/i;

export const galatJaringan = (e) => GALAT_JARINGAN.test(String(e?.message ?? e));

/**
 * Navigasi yang bertahan terhadap jaringan yang tersendat.
 *
 * Tiga percobaan dengan jeda menaik. Percobaan pertama menunggu `networkidle`,
 * yang paling menjamin halamannya benar-benar siap; sisanya turun ke
 * `domcontentloaded`, yang cukup untuk semua yang diperiksa rangkaian ini —
 * karena setiap asersi setelahnya sudah menunggu isinya sendiri.
 *
 * Galat yang bukan galat jaringan dilempar apa adanya pada percobaan pertama.
 * Mengulang kesalahan yang berasal dari aplikasi hanya menunda laporannya.
 */
export async function buka(p, url, opsi = {}) {
  let terakhir;
  for (let percobaan = 0; percobaan < 3; percobaan++) {
    try {
      return await p.goto(url, {
        waitUntil: percobaan === 0 ? "networkidle" : "domcontentloaded",
        timeout: 60_000,
        ...opsi,
      });
    } catch (e) {
      terakhir = e;
      if (!galatJaringan(e)) throw e;
      await p.waitForTimeout(2000 * (percobaan + 1));
    }
  }
  throw terakhir;
}
