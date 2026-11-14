# İçerik sayımı (SAYIM)

> Otomatik üretilir: `pnpm --filter @motto/content-schema count` — elle düzenleme. Kaynak: `packages/content-schema/fixtures/**`, kotalar: `docs/content/taxonomy.json` (D-155, Σ kota = 10.000).

## Özet

| Ölçü | Değer |
|---|---:|
| Alan paketlerindeki geçerli olay | **10.137** / 10.000 (101.4%) |
| Kotası dolan alan | 129 / 132 |
| Kotayı aşan alan | 24 |
| Alan dışı: `core` | 6 |
| Alan dışı: `demo` | 42 |
| Genel toplam geçerli olay | **10.185** |
| Şema hatalı dosya | 0 |

## Grup bazında

| Grup | Alan | Sayı | Kota | % |
|---|---:|---:|---:|---:|
| egitim | 5 | 358 | 358 | 100% |
| is | 11 | 945 | 945 | 100% |
| kariyer | 24 | 1175 | 1142 | 102.9% |
| para | 8 | 625 | 617 | 101.3% |
| ev | 8 | 623 | 618 | 100.8% |
| tanidik_yuzler | 8 | 818 | 814 | 100.5% |
| iliski | 7 | 697 | 670 | 104% |
| aile | 6 | 435 | 424 | 102.6% |
| cagrilar | 2 | 169 | 169 | 100% |
| ebeveynlik | 5 | 402 | 359 | 112% |
| sosyal | 8 | 539 | 539 | 100% |
| saglik | 9 | 738 | 716 | 103.1% |
| gundelik | 6 | 501 | 501 | 100% |
| ulasim | 3 | 236 | 234 | 100.9% |
| teknoloji | 3 | 268 | 268 | 100% |
| burokrasi | 3 | 273 | 273 | 100% |
| bos_zaman | 4 | 299 | 299 | 100% |
| mevsim | 2 | 163 | 163 | 100% |
| yaslilik | 6 | 490 | 422 | 116.1% |
| meta | 4 | 383 | 469 | 81.7% |

## Alan bazında

