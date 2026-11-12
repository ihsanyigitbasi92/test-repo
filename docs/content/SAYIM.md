# İçerik sayımı (SAYIM)

> Otomatik üretilir: `pnpm --filter @motto/content-schema count` — elle düzenleme. Kaynak: `packages/content-schema/fixtures/**`, kotalar: `docs/content/taxonomy.json` (D-155, Σ kota = 10.000).

## Özet

| Ölçü | Değer |
|---|---:|
| Alan paketlerindeki geçerli olay | **6.048** / 10.000 (60.5%) |
| Kotası dolan alan | 1 / 132 |
| Kotayı aşan alan | 0 |
| Alan dışı: `core` | 6 |
| Alan dışı: `demo` | 42 |
| Genel toplam geçerli olay | **6.096** |
| Şema hatalı dosya | 0 |

## Grup bazında

| Grup | Alan | Sayı | Kota | % |
|---|---:|---:|---:|---:|
| egitim | 5 | 280 | 358 | 78.2% |
| is | 11 | 751 | 945 | 79.5% |
| kariyer | 24 | 768 | 1142 | 67.3% |
| para | 8 | 342 | 617 | 55.4% |
| ev | 8 | 343 | 618 | 55.5% |
| tanidik_yuzler | 8 | 451 | 814 | 55.4% |
| iliski | 7 | 371 | 670 | 55.4% |
| aile | 6 | 235 | 424 | 55.4% |
| cagrilar | 2 | 94 | 169 | 55.6% |
| ebeveynlik | 5 | 196 | 359 | 54.6% |
| sosyal | 8 | 298 | 539 | 55.3% |
| saglik | 9 | 425 | 716 | 59.4% |
| gundelik | 6 | 278 | 501 | 55.5% |
| ulasim | 3 | 164 | 234 | 70.1% |
| teknoloji | 3 | 149 | 268 | 55.6% |
| burokrasi | 3 | 151 | 273 | 55.3% |
| bos_zaman | 4 | 166 | 299 | 55.5% |
| mevsim | 2 | 91 | 163 | 55.8% |
| yaslilik | 6 | 234 | 422 | 55.5% |
| meta | 4 | 261 | 469 | 55.7% |

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
| 26 | `kariyer_teacher` | kariyer | Kariyer: Öğretmen | 43 | 55 | 12 | 78.2% | ████████░░ |
| 27 | `kariyer_academic` | kariyer | Kariyer: Akademisyen | 33 | 42 | 9 | 78.6% | ████████░░ |
| 28 | `kariyer_realtor` | kariyer | Kariyer: Emlakçı | 32 | 45 | 13 | 71.1% | ███████░░░ |
| 29 | `kariyer_actor` | kariyer | Kariyer: Dizi Oyuncusu | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 30 | `kariyer_shopkeeper` | kariyer | Kariyer: Esnaf | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 31 | `kariyer_pilot` | kariyer | Kariyer: Pilot | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 32 | `kariyer_accountant` | kariyer | Kariyer: Muhasebeci | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 33 | `kariyer_lifecoach` | kariyer | Kariyer: Hayat Koçu (absürt) | 27 | 49 | 22 | 55.1% | ██████░░░░ |
| 34 | `kariyer_influencer` | kariyer | Kariyer: Influencer (absürt) | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 35 | `kariyer_crypto` | kariyer | Kariyer: Kripto Gurusu (absürt) | 23 | 42 | 19 | 54.8% | █████░░░░░ |
| 36 | `kariyer_fortune` | kariyer | Kariyer: Kahve Falcısı (TR) / Burç Yazarı (EN) | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 37 | `kariyer_weddingdj` | kariyer | Kariyer: Düğün DJ'i (absürt) | 23 | 42 | 19 | 54.8% | █████░░░░░ |
| 38 | `kariyer_hoa` | kariyer | Kariyer: Site Yöneticisi (absürt) | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 39 | `kariyer_doortodoor` | kariyer | Kariyer: Kapıdan Satış (absürt) | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 40 | `kariyer_developer` | kariyer | Kariyer: Müteahhit (absürt) | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 41 | `para_butce_ay_sonu` | para | Bütçe ve ay sonu | 72 | 130 | 58 | 55.4% | ██████░░░░ |
| 42 | `faturalar_abonelikler` | para | Faturalar ve abonelikler | 57 | 104 | 47 | 54.8% | █████░░░░░ |
| 43 | `borc_kredi_karti` | para | Borç, kredi kartı ve kredi | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 44 | `banka_atm` | para | Banka ve ATM | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 45 | `birikim_yatirim` | para | Birikim ve yatırım | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 46 | `vergi_sigorta` | para | Vergi ve sigorta | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 47 | `sans_ikramiye` | para | Şans ve beklenmedik paralar | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 48 | `dolandiricilik_kurban` | para | Dolandırıcılık (kurban olarak) | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 49 | `anne_evinde_yasam` | ev | Annenin evinde yaşamak | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 50 | `ev_arama_kiralama` | ev | Ev arama ve kiralama | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 51 | `ev_sahibi` | ev | Ev sahibi | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 52 | `komsu_sukran` | tanidik_yuzler | Şükran Teyze arkı | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 53 | `apartman_komsuluk` | ev | Apartman ve komşuluk | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 54 | `ev_arkadasi_baris` | tanidik_yuzler | Barış (ev arkadaşı) arkı | 57 | 104 | 47 | 54.8% | █████░░░░░ |
| 55 | `tasinma` | ev | Taşınma | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 56 | `ev_tamiri_ariza` | ev | Ev arızaları ve tamirat | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 57 | `ev_isleri` | ev | Ev işleri ve düzen | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 58 | `ev_satin_alma` | ev | Ev satın alma ve tapu | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 59 | `flort_tanisma` | iliski | Flört ve tanışma | 90 | 163 | 73 | 55.2% | ██████░░░░ |
| 60 | `ilk_ask_yagmur` | tanidik_yuzler | Yağmur (ilk aşk, eski sevgili) arkı | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 61 | `iliski_gunluk` | iliski | İlişkide gündelik hayat | 79 | 143 | 64 | 55.2% | ██████░░░░ |
| 62 | `ayrilik` | iliski | Ayrılık | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 63 | `nisan_teklif_dugun` | iliski | Evlilik teklifi, nişan, düğün | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 64 | `evlilik_gunluk` | iliski | Evli hayat | 72 | 130 | 58 | 55.4% | ██████░░░░ |
| 65 | `bosanma` | iliski | Boşanma | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 66 | `kayin_aile` | aile | Kayınvalide, kayınpeder, eşin ailesi | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 67 | `gec_ask_yalnizlik` | iliski | Bekâr hayat, geç aşk, yeniden başlamak | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 68 | `anne` | tanidik_yuzler | Anne arkı | 93 | 169 | 76 | 55% | ██████░░░░ |
| 69 | `cagri_anne` | cagrilar | ANNE ARIYOR (çağrı devralma) | 61 | 111 | 50 | 55% | █████░░░░░ |
| 70 | `cagri_diger` | cagrilar | Diğer çağrılar (Dayı, Nevin Hanım, Yağmur) | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 71 | `dayi` | tanidik_yuzler | Dayı arkı | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 72 | `kardesler` | aile | Kardeşler | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 73 | `akrabalar` | aile | Teyzeler, halalar, kuzenler | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 74 | `aile_grubu` | aile | Aile Grubu (mesajlaşma) | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 75 | `buyukanne_buyukbaba` | aile | Büyükanne ve büyükbaba | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 76 | `yaslanan_ebeveyn` | aile | Yaşlanan anneye bakım | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 77 | `bebek_yolda` | ebeveynlik | Bebek kararı ve bebek yolda | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 78 | `yeni_ebeveyn` | ebeveynlik | Yeni ebeveyn (bebeklik) | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 79 | `cocuk_buyutme` | ebeveynlik | Okul çağı ve ergen çocuk | 68 | 124 | 56 | 54.8% | █████░░░░░ |
| 80 | `bos_yuva` | ebeveynlik | Yetişkin çocuk ve boş yuva | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 81 | `torunlar` | ebeveynlik | Torunlar (büyükanne/büyükbaba olmak) | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 82 | `arkadaslar` | sosyal | Arkadaşlık | 79 | 143 | 64 | 55.2% | ██████░░░░ |
| 83 | `dugun_davetli` | sosyal | Düğünlerde misafir | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 84 | `cenaze_taziye` | sosyal | Cenaze ve taziye (misafir) | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 85 | `kutlamalar_dogum_gunu` | sosyal | Doğum günleri ve kutlamalar | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 86 | `gece_hayati_eglence` | sosyal | Gece hayatı ve dışarı çıkmak | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 87 | `yabancilar_sokak` | sosyal | Sokakta yabancılar | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 88 | `mahalle_esnaf` | sosyal | Mahalle esnafı | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 89 | `kucuk_rahatsizliklar` | saglik | Küçük rahatsızlıklar | 93 | 117 | 24 | 79.5% | ████████░░ |
| 90 | `doktor_hastane` | saglik | Doktor, check-up, diş, göz | 61 | 111 | 50 | 55% | █████░░░░░ |
| 91 | `uyku` | saglik | Uyku | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 92 | `spor_fitness` | saglik | Spor salonu ve egzersiz | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 93 | `kronik_saglik` | saglik | Kronik sağlık (adsız) | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 94 | `yaslanan_beden` | saglik | Yaşlanan beden | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 95 | `ruhsal_yuk_dusuk_keyif` | saglik | Ruhsal yük ve düşük Keyif günleri | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 96 | `stres_tukenmislik` | saglik | Stres ve tükenmişlik | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 97 | `aliskanliklar_birakma` | saglik | Sigara/alkol ve bırakma denemeleri | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 98 | `yemek_mutfak` | gundelik | Yemek ve mutfak | 57 | 104 | 47 | 54.8% | █████░░░░░ |
| 99 | `disarida_yemek_siparis` | gundelik | Dışarıda yemek ve sipariş | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 100 | `market_alisveris` | gundelik | Market ve alışveriş | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 101 | `alisveris_kiyafet_online` | gundelik | Kıyafet ve online alışveriş | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 102 | `kisisel_bakim_berber` | gundelik | Berber, kuaför ve kişisel bakım | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 103 | `gundelik_rutin` | gundelik | Sabahlar, rutin ve sıradan günler | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 104 | `toplu_tasima` | ulasim | Toplu taşıma ve işe gidiş | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 105 | `taksici` | tanidik_yuzler | Taksici arkı | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 106 | `araba_sahipligi` | ulasim | Araba sahipliği | 73 | 91 | 18 | 80.2% | ████████░░ |
| 107 | `trafik_cezalar` | ulasim | Trafik ve cezalar | 41 | 52 | 11 | 78.8% | ████████░░ |
| 108 | `telefon_teknoloji` | teknoloji | Telefon ve teknoloji | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 109 | `sosyal_medya` | teknoloji | Sosyal medya | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 110 | `dijital_eglence` | teknoloji | Dizi, oyun ve ekran keyfi | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 111 | `burokrasi_resmi_daire` | burokrasi | Bürokrasi ve resmî daireler (kurgusal) | 61 | 111 | 50 | 55% | █████░░░░░ |
| 112 | `evrak_mektuplar` | burokrasi | Evrak kartları ve resmî mektuplar | 57 | 104 | 47 | 54.8% | █████░░░░░ |
| 113 | `hukuki_sorunlar` | burokrasi | Küçük hukuki dertler (kurgusal) | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 114 | `hobiler` | bos_zaman | Hobiler (el işi, müzik, kitap, bahçe) | 61 | 111 | 50 | 55% | █████░░░░░ |
| 115 | `spor_amator_izleme` | bos_zaman | Amatör spor ve maç izlemek | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 116 | `seyahat_tatil` | bos_zaman | Seyahat ve tatil | 50 | 91 | 41 | 54.9% | █████░░░░░ |
| 117 | `evcil_pamuk` | tanidik_yuzler | Pamuk (kedi) arkı | 61 | 111 | 50 | 55% | █████░░░░░ |
| 118 | `diger_evcil_hayvanlar` | bos_zaman | Diğer evcil hayvanlar | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 119 | `gonulluluk_iyilik` | sosyal | Gönüllülük ve küçük iyilikler | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 120 | `mevsimler_hava` | mevsim | Mevsimler ve hava durumu | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 121 | `bayram_ozel_gunler` | mevsim | Bayramlar, yılbaşı ve özel günler (genel) | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 122 | `orta_yas` | yaslilik | Orta yaş | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 123 | `emeklilik_gecis` | yaslilik | Emekliliğe geçiş | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 124 | `emekli_hayati` | yaslilik | Emekli hayatı | 57 | 104 | 47 | 54.8% | █████░░░░░ |
| 125 | `yaslilik_gundelik` | yaslilik | Yaşlılık ve gündelik hayat | 61 | 111 | 50 | 55% | █████░░░░░ |
| 126 | `miras_vasiyet` | yaslilik | Miras, vasiyet ve düzen | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 127 | `veda_kayip` | yaslilik | Vedalar ve kayıplar (sessizlik protokolü) | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 128 | `tanidik_yuzler_kesisme` | tanidik_yuzler | Tanıdık Yüzler kesişme günleri | 36 | 65 | 29 | 55.4% | ██████░░░░ |
| 129 | `tek_hedef_anlari` | meta | Tek Hedef anları | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 130 | `efsane_nadir` | meta | Efsane nadir günler | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 131 | `absurt_kuyruk` | meta | Kara mizah: absürt kuyruk | 72 | 130 | 58 | 55.4% | ██████░░░░ |
| 132 | `kucuk_anlar_relax` | meta | Küçük anlar (relax günleri) | 90 | 163 | 73 | 55.2% | ██████░░░░ |
