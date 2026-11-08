# İçerik sayımı (SAYIM)

> Otomatik üretilir: `pnpm --filter @motto/content-schema count` — elle düzenleme. Kaynak: `packages/content-schema/fixtures/**`, kotalar: `docs/content/taxonomy.json` (D-155, Σ kota = 10.000).

## Özet

| Ölçü | Değer |
|---|---:|
| Alan paketlerindeki geçerli olay | **3.036** / 10.000 (30.4%) |
| Kotası dolan alan | 0 / 132 |
| Kotayı aşan alan | 0 |
| Alan dışı: `core` | 6 |
| Alan dışı: `demo` | 42 |
| Genel toplam geçerli olay | **3.084** |
| Şema hatalı dosya | 0 |

## Grup bazında

| Grup | Alan | Sayı | Kota | % |
|---|---:|---:|---:|---:|
| egitim | 5 | 109 | 358 | 30.4% |
| is | 11 | 305 | 945 | 32.3% |
| kariyer | 24 | 343 | 1142 | 30% |
| para | 8 | 186 | 617 | 30.1% |
| ev | 8 | 187 | 618 | 30.3% |
| tanidik_yuzler | 8 | 246 | 814 | 30.2% |
| iliski | 7 | 202 | 670 | 30.1% |
| aile | 6 | 129 | 424 | 30.4% |
| cagrilar | 2 | 51 | 169 | 30.2% |
| ebeveynlik | 5 | 106 | 359 | 29.5% |
| sosyal | 8 | 163 | 539 | 30.2% |
| saglik | 9 | 216 | 716 | 30.2% |
| gundelik | 6 | 151 | 501 | 30.1% |
| ulasim | 3 | 69 | 234 | 29.5% |
| teknoloji | 3 | 81 | 268 | 30.2% |
| burokrasi | 3 | 82 | 273 | 30% |
| bos_zaman | 4 | 90 | 299 | 30.1% |
| mevsim | 2 | 50 | 163 | 30.7% |
| yaslilik | 6 | 128 | 422 | 30.3% |
| meta | 4 | 142 | 469 | 30.3% |

## Alan bazında

