# İçerik sayımı (SAYIM)

> Otomatik üretilir: `pnpm --filter @motto/content-schema count` — elle düzenleme. Kaynak: `packages/content-schema/fixtures/**`, kotalar: `docs/content/taxonomy.json` (D-155, Σ kota = 10.000).

## Özet

| Ölçü | Değer |
|---|---:|
| Alan paketlerindeki geçerli olay | **7.886** / 10.000 (78.9%) |
| Kotası dolan alan | 4 / 132 |
| Kotayı aşan alan | 1 |
| Alan dışı: `core` | 6 |
| Alan dışı: `demo` | 42 |
| Genel toplam geçerli olay | **7.934** |
| Şema hatalı dosya | 0 |

## Grup bazında

| Grup | Alan | Sayı | Kota | % |
|---|---:|---:|---:|---:|
| egitim | 5 | 280 | 358 | 78.2% |
| is | 11 | 751 | 945 | 79.5% |
| kariyer | 24 | 920 | 1142 | 80.6% |
| para | 8 | 482 | 617 | 78.1% |
| ev | 8 | 483 | 618 | 78.2% |
| tanidik_yuzler | 8 | 635 | 814 | 78% |
| iliski | 7 | 523 | 670 | 78.1% |
| aile | 6 | 331 | 424 | 78.1% |
| cagrilar | 2 | 132 | 169 | 78.1% |
| ebeveynlik | 5 | 279 | 359 | 77.7% |
| sosyal | 8 | 421 | 539 | 78.1% |
| saglik | 9 | 573 | 716 | 80% |
| gundelik | 6 | 391 | 501 | 78% |
| ulasim | 3 | 205 | 234 | 87.6% |
| teknoloji | 3 | 210 | 268 | 78.4% |
| burokrasi | 3 | 213 | 273 | 78% |
| bos_zaman | 4 | 234 | 299 | 78.3% |
| mevsim | 2 | 127 | 163 | 77.9% |
| yaslilik | 6 | 330 | 422 | 78.2% |
| meta | 4 | 366 | 469 | 78% |

## Alan bazında