| # | Alan | Grup | Başlık | Sayı | Kota | Kalan | % | İlerleme |
|---:|---|---|---|---:|---:|---:|---:|---|
| 1 | `egitim_universite` | egitim | Üniversite hayatı | 143 | 143 | 0 | 100% | ██████████ |
| 2 | `egitim_sinavlar` | egitim | Sınavlar ve sonuçlar | 78 | 78 | 0 | 100% | ██████████ |
| 3 | `egitim_kurs_sertifika` | egitim | Kurslar ve sertifikalar | 59 | 59 | 0 | 100% | ██████████ |
| 4 | `egitim_lisansustu` | egitim | Lisansüstü ve tez | 39 | 39 | 0 | 100% | ██████████ |
| 5 | `askerlik_ogrenim_kredisi` | egitim | Askerlik (TR) / Öğrenim kredisi (EN) | 39 | 39 | 0 | 100% | ██████████ |
| 6 | `is_arama` | is | İş arama ve mülakat | 150 | 150 | 0 | 100% | ██████████ |
| 7 | `ilk_isler_yari_zamanli` | is | İlk işler, staj, yarı zamanlı | 104 | 104 | 0 | 100% | ██████████ |
| 8 | `ofis_hayati` | is | Ofis hayatı ve toplantılar | 143 | 143 | 0 | 100% | ██████████ |
| 9 | `is_yeri_politikasi` | is | İş yeri politikası ve iş arkadaşları | 111 | 111 | 0 | 100% | ██████████ |
| 10 | `patron_nevin` | is | Nevin Hanım (patron) arkı | 98 | 98 | 0 | 100% | ██████████ |
| 11 | `maas_terfi_zam` | is | Maaş, zam ve terfi | 85 | 85 | 0 | 100% | ██████████ |
| 12 | `isten_cikis_issizlik` | is | İşten çıkış ve işsizlik | 72 | 72 | 0 | 100% | ██████████ |
| 13 | `uzaktan_calisma` | is | Uzaktan ve hibrit çalışma | 52 | 52 | 0 | 100% | ██████████ |
| 14 | `yan_gelir_girisim` | is | Yan gelir ve küçük girişimler | 59 | 59 | 0 | 100% | ██████████ |
| 15 | `is_seyahati` | is | İş seyahati ve konferans | 26 | 26 | 0 | 100% | ██████████ |
| 16 | `kariyer_degisimi` | is | Kariyer değişimi (orta yaş) | 45 | 45 | 0 | 100% | ██████████ |
| 17 | `kariyer_waiter` | kariyer | Kariyer: Garson → Şef | 59 | 59 | 0 | 100% | ██████████ |
| 18 | `kariyer_courier` | kariyer | Kariyer: Kurye | 59 | 59 | 0 | 100% | ██████████ |
| 19 | `kariyer_boilertech` | kariyer | Kariyer: Kombi Ustası | 45 | 45 | 0 | 100% | ██████████ |
| 20 | `kariyer_driver` | kariyer | Kariyer: Dolmuş Şoförü (TR) / Rideshare (EN) | 52 | 52 | 0 | 100% | ██████████ |
| 21 | `kariyer_clerk` | kariyer | Kariyer: Memur | 52 | 52 | 0 | 100% | ██████████ |
| 22 | `kariyer_nurse` | kariyer | Kariyer: Hemşire | 52 | 52 | 0 | 100% | ██████████ |
| 23 | `kariyer_doctor` | kariyer | Kariyer: Doktor | 52 | 52 | 0 | 100% | ██████████ |
| 24 | `kariyer_lawyer` | kariyer | Kariyer: Avukat | 49 | 49 | 0 | 100% | ██████████ |
| 25 | `kariyer_dev` | kariyer | Kariyer: Yazılımcı | 58 | 58 | 0 | 100% | ██████████ |
| 26 | `kariyer_teacher` | kariyer | Kariyer: Öğretmen | 55 | 55 | 0 | 100% | ██████████ |
| 27 | `kariyer_academic` | kariyer | Kariyer: Akademisyen | 43 | 42 | 0 | 102.4% | ██████████ |
| 28 | `kariyer_realtor` | kariyer | Kariyer: Emlakçı | 45 | 45 | 0 | 100% | ██████████ |
| 29 | `kariyer_actor` | kariyer | Kariyer: Dizi Oyuncusu | 45 | 45 | 0 | 100% | ██████████ |
| 30 | `kariyer_shopkeeper` | kariyer | Kariyer: Esnaf | 52 | 52 | 0 | 100% | ██████████ |
| 31 | `kariyer_pilot` | kariyer | Kariyer: Pilot | 39 | 39 | 0 | 100% | ██████████ |
| 32 | `kariyer_accountant` | kariyer | Kariyer: Muhasebeci | 45 | 45 | 0 | 100% | ██████████ |
| 33 | `kariyer_lifecoach` | kariyer | Kariyer: Hayat Koçu (absürt) | 60 | 49 | 0 | 122.4% | ██████████ |
| 34 | `kariyer_influencer` | kariyer | Kariyer: Influencer (absürt) | 64 | 52 | 0 | 123.1% | ██████████ |
| 35 | `kariyer_crypto` | kariyer | Kariyer: Kripto Gurusu (absürt) | 51 | 42 | 0 | 121.4% | ██████████ |
| 36 | `kariyer_fortune` | kariyer | Kariyer: Kahve Falcısı (TR) / Burç Yazarı (EN) | 39 | 39 | 0 | 100% | ██████████ |
| 37 | `kariyer_weddingdj` | kariyer | Kariyer: Düğün DJ'i (absürt) | 42 | 42 | 0 | 100% | ██████████ |
| 38 | `kariyer_hoa` | kariyer | Kariyer: Site Yöneticisi (absürt) | 39 | 39 | 0 | 100% | ██████████ |
| 39 | `kariyer_doortodoor` | kariyer | Kariyer: Kapıdan Satış (absürt) | 39 | 39 | 0 | 100% | ██████████ |
| 40 | `kariyer_developer` | kariyer | Kariyer: Müteahhit (absürt) | 39 | 39 | 0 | 100% | ██████████ |
| 41 | `para_butce_ay_sonu` | para | Bütçe ve ay sonu | 130 | 130 | 0 | 100% | ██████████ |
| 42 | `faturalar_abonelikler` | para | Faturalar ve abonelikler | 104 | 104 | 0 | 100% | ██████████ |
| 43 | `borc_kredi_karti` | para | Borç, kredi kartı ve kredi | 98 | 98 | 0 | 100% | ██████████ |
| 44 | `banka_atm` | para | Banka ve ATM | 58 | 58 | 0 | 100% | ██████████ |
| 45 | `birikim_yatirim` | para | Birikim ve yatırım | 66 | 58 | 0 | 113.8% | ██████████ |
| 46 | `vergi_sigorta` | para | Vergi ve sigorta | 45 | 45 | 0 | 100% | ██████████ |
| 47 | `sans_ikramiye` | para | Şans ve beklenmedik paralar | 52 | 52 | 0 | 100% | ██████████ |
| 48 | `dolandiricilik_kurban` | para | Dolandırıcılık (kurban olarak) | 72 | 72 | 0 | 100% | ██████████ |
| 49 | `anne_evinde_yasam` | ev | Annenin evinde yaşamak | 85 | 85 | 0 | 100% | ██████████ |
| 50 | `ev_arama_kiralama` | ev | Ev arama ve kiralama | 78 | 78 | 0 | 100% | ██████████ |
| 51 | `ev_sahibi` | ev | Ev sahibi | 91 | 91 | 0 | 100% | ██████████ |
| 52 | `komsu_sukran` | tanidik_yuzler | Şükran Teyze arkı | 91 | 91 | 0 | 100% | ██████████ |
| 53 | `apartman_komsuluk` | ev | Apartman ve komşuluk | 98 | 98 | 0 | 100% | ██████████ |
| 54 | `ev_arkadasi_baris` | tanidik_yuzler | Barış (ev arkadaşı) arkı | 104 | 104 | 0 | 100% | ██████████ |
| 55 | `tasinma` | ev | Taşınma | 58 | 58 | 0 | 100% | ██████████ |
| 56 | `ev_tamiri_ariza` | ev | Ev arızaları ve tamirat | 91 | 91 | 0 | 100% | ██████████ |
| 57 | `ev_isleri` | ev | Ev işleri ve düzen | 72 | 72 | 0 | 100% | ██████████ |
| 58 | `ev_satin_alma` | ev | Ev satın alma ve tapu | 50 | 45 | 0 | 111.1% | ██████████ |
| 59 | `flort_tanisma` | iliski | Flört ve tanışma | 169 | 163 | 0 | 103.7% | ██████████ |
| 60 | `ilk_ask_yagmur` | tanidik_yuzler | Yağmur (ilk aşk, eski sevgili) arkı | 101 | 98 | 0 | 103.1% | ██████████ |
| 61 | `iliski_gunluk` | iliski | İlişkide gündelik hayat | 143 | 143 | 0 | 100% | ██████████ |
| 62 | `ayrilik` | iliski | Ayrılık | 58 | 58 | 0 | 100% | ██████████ |
| 63 | `nisan_teklif_dugun` | iliski | Evlilik teklifi, nişan, düğün | 90 | 72 | 0 | 125% | ██████████ |
| 64 | `evlilik_gunluk` | iliski | Evli hayat | 130 | 130 | 0 | 100% | ██████████ |
| 65 | `bosanma` | iliski | Boşanma | 39 | 39 | 0 | 100% | ██████████ |
| 66 | `kayin_aile` | aile | Kayınvalide, kayınpeder, eşin ailesi | 65 | 65 | 0 | 100% | ██████████ |
| 67 | `gec_ask_yalnizlik` | iliski | Bekâr hayat, geç aşk, yeniden başlamak | 68 | 65 | 0 | 104.6% | ██████████ |
| 68 | `anne` | tanidik_yuzler | Anne arkı | 169 | 169 | 0 | 100% | ██████████ |
| 69 | `cagri_anne` | cagrilar | ANNE ARIYOR (çağrı devralma) | 111 | 111 | 0 | 100% | ██████████ |
| 70 | `cagri_diger` | cagrilar | Diğer çağrılar (Dayı, Nevin Hanım, Yağmur) | 58 | 58 | 0 | 100% | ██████████ |
| 71 | `dayi` | tanidik_yuzler | Dayı arkı | 98 | 98 | 0 | 100% | ██████████ |
| 72 | `kardesler` | aile | Kardeşler | 81 | 78 | 0 | 103.8% | ██████████ |
| 73 | `akrabalar` | aile | Teyzeler, halalar, kuzenler | 88 | 85 | 0 | 103.5% | ██████████ |
| 74 | `aile_grubu` | aile | Aile Grubu (mesajlaşma) | 85 | 85 | 0 | 100% | ██████████ |
| 75 | `buyukanne_buyukbaba` | aile | Büyükanne ve büyükbaba | 39 | 39 | 0 | 100% | ██████████ |
| 76 | `yaslanan_ebeveyn` | aile | Yaşlanan anneye bakım | 77 | 72 | 0 | 106.9% | ██████████ |
| 77 | `bebek_yolda` | ebeveynlik | Bebek kararı ve bebek yolda | 59 | 39 | 0 | 151.3% | ██████████ |
| 78 | `yeni_ebeveyn` | ebeveynlik | Yeni ebeveyn (bebeklik) | 72 | 72 | 0 | 100% | ██████████ |
| 79 | `cocuk_buyutme` | ebeveynlik | Okul çağı ve ergen çocuk | 131 | 124 | 0 | 105.6% | ██████████ |
| 80 | `bos_yuva` | ebeveynlik | Yetişkin çocuk ve boş yuva | 52 | 52 | 0 | 100% | ██████████ |
| 81 | `torunlar` | ebeveynlik | Torunlar (büyükanne/büyükbaba olmak) | 88 | 72 | 0 | 122.2% | ██████████ |
| 82 | `arkadaslar` | sosyal | Arkadaşlık | 143 | 143 | 0 | 100% | ██████████ |
| 83 | `dugun_davetli` | sosyal | Düğünlerde misafir | 65 | 65 | 0 | 100% | ██████████ |
| 84 | `cenaze_taziye` | sosyal | Cenaze ve taziye (misafir) | 45 | 45 | 0 | 100% | ██████████ |
| 85 | `kutlamalar_dogum_gunu` | sosyal | Doğum günleri ve kutlamalar | 58 | 58 | 0 | 100% | ██████████ |
| 86 | `gece_hayati_eglence` | sosyal | Gece hayatı ve dışarı çıkmak | 72 | 72 | 0 | 100% | ██████████ |
| 87 | `yabancilar_sokak` | sosyal | Sokakta yabancılar | 65 | 65 | 0 | 100% | ██████████ |
| 88 | `mahalle_esnaf` | sosyal | Mahalle esnafı | 52 | 52 | 0 | 100% | ██████████ |
| 89 | `kucuk_rahatsizliklar` | saglik | Küçük rahatsızlıklar | 117 | 117 | 0 | 100% | ██████████ |
| 90 | `doktor_hastane` | saglik | Doktor, check-up, diş, göz | 121 | 111 | 0 | 109% | ██████████ |
| 91 | `uyku` | saglik | Uyku | 65 | 65 | 0 | 100% | ██████████ |
| 92 | `spor_fitness` | saglik | Spor salonu ve egzersiz | 85 | 85 | 0 | 100% | ██████████ |
| 93 | `kronik_saglik` | saglik | Kronik sağlık (adsız) | 70 | 58 | 0 | 120.7% | ██████████ |
| 94 | `yaslanan_beden` | saglik | Yaşlanan beden | 78 | 78 | 0 | 100% | ██████████ |
| 95 | `ruhsal_yuk_dusuk_keyif` | saglik | Ruhsal yük ve düşük Keyif günleri | 91 | 91 | 0 | 100% | ██████████ |
| 96 | `stres_tukenmislik` | saglik | Stres ve tükenmişlik | 72 | 72 | 0 | 100% | ██████████ |
| 97 | `aliskanliklar_birakma` | saglik | Sigara/alkol ve bırakma denemeleri | 39 | 39 | 0 | 100% | ██████████ |
| 98 | `yemek_mutfak` | gundelik | Yemek ve mutfak | 104 | 104 | 0 | 100% | ██████████ |
| 99 | `disarida_yemek_siparis` | gundelik | Dışarıda yemek ve sipariş | 78 | 78 | 0 | 100% | ██████████ |
| 100 | `market_alisveris` | gundelik | Market ve alışveriş | 91 | 91 | 0 | 100% | ██████████ |
| 101 | `alisveris_kiyafet_online` | gundelik | Kıyafet ve online alışveriş | 78 | 78 | 0 | 100% | ██████████ |
| 102 | `kisisel_bakim_berber` | gundelik | Berber, kuaför ve kişisel bakım | 52 | 52 | 0 | 100% | ██████████ |
| 103 | `gundelik_rutin` | gundelik | Sabahlar, rutin ve sıradan günler | 98 | 98 | 0 | 100% | ██████████ |
| 104 | `toplu_tasima` | ulasim | Toplu taşıma ve işe gidiş | 91 | 91 | 0 | 100% | ██████████ |
| 105 | `taksici` | tanidik_yuzler | Taksici arkı | 78 | 78 | 0 | 100% | ██████████ |
| 106 | `araba_sahipligi` | ulasim | Araba sahipliği | 93 | 91 | 0 | 102.2% | ██████████ |
| 107 | `trafik_cezalar` | ulasim | Trafik ve cezalar | 52 | 52 | 0 | 100% | ██████████ |
| 108 | `telefon_teknoloji` | teknoloji | Telefon ve teknoloji | 98 | 98 | 0 | 100% | ██████████ |
| 109 | `sosyal_medya` | teknoloji | Sosyal medya | 98 | 98 | 0 | 100% | ██████████ |
| 110 | `dijital_eglence` | teknoloji | Dizi, oyun ve ekran keyfi | 72 | 72 | 0 | 100% | ██████████ |
| 111 | `burokrasi_resmi_daire` | burokrasi | Bürokrasi ve resmî daireler (kurgusal) | 111 | 111 | 0 | 100% | ██████████ |
| 112 | `evrak_mektuplar` | burokrasi | Evrak kartları ve resmî mektuplar | 104 | 104 | 0 | 100% | ██████████ |
| 113 | `hukuki_sorunlar` | burokrasi | Küçük hukuki dertler (kurgusal) | 58 | 58 | 0 | 100% | ██████████ |
| 114 | `hobiler` | bos_zaman | Hobiler (el işi, müzik, kitap, bahçe) | 111 | 111 | 0 | 100% | ██████████ |
| 115 | `spor_amator_izleme` | bos_zaman | Amatör spor ve maç izlemek | 58 | 58 | 0 | 100% | ██████████ |
| 116 | `seyahat_tatil` | bos_zaman | Seyahat ve tatil | 91 | 91 | 0 | 100% | ██████████ |
| 117 | `evcil_pamuk` | tanidik_yuzler | Pamuk (kedi) arkı | 112 | 111 | 0 | 100.9% | ██████████ |
| 118 | `diger_evcil_hayvanlar` | bos_zaman | Diğer evcil hayvanlar | 39 | 39 | 0 | 100% | ██████████ |
| 119 | `gonulluluk_iyilik` | sosyal | Gönüllülük ve küçük iyilikler | 39 | 39 | 0 | 100% | ██████████ |
| 120 | `mevsimler_hava` | mevsim | Mevsimler ve hava durumu | 85 | 85 | 0 | 100% | ██████████ |
| 121 | `bayram_ozel_gunler` | mevsim | Bayramlar, yılbaşı ve özel günler (genel) | 78 | 78 | 0 | 100% | ██████████ |
| 122 | `orta_yas` | yaslilik | Orta yaş | 69 | 58 | 0 | 119% | ██████████ |
| 123 | `emeklilik_gecis` | yaslilik | Emekliliğe geçiş | 65 | 65 | 0 | 100% | ██████████ |
| 124 | `emekli_hayati` | yaslilik | Emekli hayatı | 104 | 104 | 0 | 100% | ██████████ |
| 125 | `yaslilik_gundelik` | yaslilik | Yaşlılık ve gündelik hayat | 136 | 111 | 0 | 122.5% | ██████████ |
| 126 | `miras_vasiyet` | yaslilik | Miras, vasiyet ve düzen | 49 | 39 | 0 | 125.6% | ██████████ |
| 127 | `veda_kayip` | yaslilik | Vedalar ve kayıplar (sessizlik protokolü) | 67 | 45 | 0 | 148.9% | ██████████ |
| 128 | `tanidik_yuzler_kesisme` | tanidik_yuzler | Tanıdık Yüzler kesişme günleri | 65 | 65 | 0 | 100% | ██████████ |
| 129 | `tek_hedef_anlari` | meta | Tek Hedef anları | 78 | 78 | 0 | 100% | ██████████ |
| 130 | `efsane_nadir` | meta | Efsane nadir günler | 77 | 98 | 21 | 78.6% | ████████░░ |
| 131 | `absurt_kuyruk` | meta | Kara mizah: absürt kuyruk | 101 | 130 | 29 | 77.7% | ████████░░ |
| 132 | `kucuk_anlar_relax` | meta | Küçük anlar (relax günleri) | 127 | 163 | 36 | 77.9% | ████████░░ |