| # | Alan | Grup | Başlık | Sayı | Kota | Kalan | % | İlerleme |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `egitim_universite` | egitim | Üniversite hayatı | 43 | 143 | 100 | 30.1% | ███░░░░░░░ |
| 2 | `egitim_sinavlar` | egitim | Sınavlar ve sonuçlar | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 3 | `egitim_kurs_sertifika` | egitim | Kurslar ve sertifikalar | 18 | 59 | 41 | 30.5% | ███░░░░░░░ |
| 4 | `egitim_lisansustu` | egitim | Lisansüstü ve tez | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 5 | `askerlik_ogrenim_kredisi` | egitim | Askerlik (TR) / Öğrenim kredisi (EN) | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 6 | `is_arama` | is | İş arama ve mülakat | 45 | 150 | 105 | 30% | ███░░░░░░░ |
| 7 | `ilk_isler_yari_zamanli` | is | İlk işler, staj, yarı zamanlı | 52 | 104 | 52 | 50% | █████░░░░░ |
| 8 | `ofis_hayati` | is | Ofis hayatı ve toplantılar | 43 | 143 | 100 | 30.1% | ███░░░░░░░ |
| 9 | `is_yeri_politikasi` | is | İş yeri politikası ve iş arkadaşları | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 10 | `patron_nevin` | is | Nevin Hanım (patron) arkı | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 11 | `maas_terfi_zam` | is | Maaş, zam ve terfi | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 12 | `isten_cikis_issizlik` | is | İşten çıkış ve işsizlik | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 13 | `uzaktan_calisma` | is | Uzaktan ve hibrit çalışma | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 14 | `yan_gelir_girisim` | is | Yan gelir ve küçük girişimler | 18 | 59 | 41 | 30.5% | ███░░░░░░░ |
| 15 | `is_seyahati` | is | İş seyahati ve konferans | 8 | 26 | 18 | 30.8% | ███░░░░░░░ |
| 16 | `kariyer_degisimi` | is | Kariyer değişimi (orta yaş) | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 17 | `kariyer_waiter` | kariyer | Kariyer: Garson → Şef | 18 | 59 | 41 | 30.5% | ███░░░░░░░ |
| 18 | `kariyer_courier` | kariyer | Kariyer: Kurye | 18 | 59 | 41 | 30.5% | ███░░░░░░░ |
| 19 | `kariyer_boilertech` | kariyer | Kariyer: Kombi Ustası | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 20 | `kariyer_driver` | kariyer | Kariyer: Dolmuş Şoförü (TR) / Rideshare (EN) | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 21 | `kariyer_clerk` | kariyer | Kariyer: Memur | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 22 | `kariyer_nurse` | kariyer | Kariyer: Hemşire | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 23 | `kariyer_doctor` | kariyer | Kariyer: Doktor | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 24 | `kariyer_lawyer` | kariyer | Kariyer: Avukat | 15 | 49 | 34 | 30.6% | ███░░░░░░░ |
| 25 | `kariyer_dev` | kariyer | Kariyer: Yazılımcı | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 26 | `kariyer_teacher` | kariyer | Kariyer: Öğretmen | 17 | 55 | 38 | 30.9% | ███░░░░░░░ |
| 27 | `kariyer_academic` | kariyer | Kariyer: Akademisyen | 12 | 42 | 30 | 28.6% | ███░░░░░░░ |
| 28 | `kariyer_realtor` | kariyer | Kariyer: Emlakçı | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 29 | `kariyer_actor` | kariyer | Kariyer: Dizi Oyuncusu | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 30 | `kariyer_shopkeeper` | kariyer | Kariyer: Esnaf | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 31 | `kariyer_pilot` | kariyer | Kariyer: Pilot | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 32 | `kariyer_accountant` | kariyer | Kariyer: Muhasebeci | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 33 | `kariyer_lifecoach` | kariyer | Kariyer: Hayat Koçu (absürt) | 15 | 49 | 34 | 30.6% | ███░░░░░░░ |
| 34 | `kariyer_influencer` | kariyer | Kariyer: Influencer (absürt) | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 35 | `kariyer_crypto` | kariyer | Kariyer: Kripto Gurusu (absürt) | 12 | 42 | 30 | 28.6% | ███░░░░░░░ |
| 36 | `kariyer_fortune` | kariyer | Kariyer: Kahve Falcısı (TR) / Burç Yazarı (EN) | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 37 | `kariyer_weddingdj` | kariyer | Kariyer: Düğün DJ'i (absürt) | 12 | 42 | 30 | 28.6% | ███░░░░░░░ |
| 38 | `kariyer_hoa` | kariyer | Kariyer: Site Yöneticisi (absürt) | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 39 | `kariyer_doortodoor` | kariyer | Kariyer: Kapıdan Satış (absürt) | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 40 | `kariyer_developer` | kariyer | Kariyer: Müteahhit (absürt) | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 41 | `para_butce_ay_sonu` | para | Bütçe ve ay sonu | 39 | 130 | 91 | 30% | ███░░░░░░░ |
| 42 | `faturalar_abonelikler` | para | Faturalar ve abonelikler | 31 | 104 | 73 | 29.8% | ███░░░░░░░ |
| 43 | `borc_kredi_karti` | para | Borç, kredi kartı ve kredi | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 44 | `banka_atm` | para | Banka ve ATM | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 45 | `birikim_yatirim` | para | Birikim ve yatırım | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 46 | `vergi_sigorta` | para | Vergi ve sigorta | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 47 | `sans_ikramiye` | para | Şans ve beklenmedik paralar | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 48 | `dolandiricilik_kurban` | para | Dolandırıcılık (kurban olarak) | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 49 | `anne_evinde_yasam` | ev | Annenin evinde yaşamak | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 50 | `ev_arama_kiralama` | ev | Ev arama ve kiralama | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 51 | `ev_sahibi` | ev | Ev sahibi | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 52 | `komsu_sukran` | tanidik_yuzler | Şükran Teyze arkı | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 53 | `apartman_komsuluk` | ev | Apartman ve komşuluk | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 54 | `ev_arkadasi_baris` | tanidik_yuzler | Barış (ev arkadaşı) arkı | 31 | 104 | 73 | 29.8% | ███░░░░░░░ |
| 55 | `tasinma` | ev | Taşınma | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 56 | `ev_tamiri_ariza` | ev | Ev arızaları ve tamirat | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 57 | `ev_isleri` | ev | Ev işleri ve düzen | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 58 | `ev_satin_alma` | ev | Ev satın alma ve tapu | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 59 | `flort_tanisma` | iliski | Flört ve tanışma | 49 | 163 | 114 | 30.1% | ███░░░░░░░ |
| 60 | `ilk_ask_yagmur` | tanidik_yuzler | Yağmur (ilk aşk, eski sevgili) arkı | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 61 | `iliski_gunluk` | iliski | İlişkide gündelik hayat | 43 | 143 | 100 | 30.1% | ███░░░░░░░ |
| 62 | `ayrilik` | iliski | Ayrılık | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 63 | `nisan_teklif_dugun` | iliski | Evlilik teklifi, nişan, düğün | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 64 | `evlilik_gunluk` | iliski | Evli hayat | 39 | 130 | 91 | 30% | ███░░░░░░░ |
| 65 | `bosanma` | iliski | Boşanma | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 66 | `kayin_aile` | aile | Kayınvalide, kayınpeder, eşin ailesi | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 67 | `gec_ask_yalnizlik` | iliski | Bekâr hayat, geç aşk, yeniden başlamak | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 68 | `anne` | tanidik_yuzler | Anne arkı | 51 | 169 | 118 | 30.2% | ███░░░░░░░ |
| 69 | `cagri_anne` | cagrilar | ANNE ARIYOR (çağrı devralma) | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 70 | `cagri_diger` | cagrilar | Diğer çağrılar (Dayı, Nevin Hanım, Yağmur) | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 71 | `dayi` | tanidik_yuzler | Dayı arkı | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 72 | `kardesler` | aile | Kardeşler | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 73 | `akrabalar` | aile | Teyzeler, halalar, kuzenler | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 74 | `aile_grubu` | aile | Aile Grubu (mesajlaşma) | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 75 | `buyukanne_buyukbaba` | aile | Büyükanne ve büyükbaba | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 76 | `yaslanan_ebeveyn` | aile | Yaşlanan anneye bakım | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 77 | `bebek_yolda` | ebeveynlik | Bebek kararı ve bebek yolda | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 78 | `yeni_ebeveyn` | ebeveynlik | Yeni ebeveyn (bebeklik) | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 79 | `cocuk_buyutme` | ebeveynlik | Okul çağı ve ergen çocuk | 37 | 124 | 87 | 29.8% | ███░░░░░░░ |
| 80 | `bos_yuva` | ebeveynlik | Yetişkin çocuk ve boş yuva | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 81 | `torunlar` | ebeveynlik | Torunlar (büyükanne/büyükbaba olmak) | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 82 | `arkadaslar` | sosyal | Arkadaşlık | 43 | 143 | 100 | 30.1% | ███░░░░░░░ |
| 83 | `dugun_davetli` | sosyal | Düğünlerde misafir | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 84 | `cenaze_taziye` | sosyal | Cenaze ve taziye (misafir) | 14 | 45 | 31 | 31.1% | ███░░░░░░░ |
| 85 | `kutlamalar_dogum_gunu` | sosyal | Doğum günleri ve kutlamalar | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 86 | `gece_hayati_eglence` | sosyal | Gece hayatı ve dışarı çıkmak | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 87 | `yabancilar_sokak` | sosyal | Sokakta yabancılar | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 88 | `mahalle_esnaf` | sosyal | Mahalle esnafı | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 89 | `kucuk_rahatsizliklar` | saglik | Küçük rahatsızlıklar | 35 | 117 | 82 | 29.9% | ███░░░░░░░ |
| 90 | `doktor_hastane` | saglik | Doktor, check-up, diş, göz | 33 | 111 | 78 | 29.7% | ███░░░░░░░ |
| 91 | `uyku` | saglik | Uyku | 20 | 65 | 45 | 30.8% | ███░░░░░░░ |
| 92 | `spor_fitness` | saglik | Spor salonu ve egzersiz | 26 | 85 | 59 | 30.6% | ███░░░░░░░ |
| 93 | `kronik_saglik` | saglik | Kronik sağlık (adsız) | 18 | 58 | 40 | 31% | ███░░░░░░░ |
| 94 | `yaslanan_beden` | saglik | Yaşlanan beden | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 95 | `ruhsal_yuk_dusuk_keyif` | saglik | Ruhsal yük ve düşük Keyif günleri | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 96 | `stres_tukenmislik` | saglik | Stres ve tükenmişlik | 21 | 72 | 51 | 29.2% | ███░░░░░░░ |
| 97 | `aliskanliklar_birakma` | saglik | Sigara/alkol ve bırakma denemeleri | 12 | 39 | 27 | 30.8% | ███░░░░░░░ |
| 98 | `yemek_mutfak` | gundelik | Yemek ve mutfak | 31 | 104 | 73 | 29.8% | ███░░░░░░░ |
| 99 | `disarida_yemek_siparis` | gundelik | Dışarıda yemek ve sipariş | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 100 | `market_alisveris` | gundelik | Market ve alışveriş | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 101 | `alisveris_kiyafet_online` | gundelik | Kıyafet ve online alışveriş | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
| 102 | `kisisel_bakim_berber` | gundelik | Berber, kuaför ve kişisel bakım | 15 | 52 | 37 | 28.8% | ███░░░░░░░ |
| 103 | `gundelik_rutin` | gundelik | Sabahlar, rutin ve sıradan günler | 30 | 98 | 68 | 30.6% | ███░░░░░░░ |
| 104 | `toplu_tasima` | ulasim | Toplu taşıma ve işe gidiş | 27 | 91 | 64 | 29.7% | ███░░░░░░░ |
| 105 | `taksici` | tanidik_yuzler | Taksici arkı | 24 | 78 | 54 | 30.8% | ███░░░░░░░ |
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
