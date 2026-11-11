# İçerik sayımı (SAYIM)

> Otomatik üretilir: `pnpm --filter @motto/content-schema count` — elle düzenleme. Kaynak: `packages/content-schema/fixtures/**`, kotalar: `docs/content/taxonomy.json` (D-155, Σ kota = 10.000).

## Özet

| Ölçü | Değer |
|---|---:|
| Alan paketlerindeki geçerli olay | **5.018** / 10.000 (50.2%) |
| Kotası dolan alan | 0 / 132 |
| Kotayı aşan alan | 0 |
| Alan dışı: `core` | 6 |
| Alan dışı: `demo` | 42 |
| Genel toplam geçerli olay | **5.066** |
| Şema hatalı dosya | 0 |

## Grup bazında

| Grup | Alan | Sayı | Kota | % |
|---|---:|---:|---:|---:|
| egitim | 5 | 200 | 358 | 55.9% |
| is | 11 | 543 | 945 | 57.5% |
| kariyer | 24 | 631 | 1142 | 55.3% |
| para | 8 | 342 | 617 | 55.4% |
| ev | 8 | 343 | 618 | 55.5% |
| tanidik_yuzler | 8 | 407 | 814 | 50% |
| iliski | 7 | 371 | 670 | 55.4% |
| aile | 6 | 235 | 424 | 55.4% |
| cagrilar | 2 | 94 | 169 | 55.6% |
| ebeveynlik | 5 | 196 | 359 | 54.6% |
| sosyal | 8 | 288 | 539 | 53.4% |
| saglik | 9 | 425 | 716 | 59.4% |
| gundelik | 6 | 278 | 501 | 55.5% |
| ulasim | 3 | 92 | 234 | 39.3% |
| teknoloji | 3 | 81 | 268 | 30.2% |
| burokrasi | 3 | 82 | 273 | 30% |
| bos_zaman | 4 | 90 | 299 | 30.1% |
| mevsim | 2 | 50 | 163 | 30.7% |
| yaslilik | 6 | 128 | 422 | 30.3% |
| meta | 4 | 142 | 469 | 30.3% |

## Alan bazında

