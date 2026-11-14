# @motto/engine

Motto'nun hayat motoru: saf TypeScript, React Native bağımlılığı yok, ağ / saat / depolama erişimi yok.
Tüm aritmetik tam sayıdır (D-098): statlar baz puan (0..10000), para **Para** (1 Birim = 1000 Para),
olasılıklar baz puan. Transandantal `Math` fonksiyonları ve `**` yasaktır; kural `tools/check-no-transcendental.mjs`
ile denetlenir ve `pnpm --filter @motto/engine test` içinde (`test/lint.test.ts`) çalışır.

Bağlayıcı belgeler: `docs/design/10-teknik-mimari.md` §2.3/§3, `03-…director-dopamin.md`, `02-…ekonomi-saglik-olum.md`,
karar listesi `00-VIZYON-ve-KARARLAR.md` (D-061…D-124).

## API özeti

```ts
import { step, emptyMeta, resolveText, renderText, hashState } from '@motto/engine';

let { state, meta, effects } = step(null as any, emptyMeta(), { type: 'START_LIFE', seed, name: 'Ada' }, bundle);
({ state, meta, effects } = step(state, meta, { type: 'NEXT_DAY' }, bundle));
({ state, meta, effects } = step(state, meta, { type: 'ANSWER', eventId: state.card!.eventId, choiceId: 'durust', via: 'tap' }, bundle));
```

`step(state, meta, action, content) → { state, meta, effects }` **saftır**: girdiler değişmez (`structuredClone` +
yerinde reducer `applyAction`). Simülasyon için klonsuz `applyAction` da dışa açıktır. Aynı tohum + aynı aksiyon
dizisi = bit bit aynı durum (`hashState`; altın hash `test/golden.test.ts`, AC-10-03).

| Aksiyon | Ne yapar |
|---|---|
| `START_LIFE { seed, name, locale?, voice?, fastLife? }` | Yeni hayat (gün 0 = Müşteri Dosyası). |
| `NEXT_DAY` | Boşluk (drift + nakit akışı) → doğum günü karnesi **ya da** günün olay kartı. Yalnızca `phase ∈ {idle, answered, birthday}`; aksi hâlde `HAPTIC error`. |
| `ANSWER { eventId, choiceId, via? }` | Kartı cevaplar. `eventId ≠ card.eventId` (bayat / çift dokunma) → yok sayılır + `HAPTIC error`. |
| `SESSION_END { reason? }` (= `END_SESSION`) | En ağır zarfı açar, `NOTIFY_PLAN` döner, oturum sayaçlarını sıfırlar, `expectedSessionDays` = son 5 oturumun medyanı. |
| `RESUME { localDay?, nowWall? }` | Yalnızca Günün Günü tohumu için yerel tarihi kaydeder; motor saati okumaz (D-050). |
| `OPEN_ENVELOPE { envelopeId }` | Zarfı açar (çözmez). |
| `SET_SPEED`, `PAUSE`, `PICK_GOAL` | UI durumu / no-op (`PICK_GOAL`: hedefler MVP motorunda yok, TODO). |