| # | Alan | Grup | Başlık | Sayı | Kota | Kalan | % | İlerleme |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `egitim_universite` | egitim | Üniversite hayatı | 111 | 143 | 32 | 77.6% | ████████░░ |
| 2 | `egitim_sinavlar` | egitim | Sınavlar ve sonuçlar | 61 | 78 | 17 | 78.2% | ████████░░ |
| 3 | `egitim_kurs_sertifika` | egitim | Kurslar ve sertifikalar | 46 | 59 | 13 | 78% | ████████░░ |
| 4 | `egitim_lisansustu` | egitim | Lisansüstü ve tez | 31 | 39 | 8 | 79.5% | ████████░░ |
| 5 | `askerlik_ogrenim_kredisi` | egitim | Askerlik (TR) / Öğrenim kredisi (EN) | 31 | 39 | 8 | 79.5% | ████████░░ |
| 6 | `is_arama` | is | İş arama ve mülakat | 117 | 150 | 33 | 78% | ████████░░ |
| 7 | `ilk_isler_yari_zamanli` | is | İlk işler, staj, yarı zamanlı | 91 | 104 | 13 | 87.5% | █████████░ |
| 8 | `ofis_hayati` | is | Ofis hayatı ve toplantılar | 111 | 143 | 32 | 77.6% | ████████░░ |
| 9 | `is_yeri_politikasi` | is | İş yeri politikası ve iş arkadaşları | 86 | 111 | 25 | 77.5% | ████████░░ |
| 10 | `patron_nevin` | is | Nevin Hanım (patron) arkı | 77 | 98 | 21 | 78.6% | ████████░░ |
| 11 | `maas_terfi_zam` | is | Maaş, zam ve terfi | 66 | 85 | 19 | 77.6% | ████████░░ |
| 12 | `isten_cikis_issizlik` | is | İşten çıkış ve işsizlik | 56 | 72 | 16 | 77.8% | ████████░░ |
| 13 | `uzaktan_calisma` | is | Uzaktan ve hibrit çalışma | 40 | 52 | 12 | 76.9% | ████████░░ |
| 14 | `yan_gelir_girisim` | is | Yan gelir ve küçük girişimler | 46 | 59 | 13 | 78% | ████████░░ |
| 15 | `is_seyahati` | is | İş seyahati ve konferans | 26 | 26 | 0 | 100% | ██████████ |
| 16 | `kariyer_degisimi` | is | Kariyer değişimi (orta yaş) | 35 | 45 | 10 | 77.8% | ████████░░ |
| 17 | `kariyer_waiter` | kariyer | Kariyer: Garson → Şef | 46 | 59 | 13 | 78% | ████████░░ |
| 18 | `kariyer_courier` | kariyer | Kariyer: Kurye | 46 | 59 | 13 | 78% | ████████░░ |
| 19 | `kariyer_boilertech` | kariyer | Kariyer: Kombi Ustası | 35 | 45 | 10 | 77.8% | ████████░░ |
| 20 | `kariyer_driver` | kariyer | Kariyer: Dolmuş Şoförü (TR) / Rideshare (EN) | 40 | 52 | 12 | 76.9% | ████████░░ |
| 21 | `kariyer_clerk` | kariyer | Kariyer: Memur | 40 | 52 | 12 | 76.9% | ████████░░ |
| 22 | `kariyer_nurse` | kariyer | Kariyer: Hemşire | 40 | 52 | 12 | 76.9% | ████████░░ |
| 23 | `kariyer_doctor` | kariyer | Kariyer: Doktor | 40 | 52 | 12 | 76.9% | ████████░░ |
| 24 | `kariyer_lawyer` | kariyer | Kariyer: Avukat | 38 | 49 | 11 | 77.6% | ████████░░ |
| 25 | `kariyer_dev` | kariyer | Kariyer: Yazılımcı | 46 | 58 | 12 | 79.3% | ████████░░ |
| 26 | `kariyer_teacher` | kariyer | Kariyer: Öğretmen | 55 | 55 | 0 | 100% | ██████████ |
| 27 | `kariyer_academic` | kariyer | Kariyer: Akademisyen | 43 | 42 | 0 | 102.4% | ██████████ |
| 28 | `kariyer_realtor` | kariyer | Kariyer: Emlakçı | 42 | 45 | 3 | 93.3% | █████████░ |
| 29 | `kariyer_actor` | kariyer | Kariyer: Dizi Oyuncusu | 35 | 45 | 10 | 77.8% | ████████░░ |
| 30 | `kariyer_shopkeeper` | kariyer | Kariyer: Esnaf | 40 | 52 | 12 | 76.9% | ████████░░ |
| 31 | `kariyer_pilot` | kariyer | Kariyer: Pilot | 31 | 39 | 8 | 79.5% | ████████░░ |
| 32 | `kariyer_accountant` | kariyer | Kariyer: Muhasebeci | 35 | 45 | 10 | 77.8% | ████████░░ |
| 33 | `kariyer_lifecoach` | kariyer | Kariyer: Hayat Koçu (absürt) | 38 | 49 | 11 | 77.6% | ████████░░ |
| 34 | `kariyer_influencer` | kariyer | Kariyer: Influencer (absürt) | 40 | 52 | 12 | 76.9% | ████████░░ |
| 35 | `kariyer_crypto` | kariyer | Kariyer: Kripto Gurusu (absürt) | 33 | 42 | 9 | 78.6% | ████████░░ |
| 36 | `kariyer_fortune` | kariyer | Kariyer: Kahve Falcısı (TR) / Burç Yazarı (EN) | 31 | 39 | 8 | 79.5% | ████████░░ |
| 37 | `kariyer_weddingdj` | kariyer | Kariyer: Düğün DJ'i (absürt) | 33 | 42 | 9 | 78.6% | ████████░░ |
| 38 | `kariyer_hoa` | kariyer | Kariyer: Site Yöneticisi (absürt) | 31 | 39 | 8 | 79.5% | ████████░░ |
| 39 | `kariyer_doortodoor` | kariyer | Kariyer: Kapıdan Satış (absürt) | 31 | 39 | 8 | 79.5% | ████████░░ |
| 40 | `kariyer_developer` | kariyer | Kariyer: Müteahhit (absürt) | 31 | 39 | 8 | 79.5% | ████████░░ |
| 41 | `para_butce_ay_sonu` | para | Bütçe ve ay sonu | 101 | 130 | 29 | 77.7% | ████████░░ |
| 42 | `faturalar_abonelikler` | para | Faturalar ve abonelikler | 81 | 104 | 23 | 77.9% | ████████░░ |
| 43 | `borc_kredi_karti` | para | Borç, kredi kartı ve kredi | 77 | 98 | 21 | 78.6% | ████████░░ |
| 44 | `banka_atm` | para | Banka ve ATM | 46 | 58 | 12 | 79.3% | ████████░░ |
| 45 | `birikim_yatirim` | para | Birikim ve yatırım | 46 | 58 | 12 | 79.3% | ████████░░ |
| 46 | `vergi_sigorta` | para | Vergi ve sigorta | 35 | 45 | 10 | 77.8% | ████████░░ |
| 47 | `sans_ikramiye` | para | Şans ve beklenmedik paralar | 40 | 52 | 12 | 76.9% | ████████░░ |
| 48 | `dolandiricilik_kurban` | para | Dolandırıcılık (kurban olarak) | 56 | 72 | 16 | 77.8% | ████████░░ |
| 49 | `anne_evinde_yasam` | ev | Annenin evinde yaşamak | 66 | 85 | 19 | 77.6% | ████████░░ |
| 50 | `ev_arama_kiralama` | ev | Ev arama ve kiralama | 61 | 78 | 17 | 78.2% | ████████░░ |
| 51 | `ev_sahibi` | ev | Ev sahibi | 71 | 91 | 20 | 78% | ████████░░ |
| 52 | `komsu_sukran` | tanidik_yuzler | Şükran Teyze arkı | 71 | 91 | 20 | 78% | ████████░░ |
| 53 | `apartman_komsuluk` | ev | Apartman ve komşuluk | 77 | 98 | 21 | 78.6% | ████████░░ |
| 54 | `ev_arkadasi_baris` | tanidik_yuzler | Barış (ev arkadaşı) arkı | 81 | 104 | 23 | 77.9% | ████████░░ |
| 55 | `tasinma` | ev | Taşınma | 46 | 58 | 12 | 79.3% | ████████░░ |
| 56 | `ev_tamiri_ariza` | ev | Ev arızaları ve tamirat | 71 | 91 | 20 | 78% | ████████░░ |
| 57 | `ev_isleri` | ev | Ev işleri ve düzen | 56 | 72 | 16 | 77.8% | ████████░░ |
| 58 | `ev_satin_alma` | ev | Ev satın alma ve tapu | 35 | 45 | 10 | 77.8% | ████████░░ |
| 59 | `flort_tanisma` | iliski | Flört ve tanışma | 127 | 163 | 36 | 77.9% | ████████░░ |
| 60 | `ilk_ask_yagmur` | tanidik_yuzler | Yağmur (ilk aşk, eski sevgili) arkı | 77 | 98 | 21 | 78.6% | ████████░░ |
| 61 | `iliski_gunluk` | iliski | İlişkide gündelik hayat | 111 | 143 | 32 | 77.6% | ████████░░ |
| 62 | `ayrilik` | iliski | Ayrılık | 46 | 58 | 12 | 79.3% | ████████░░ |
| 63 | `nisan_teklif_dugun` | iliski | Evlilik teklifi, nişan, düğün | 56 | 72 | 16 | 77.8% | ████████░░ |
| 64 | `evlilik_gunluk` | iliski | Evli hayat | 101 | 130 | 29 | 77.7% | ████████░░ |
| 65 | `bosanma` | iliski | Boşanma | 31 | 39 | 8 | 79.5% | ████████░░ |
| 66 | `kayin_aile` | aile | Kayınvalide, kayınpeder, eşin ailesi | 51 | 65 | 14 | 78.5% | ████████░░ |
| 67 | `gec_ask_yalnizlik` | iliski | Bekâr hayat, geç aşk, yeniden başlamak | 51 | 65 | 14 | 78.5% | ████████░░ |
| 68 | `anne` | tanidik_yuzler | Anne arkı | 131 | 169 | 38 | 77.5% | ████████░░ |
| 69 | `cagri_anne` | cagrilar | ANNE ARIYOR (çağrı devralma) | 86 | 111 | 25 | 77.5% | ████████░░ |
| 70 | `cagri_diger` | cagrilar | Diğer çağrılar (Dayı, Nevin Hanım, Yağmur) | 46 | 58 | 12 | 79.3% | ████████░░ |
| 71 | `dayi` | tanidik_yuzler | Dayı arkı | 77 | 98 | 21 | 78.6% | ████████░░ |
| 72 | `kardesler` | aile | Kardeşler | 61 | 78 | 17 | 78.2% | ████████░░ |
| 73 | `akrabalar` | aile | Teyzeler, halalar, kuzenler | 66 | 85 | 19 | 77.6% | ████████░░ |
| 74 | `aile_grubu` | aile | Aile Grubu (mesajlaşma) | 66 | 85 | 19 | 77.6% | ████████░░ |
| 75 | `buyukanne_buyukbaba` | aile | Büyükanne ve büyükbaba | 31 | 39 | 8 | 79.5% | ████████░░ |
| 76 | `yaslanan_ebeveyn` | aile | Yaşlanan anneye bakım | 56 | 72 | 16 | 77.8% | ████████░░ |
| 77 | `bebek_yolda` | ebeveynlik | Bebek kararı ve bebek yolda | 31 | 39 | 8 | 79.5% | ████████░░ |
| 78 | `yeni_ebeveyn` | ebeveynlik | Yeni ebeveyn (bebeklik) | 56 | 72 | 16 | 77.8% | ████████░░ |
| 79 | `cocuk_buyutme` | ebeveynlik | Okul çağı ve ergen çocuk | 96 | 124 | 28 | 77.4% | ████████░░ |
| 80 | `bos_yuva` | ebeveynlik | Yetişkin çocuk ve boş yuva | 40 | 52 | 12 | 76.9% | ████████░░ |
| 81 | `torunlar` | ebeveynlik | Torunlar (büyükanne/büyükbaba olmak) | 56 | 72 | 16 | 77.8% | ████████░░ |
| 82 | `arkadaslar` | sosyal | Arkadaşlık | 111 | 143 | 32 | 77.6% | ████████░░ |
| 83 | `dugun_davetli` | sosyal | Düğünlerde misafir | 51 | 65 | 14 | 78.5% | ████████░░ |
| 84 | `cenaze_taziye` | sosyal | Cenaze ve taziye (misafir) | 35 | 45 | 10 | 77.8% | ████████░░ |
| 85 | `kutlamalar_dogum_gunu` | sosyal | Doğum günleri ve kutlamalar | 46 | 58 | 12 | 79.3% | ████████░░ |
| 86 | `gece_hayati_eglence` | sosyal | Gece hayatı ve dışarı çıkmak | 56 | 72 | 16 | 77.8% | ████████░░ |
| 87 | `yabancilar_sokak` | sosyal | Sokakta yabancılar | 51 | 65 | 14 | 78.5% | ████████░░ |
| 88 | `mahalle_esnaf` | sosyal | Mahalle esnafı | 40 | 52 | 12 | 76.9% | ████████░░ |
| 89 | `kucuk_rahatsizliklar` | saglik | Küçük rahatsızlıklar | 105 | 117 | 12 | 89.7% | █████████░ |
| 90 | `doktor_hastane` | saglik | Doktor, check-up, diş, göz | 86 | 111 | 25 | 77.5% | ████████░░ |
| 91 | `uyku` | saglik | Uyku | 51 | 65 | 14 | 78.5% | ████████░░ |
| 92 | `spor_fitness` | saglik | Spor salonu ve egzersiz | 66 | 85 | 19 | 77.6% | ████████░░ |
| 93 | `kronik_saglik` | saglik | Kronik sağlık (adsız) | 46 | 58 | 12 | 79.3% | ████████░░ |
| 94 | `yaslanan_beden` | saglik | Yaşlanan beden | 61 | 78 | 17 | 78.2% | ████████░░ |
| 95 | `ruhsal_yuk_dusuk_keyif` | saglik | Ruhsal yük ve düşük Keyif günleri | 71 | 91 | 20 | 78% | ████████░░ |
| 96 | `stres_tukenmislik` | saglik | Stres ve tükenmişlik | 56 | 72 | 16 | 77.8% | ████████░░ |
| 97 | `aliskanliklar_birakma` | saglik | Sigara/alkol ve bırakma denemeleri | 31 | 39 | 8 | 79.5% | ████████░░ |
| 98 | `yemek_mutfak` | gundelik | Yemek ve mutfak | 81 | 104 | 23 | 77.9% | ████████░░ |
| 99 | `disarida_yemek_siparis` | gundelik | Dışarıda yemek ve sipariş | 61 | 78 | 17 | 78.2% | ████████░░ |
| 100 | `market_alisveris` | gundelik | Market ve alışveriş | 71 | 91 | 20 | 78% | ████████░░ |
| 101 | `alisveris_kiyafet_online` | gundelik | Kıyafet ve online alışveriş | 61 | 78 | 17 | 78.2% | ████████░░ |
| 102 | `kisisel_bakim_berber` | gundelik | Berber, kuaför ve kişisel bakım | 40 | 52 | 12 | 76.9% | ████████░░ |
| 103 | `gundelik_rutin` | gundelik | Sabahlar, rutin ve sıradan günler | 77 | 98 | 21 | 78.6% | ████████░░ |
| 104 | `toplu_tasima` | ulasim | Toplu taşıma ve işe gidiş | 71 | 91 | 20 | 78% | ████████░░ |
| 105 | `taksici` | tanidik_yuzler | Taksici arkı | 61 | 78 | 17 | 78.2% | ████████░░ |
| 106 | `araba_sahipligi` | ulasim | Araba sahipliği | 82 | 91 | 9 | 90.1% | █████████░ |
| 107 | `trafik_cezalar` | ulasim | Trafik ve cezalar | 52 | 52 | 0 | 100% | ██████████ |
| 108 | `telefon_teknoloji` | teknoloji | Telefon ve teknoloji | 77 | 98 | 21 | 78.6% | ████████░░ |
| 109 | `sosyal_medya` | teknoloji | Sosyal medya | 77 | 98 | 21 | 78.6% | ████████░░ |
| 110 | `dijital_eglence` | teknoloji | Dizi, oyun ve ekran keyfi | 56 | 72 | 16 | 77.8% | ████████░░ |
| 111 | `burokrasi_resmi_daire` | burokrasi | Bürokrasi ve resmî daireler (kurgusal) | 86 | 111 | 25 | 77.5% | ████████░░ |
| 112 | `evrak_mektuplar` | burokrasi | Evrak kartları ve resmî mektuplar | 81 | 104 | 23 | 77.9% | ████████░░ |
| 113 | `hukuki_sorunlar` | burokrasi | Küçük hukuki dertler (kurgusal) | 46 | 58 | 12 | 79.3% | ████████░░ |
| 114 | `hobiler` | bos_zaman | Hobiler (el işi, müzik, kitap, bahçe) | 86 | 111 | 25 | 77.5% | ████████░░ |
| 115 | `spor_amator_izleme` | bos_zaman | Amatör spor ve maç izlemek | 46 | 58 | 12 | 79.3% | ████████░░ |
| 116 | `seyahat_tatil` | bos_zaman | Seyahat ve tatil | 71 | 91 | 20 | 78% | ████████░░ |
| 117 | `evcil_pamuk` | tanidik_yuzler | Pamuk (kedi) arkı | 86 | 111 | 25 | 77.5% | ████████░░ |
| 118 | `diger_evcil_hayvanlar` | bos_zaman | Diğer evcil hayvanlar | 31 | 39 | 8 | 79.5% | ████████░░ |
| 119 | `gonulluluk_iyilik` | sosyal | Gönüllülük ve küçük iyilikler | 31 | 39 | 8 | 79.5% | ████████░░ |
| 120 | `mevsimler_hava` | mevsim | Mevsimler ve hava durumu | 66 | 85 | 19 | 77.6% | ████████░░ |
| 121 | `bayram_ozel_gunler` | mevsim | Bayramlar, yılbaşı ve özel günler (genel) | 61 | 78 | 17 | 78.2% | ████████░░ |
| 122 | `orta_yas` | yaslilik | Orta yaş | 46 | 58 | 12 | 79.3% | ████████░░ |
| 123 | `emeklilik_gecis` | yaslilik | Emekliliğe geçiş | 51 | 65 | 14 | 78.5% | ████████░░ |
| 124 | `emekli_hayati` | yaslilik | Emekli hayatı | 81 | 104 | 23 | 77.9% | ████████░░ |
| 125 | `yaslilik_gundelik` | yaslilik | Yaşlılık ve gündelik hayat | 86 | 111 | 25 | 77.5% | ████████░░ |
| 126 | `miras_vasiyet` | yaslilik | Miras, vasiyet ve düzen | 31 | 39 | 8 | 79.5% | ████████░░ |
| 127 | `veda_kayip` | yaslilik | Vedalar ve kayıplar (sessizlik protokolü) | 35 | 45 | 10 | 77.8% | ████████░░ |
| 128 | `tanidik_yuzler_kesisme` | tanidik_yuzler | Tanıdık Yüzler kesişme günleri | 51 | 65 | 14 | 78.5% | ████████░░ |
| 129 | `tek_hedef_anlari` | meta | Tek Hedef anları | 61 | 78 | 17 | 78.2% | ████████░░ |
| 130 | `efsane_nadir` | meta | Efsane nadir günler | 77 | 98 | 21 | 78.6% | ████████░░ |
| 131 | `absurt_kuyruk` | meta | Kara mizah: absürt kuyruk | 101 | 130 | 29 | 77.7% | ████████░░ |
| 132 | `kucuk_anlar_relax` | meta | Küçük anlar (relax günleri) | 127 | 163 | 36 | 77.9% | ████████░░ |