| # | Alan | Grup | Başlık | Sayı | Kota | Kalan | % | İlerleme |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `egitim_universite` | egitim | Üniversite hayatı | 79 | 143 | 64 | 55.2% | ██████░░░░ |
| 2 | `egitim_sinavlar` | egitim | Sınavlar ve sonuçlar | 44 | 78 | 34 | 56.4% | ██████░░░░ |
| 3 | `egitim_kurs_sertifika` | egitim | Kurslar ve sertifikalar | 33 | 59 | 26 | 55.9% | ██████░░░░ |
| 4 | `egitim_lisansustu` | egitim | Lisansüstü ve tez | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 5 | `askerlik_ogrenim_kredisi` | egitim | Askerlik (TR) / Öğrenim kredisi (EN) | 22 | 39 | 17 | 56.4% | ██████░░░░ |
| 6 | `is_arama` | is | İş arama ve mülakat | 83 | 150 | 67 | 55.3% | ██████░░░░ |
| 7 | `ilk_isler_yari_zamanli` | is | İlk işler, staj, yarı zamanlı | 78 | 104 | 26 | 75% | ████████░░ |
| 8 | `ofis_hayati` | is | Ofis hayatı ve toplantılar | 79 | 143 | 64 | 55.2% | ██████░░░░ |
| 9 | `is_yeri_politikasi` | is | İş yeri politikası ve iş arkadaşları | 61 | 111 | 50 | 55% | █████░░░░░ |
| 10 | `patron_nevin` | is | Nevin Hanım (patron) arkı | 55 | 98 | 43 | 56.1% | ██████░░░░ |
| 11 | `maas_terfi_zam` | is | Maaş, zam ve terfi | 47 | 85 | 38 | 55.3% | ██████░░░░ |
| 12 | `isten_cikis_issizlik` | is | İşten çıkış ve işsizlik | 39 | 72 | 33 | 54.2% | █████░░░░░ |
| 13 | `uzaktan_calisma` | is | Uzaktan ve hibrit çalışma | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 14 | `yan_gelir_girisim` | is | Yan gelir ve küçük girişimler | 33 | 59 | 26 | 55.9% | ██████░░░░ |
| 15 | `is_seyahati` | is | İş seyahati ve konferans | 15 | 26 | 11 | 57.7% | ██████░░░░ |
| 16 | `kariyer_degisimi` | is | Kariyer değişimi (orta yaş) | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 17 | `kariyer_waiter` | kariyer | Kariyer: Garson → Şef | 33 | 59 | 26 | 55.9% | ██████░░░░ |
| 18 | `kariyer_courier` | kariyer | Kariyer: Kurye | 33 | 59 | 26 | 55.9% | ██████░░░░ |
| 19 | `kariyer_boilertech` | kariyer | Kariyer: Kombi Ustası | 25 | 45 | 20 | 55.6% | ██████░░░░ |
| 20 | `kariyer_driver` | kariyer | Kariyer: Dolmuş Şoförü (TR) / Rideshare (EN) | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 21 | `kariyer_clerk` | kariyer | Kariyer: Memur | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 22 | `kariyer_nurse` | kariyer | Kariyer: Hemşire | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 23 | `kariyer_doctor` | kariyer | Kariyer: Doktor | 28 | 52 | 24 | 53.8% | █████░░░░░ |
| 24 | `kariyer_lawyer` | kariyer | Kariyer: Avukat | 27 | 49 | 22 | 55.1% | ██████░░░░ |
| 25 | `kariyer_dev` | kariyer | Kariyer: Yazılımcı | 33 | 58 | 25 | 56.9% | ██████░░░░ |
| 26 | `kariyer_teacher` | kariyer | Kariyer: Öğretmen | 31 | 55 | 24 | 56.4% | ██████░░░░ |
| 27 | `kariyer_academic` | kariyer | Kariyer: Akademisyen | 23 | 42 | 19 | 54.8% | █████░░░░░ |
| 28 | `kariyer_realtor` | kariyer | Kariyer: Emlakçı | 25 | 45 | 20 | 55.6% | ██████░░░░ |
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
| 106 | `araba_sahipligi` | ulasim | Araba sahipliği | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 107 | `trafik_cezalar` | ulasim | Trafik ve cezalar | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 108 | `telefon_teknoloji` | teknoloji | Telefon ve teknoloji | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 109 | `sosyal_medya` | teknoloji | Sosyal medya | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 110 | `dijital_eglence` | teknoloji | Dizi, oyun ve ekran keyfi | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 111 | `burokrasi_resmi_daire` | burokrasi | Bürokrasi ve resmî daireler (kurgusal) | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 112 | `evrak_mektuplar` | burokrasi | Evrak kartları ve resmî mektuplar | 31 | 104 | 73 | 29.8% | ███░░░░░░░ |
| 113 | `hukuki_sorunlar` | burokrasi | Küçük hukuki dertler (kurgusal) | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 114 | `hobiler` | bos_zaman | Hobiler (el işi, müzik, kitap, bahçe) | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 115 | `spor_amator_izleme` | bos_zaman | Amatör spor ve maç izlemek | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 116 | `seyahat_tatil` | bos_zaman | Seyahat ve tatil | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 117 | `evcil_pamuk` | tanidik_yuzler | Pamuk (kedi) arkı | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 118 | `diger_evcil_hayvanlar` | bos_zaman | Diğer evcil hayvanlar | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 119 | `gonulluluk_iyilik` | sosyal | Gönüllülük ve küçük iyilikler | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 120 | `mevsimler_hava` | mevsim | Mevsimler ve hava durumu | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 121 | `bayram_ozel_gunler` | mevsim | Bayramlar, yılbaşı ve özel günler (genel) | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 122 | `orta_yas` | yaslilik | Orta yaş | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 123 | `emeklilik_gecis` | yaslilik | Emekliliğe geçiş | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 124 | `emekli_hayati` | yaslilik | Emekli hayatı | 31 | 104 | 73 | 29.8% | ███░░░░░░░ |
| 125 | `yaslilik_gundelik` | yaslilik | Yaşlılık ve gündelik hayat | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 126 | `miras_vasiyet` | yaslilik | Miras, vasiyet ve düzen | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 127 | `veda_kayip` | yaslilik | Vedalar ve kayıplar (sessizlik protokolü) | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 128 | `tanidik_yuzler_kesisme` | tanidik_yuzler | Tanıdık Yüzler kesişme günleri | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 129 | `tek_hedef_anlari` | meta | Tek Hedef anları | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 130 | `efsane_nadir` | meta | Efsane nadir günler | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 131 | `absurt_kuyruk` | meta | Kara mizah: absürt kuyruk | 39 | 130 | 91 | 30% | ███░░░░░░░ |
| 132 | `kucuk_anlar_relax` | meta | Küçük anlar (relax günleri) | 49 | 163 | 114 | 30.1% | ███░░░░░░░ |