İçerik paketi: `{ contentHash, events: GameEvent[], skipLines }`. Olaylar `@motto/content-schema`'nın tek zod
şemasıyla (D-099) build/lint zamanında doğrulanır; motor yalnızca tipleri içe aktarır, zod çalışma zamanına girmez.
Paket düzeyi referans kontrolleri (followUp, zarf çözücü + `envelopeOpen:true`, `chainNext`, `chain.next`) ve dürüstlük
kuralı (başarı dalının `p`'si = `check.base`) şemadadır.

Ayar sabitleri tek dosyada: `src/tuning.json` (D-100; yalnızca tam sayı, yüklemede denetlenir).

## UI efektleri nasıl tüketir

Efektler sıralı veridir; UI onları sırayla oynatır, kendi zarını atmaz (D-088).

| Efekt | UI'da karşılığı |
|---|---|
| `SHOW_DAY { card }` | `DateLine` → (`card.skip` varsa) `SkipSummary` → `card.flowLog` (≤ 3 satır: maaş/harçlık, kira, günlük gider toplamı) → `DayCard` (seçenekler, `wager` varsa `WagerSlip`). `eventId === 'sys_report_card'` doğum günü, `'sys_quiet'` sakin gün. `card.forced`, `momCall`, `legendary`, `surpriseTier`, `daily` görsel varyantı seçer. |
| `SHOW_DIALOG { bubbles, layer }` | `layer`: `dialog` (NPC/anlatıcı balonları, `delayMs`), `reply` (oyuncu balonu), `outcome` (sonuç satırı), `coach` (koç satırı; `roast`/`lift`). |
| `FLOAT_NUM { stat, delta }` | `FloatingNumber` (bp → puan için /100; `money` Para). Sonuç satırından hemen sonra gelir. |
| `STAMP { result, pOddsBp, variant }` | İddia damgası (`calledIt` / `iWasWrong`). Gösterilen oran = zar eşiği. |
| `REPORT_CARD { data }` | Karne (6 not, motto hücresi, koç isabeti, zarf satırı). |
| `DEATH { age, cause, channel }` | Ölüm akışı; ardından `buildRoast(state)`. |
| `NOTIFY_PLAN { teaserKeys }` | Oturum sonunda yerel bildirim planı (zarf teaser'ı). |
| `HAPTIC { pattern: 'error' }` | Geçersiz aksiyon (cevapsız günde NEXT_DAY, bayat ANSWER). |
| `SESSION_END_SUGGESTED` | Oturum eğrisi t ≥ 0,85: "Bugünlük yeter" önerilebilir. |

### Metin anahtarları

Motor düzyazı taşımaz; her balon / seçenek / atlama satırı bir `textKey` taşır:

```ts
const text = renderText(bundle, bubble.textKey, locale, bubble.params);   // resolveText + {param} doldurma
```

Anahtar biçimleri `src/content.ts` başlığındadır (`evt.<id>.dialog.<i>[.alt.<k>]`, `evt.<id>.text.<variant>`,
`evt.<id>.c.<choice>`, `evt.<id>.o.<choice>.<dal>.text|nearMiss|coach.<j>`, `evt.<id>.wager.slip`, `skip.<id>`).
`params` yer tutucuları doldurur: `{name}`, `{ego}`, `{cringe}`, `{momPressure}` (puan), `{money}` (Para),
`{n}` (koç/sonuç: bu dalın bu hayattaki kaçıncı tekrarı), atlama satırında `{n}`/`{days}`. `text[]` ve
`dialog[].alt[]` varyantları en az görülen seçilerek döner. Zarf `teaserKey`'leri ve `death.<cause>` UI kataloğundadır.

## Modüller

| Dosya | Sorumluluk |
|---|---|
| `step.ts` | Aksiyon yönlendirme, oturum sonu, mom-call tetikleyicisi, `hashState`. |
| `day.ts` | `NEXT_DAY`: boşluk, yükümlülükler (kira kartı, İcra kartı), doğum günü pulse'ı, olay günü. |
| `director.ts` | Tek DayDirector (D-101): yıllık bütçe, boşluk, atlama özeti, öncelik sırası (anne araması → zarf → zincir → forced → kira/bailout/İcra → şanslı followUp → Günün Günü → efsane → sürpriz → salience). |
| `card.ts` | Kart görünüm modeli, metin varyantları, `textParams`. |
| `answer.ts` | Zar (`outcome` kanalı; Günün Günü'nde tarih tohumlu), dürüst near-miss, efektler, iddia damgası. |
| `apply.ts` | İçerik `effects` bloğunu duruma uygular; zarf açma. |
| `cashflow.ts` | Maaş/kira/mama/sağlık/gündelik gider, kart borcu, İcra bayrağı ve sıfırlama, koruma penceresi. |
| `bailout.ts` | 18–27 bailout teklifi (kira günü olayı ya da doğum günü) → öncelik 7 gün kartı. |
| `salience.ts`, `pre.ts` | Skorlama, uygunluk (konuşan NPC var/canlı kapısı dahil), ön koşul DSL'i. |
| `pity.ts`, `wager.ts`, `hazard.ts`, `drift.ts`, `report.ts` | Sürpriz/efsane kadansı, iddia servisi (gözlemci), ölüm tablosu, yıllık sapma, karne/Roast. |

## Testler

`pnpm --filter @motto/engine test` (vitest + fast-check): determinizm ve altın hash, 1.000 hayatlık mini harness,
özellik testleri (tam sayı, sınırlar, para tabanı, ≤ 1 bailout), ikiz hayat (iddia servisi kapalı → aynı stat yolu),
kira/bailout/İcra/zarf kartları, metin anahtarlarının iki dilde çözülmesi, D-098 lint. Tip denetimi:
`pnpm --filter @motto/engine typecheck`.
