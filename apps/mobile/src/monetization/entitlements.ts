// Kalıcı hak (entitlement) deposu. Reklam katmanı buradan YALNIZ şu ikisini içe aktarır:
//   hasNoAds(): boolean            — senkron; depo yüklenene kadar false
//   onEntitlementsChange(cb): () => void
// (Dosya iskeleti; ayrıntılar aşağıda dolduruluyor.)
type Listener = () => void;
const listeners = new Set<Listener>();
let noAds = false;

export function hasNoAds(): boolean {
  return noAds;
}

export function onEntitlementsChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
