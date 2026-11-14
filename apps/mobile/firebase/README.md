# Firebase yapılandırma dosyaları

Bu klasöre proje sahibinin Firebase Console'dan indirdiği **iki gerçek dosya** konur:

| Dosya | Nereden |
|---|---|
| `google-services.json` | Firebase Console › Project settings › Your apps › Android (`com.d2ptechnology.motto`) |
| `GoogleService-Info.plist` | Firebase Console › Project settings › Your apps › iOS (`com.d2ptechnology.motto`) |

İkisi de buradayken `app.config.js` Firebase eklentilerini kendiliğinden açar; başka bir dosyaya dokunmak gerekmez.
`*.example.*` dosyaları yalnızca biçimi gösterir, build'e girmez ve gerçek hiçbir değer içermez.

Gerçek dosyalar `.gitignore`'dadır (gizli anahtar değildirler, ama proje kimliğini taşırlar; depoya girip girmeyeceğine
sahibi karar verir). EAS Build için dosya ortam değişkenleri: `GOOGLE_SERVICES_JSON`, `GOOGLE_SERVICE_INFO_PLIST`.
Ayrıntı: `docs/design/17-analitik-ve-firebase.md` §6.
