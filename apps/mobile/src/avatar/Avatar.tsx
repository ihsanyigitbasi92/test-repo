/**
 * <Avatar> — parametric, procedural vector face (react-native-svg, iOS / Android / web). Everything is drawn from
 * simple paths in a 100×100 box: our own art, no avatar packs, no emoji glyphs, no real-person likeness.
 *
 * Layers (back → front): disc · torso + outfit · neck · back hair · ears · face (+ sag) · wrinkles · eyes · brows ·
 * nose · facial hair · mouth · front hair / headwear · glasses · headset.
 * `age` drives gray hair (45+), forehead lines + eye bags (40+), crow's feet (55+), smile lines + jaw sag + posture
 * (65+). `desaturate` (0..1) grays every colour — the death moment cross-fades two layers instead of animating SVG.
 */
import { memo } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { agingFor, desatHex, FACIAL_HAIR, FACE_SHAPES, GLASSES, HAIR_STYLES, hairHex, BROWS, EYES, mixHex, NOSES, shadeHex, SKIN_TONES, TOP_COLORS } from './look';
import type { Look, Mood, TopStyle } from './look';

export interface AvatarProps {
  look: Look;
  age: number;
  mood?: Mood;
  size?: number;
  outfit?: TopStyle;
  /** 0..1 grayscale (dead mood forces 1). */
  desaturate?: number;
  /** Background disc colour; null = transparent. */
  bg?: string | null;
  testID?: string;
}

interface Geo { w: number; jw: number; chin: number }
const FACE_GEO: Record<(typeof FACE_SHAPES)[number], Geo> = {
  oval: { w: 19, jw: 10, chin: 67 },
  round: { w: 21, jw: 15, chin: 66 },
  square: { w: 20, jw: 17.5, chin: 66 },
  heart: { w: 19.5, jw: 6.5, chin: 68.5 },
};

const INK = '#1d1a18', MOUTH = '#5a1f22', WHITE = '#fbfaf6', TEETH = '#f4f1e6';
const r1 = (x: number) => Math.round(x * 10) / 10;

function facePath({ w, jw, chin }: Geo): string {
  const L = 50 - w, R = 50 + w;
  return `M${r1(L)},44 C${r1(L)},28 ${r1(50 - w * 0.6)},21 50,21 C${r1(50 + w * 0.6)},21 ${r1(R)},28 ${r1(R)},44 `
    + `C${r1(R)},56 ${r1(50 + jw)},${r1(chin - 1)} 50,${r1(chin)} C${r1(50 - jw)},${r1(chin - 1)} ${r1(L)},56 ${r1(L)},44 Z`;
}

function Torso({ style, base, skin }: { style: TopStyle; base: string; skin: string }) {
  const dark = shadeHex(base, 0.72);
  const body = 'M12,101 C12,85 27,76.5 50,76.5 C73,76.5 88,85 88,101 Z';
  const neck = <Rect x={43} y={60} width={14} height={20} rx={5} fill={shadeHex(skin, 0.9)} />;
  switch (style) {
    case 'hoodie':
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M31,80 Q50,96 69,80" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Line x1={45.5} y1={86} x2={44.5} y2={95} stroke={WHITE} strokeWidth={1.3} strokeLinecap="round" />
          <Line x1={54.5} y1={86} x2={55.5} y2={95} stroke={WHITE} strokeWidth={1.3} strokeLinecap="round" />
        </G>
      );
    case 'collar':
      return (
        <G>
          {neck}
          <Path d={body} fill={shadeHex(base, 1.45)} />
          <Path d="M43,76 L50,86 L45.5,89 L37,79 Z" fill={WHITE} stroke={dark} strokeWidth={0.6} />
          <Path d="M57,76 L50,86 L54.5,89 L63,79 Z" fill={WHITE} stroke={dark} strokeWidth={0.6} />
          <Circle cx={50} cy={92} r={1} fill={dark} />
        </G>
      );
    case 'tie':
    case 'blazer': {
      const jacket = style === 'tie' ? '#2c3340' : dark;
      return (
        <G>
          {neck}
          <Path d={body} fill={jacket} />
          <Path d="M41,77 L50,95 L59,77 Z" fill={WHITE} />
          {style === 'tie'
            ? <Path d="M48.3,80 L51.7,80 L53.2,91 L50,96 L46.8,91 Z" fill={base} />
            : <Path d="M44,77 L50,84 L56,77" stroke={shadeHex(jacket, 0.7)} strokeWidth={1} fill="none" />}
          <Path d="M41,77 L47,92 L40,85 Z" fill={shadeHex(jacket, 1.2)} />
          <Path d="M59,77 L53,92 L60,85 Z" fill={shadeHex(jacket, 1.2)} />
        </G>
      );
    }
    case 'apron':
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M35,86 L65,86 L67,101 L33,101 Z" fill="#6e4b31" />
          <Line x1={37} y1={86} x2={43} y2={77.5} stroke="#6e4b31" strokeWidth={2} />
          <Line x1={63} y1={86} x2={57} y2={77.5} stroke="#6e4b31" strokeWidth={2} />
          <Rect x={45} y={90} width={10} height={6} rx={1} fill="#5a3c27" />
        </G>
      );
    case 'vest':
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M24,84 C30,79 38,77 43,77 L48,101 L20,101 Z" fill="#ff8a1f" />
          <Path d="M76,84 C70,79 62,77 57,77 L52,101 L80,101 Z" fill="#ff8a1f" />
          <Rect x={20} y={92} width={28} height={3} fill="#e6e4da" />
          <Rect x={52} y={92} width={28} height={3} fill="#e6e4da" />
        </G>
      );
    case 'headset':
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M42,77 Q50,85 58,77" stroke={dark} strokeWidth={2} fill="none" />
        </G>
      );
    case 'cardigan':
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M42,77 L50,90 L58,77 Z" fill={shadeHex(base, 1.55)} />
          <Line x1={50} y1={90} x2={50} y2={101} stroke={dark} strokeWidth={1.2} />
          <Circle cx={48} cy={94} r={0.9} fill={dark} />
          <Circle cx={48} cy={98.5} r={0.9} fill={dark} />
        </G>
      );
    case 'tee':
    default:
      return (
        <G>
          {neck}
          <Path d={body} fill={base} />
          <Path d="M42,77 Q50,84 58,77" stroke={dark} strokeWidth={1.6} fill="none" />
        </G>
      );
  }
}

function BackHair({ style, color, w }: { style: string; color: string; w: number }) {
  const L = 50 - w, R = 50 + w;
  switch (style) {
    case 'long':
      return <Path d={`M${L - 3},42 C${L - 4},20 40,13 50,13 C60,13 ${R + 4},20 ${R + 3},42 L${R + 4},73 Q${R - 7},78 ${R - 9},66 L${L + 9},66 Q${L + 7},78 ${L - 4},73 Z`} fill={color} />;
    case 'bob':
      return <Path d={`M${L - 3},42 C${L - 4},20 40,14 50,14 C60,14 ${R + 4},20 ${R + 3},42 L${R + 3},59 Q${R - 2},62 ${R - 5},58 L${L + 5},58 Q${L + 2},62 ${L - 3},59 Z`} fill={color} />;
    case 'bun':
      return <Circle cx={50} cy={14} r={7.5} fill={color} />;
    case 'curly':
      return (
        <G fill={color}>
          {[[31, 30, 8], [37, 22, 8.5], [46, 18, 9], [55, 18, 9], [63, 22, 8.5], [69, 30, 8], [29, 40, 7], [71, 40, 7]].map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} />
          ))}
        </G>
      );
    default:
      return null;
  }
}

function FrontHair({ style, color, w, accent }: { style: string; color: string; w: number; accent: string }) {
  const L = 50 - w, R = 50 + w;
  switch (style) {
    case 'bald':
      return <Ellipse cx={43} cy={27} rx={5} ry={2.4} fill={WHITE} opacity={0.22} transform="rotate(-20 43 27)" />;
    case 'buzz':
      return <Path d={`M${L},41 C${L},25 ${50 - w * 0.6},20.5 50,20.5 C${50 + w * 0.6},20.5 ${R},25 ${R},41 L${R - 1.5},35 C${R - 3},28 58,26 50,26 C42,26 ${L + 3},28 ${L + 1.5},35 Z`} fill={color} opacity={0.62} />;
    case 'short':
      return <Path d={`M${L - 1},42 C${L - 2},22 40,16.5 50,16.5 C61,16.5 ${R + 2},22 ${R + 1},42 L${R - 2},33 Q60,27 51,30 Q41,26 ${L + 2},34 Z`} fill={color} />;
    case 'sidePart':
      return <Path d={`M${L - 1},43 C${L - 2},21 39,16 51,16 C62,16 ${R + 2},22 ${R + 1},40 L${R - 2},32 Q63,24 44,31 Q38,33 ${L + 2},37 Z`} fill={color} />;
    case 'curly':
      return (
        <G fill={color}>
          {[[35, 27, 6], [42, 24, 6.5], [50, 23, 6.5], [58, 24, 6.5], [65, 27, 6], [31, 35, 4.5], [69, 35, 4.5]].map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} />
          ))}
        </G>
      );
    case 'long':
    case 'bob':
      return <Path d={`M${L - 1},46 C${L - 2},20 42,15.5 50,17 C58,15.5 ${R + 2},20 ${R + 1},46 L${R - 2},40 C${R - 3},30 56,24 50,23 C44,24 ${L + 3},30 ${L + 2},40 Z`} fill={color} />;
    case 'bun':
      return <Path d={`M${L - 1},41 C${L - 2},22 40,17.5 50,17.5 C60,17.5 ${R + 2},22 ${R + 1},41 L${R - 2},34 Q60,24.5 50,24.5 Q40,24.5 ${L + 2},34 Z`} fill={color} />;
    case 'spiky':
      return <Path d={`M${L},37 L${L + 1.5},22 L38,28 L41,15 L46,25 L50,12 L54,25 L59,15 L62,28 L${R - 1.5},22 L${R},37 Q60,27 50,28.5 Q40,27 ${L},37 Z`} fill={color} />;
    case 'beanie':
      return (
        <G>
          <Path d={`M${L - 2},36 C${L - 2},17 40,11 50,11 C60,11 ${R + 2},17 ${R + 2},36 Z`} fill={accent} />
          {[40, 45, 50, 55, 60].map((x) => <Line key={x} x1={x} y1={14} x2={x} y2={31} stroke={shadeHex(accent, 0.8)} strokeWidth={0.8} />)}
          <Rect x={L - 3} y={30.5} width={2 * w + 6} height={7.5} rx={3.5} fill={shadeHex(accent, 0.78)} />
          <Circle cx={50} cy={10} r={4.2} fill={shadeHex(accent, 1.35)} />
        </G>
      );
    default:
      return null;
  }
}

function Eyes({ kind, mood, skin }: { kind: string; mood: Mood; skin: string }) {
  const xs = [42, 58];
  if (mood === 'dead') {
    return (
      <G stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        {xs.map((x) => <G key={x}><Line x1={x - 2.6} y1={41.4} x2={x + 2.6} y2={46.6} /><Line x1={x + 2.6} y1={41.4} x2={x - 2.6} y2={46.6} /></G>)}
      </G>
    );
  }
  if (mood === 'happy') {
    return <G stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round">{xs.map((x) => <Path key={x} d={`M${x - 3.2},45 Q${x},40.5 ${x + 3.2},45`} />)}</G>;
  }
  const big = mood === 'shock' || kind === 'wide';
  const lidded = mood === 'smug' || kind === 'sleepy';
  return (
    <G>
      {xs.map((x) => {
        if (kind === 'dot' && !big) return <Circle key={x} cx={x} cy={44} r={2.2} fill={INK} />;
        const rx = big ? 4 : kind === 'almond' ? 4 : 3.5, ry = big ? 4 : kind === 'almond' ? 2.6 : 3.1;
        return (
          <G key={x}>
            {kind === 'almond' && !big
              ? <Path d={`M${x - 4},44 Q${x},40.6 ${x + 4},44 Q${x},47.4 ${x - 4},44 Z`} fill={WHITE} />
              : <Ellipse cx={x} cy={44} rx={rx} ry={ry} fill={WHITE} />}
            <Circle cx={x + (mood === 'smug' ? 1 : 0)} cy={44.3} r={big ? 1.7 : 1.9} fill={INK} />
            {lidded && <Path d={`M${x - rx - 0.6},44 Q${x},${44 - ry - 1.6} ${x + rx + 0.6},44 Z`} fill={skin} />}
            {lidded && <Line x1={x - rx - 0.4} y1={44} x2={x + rx + 0.4} y2={44} stroke={INK} strokeWidth={1.1} strokeLinecap="round" />}
          </G>
        );
      })}
    </G>
  );
}

function Brows({ kind, mood, color }: { kind: string; mood: Mood; color: string }) {
  const thick = kind === 'thick' ? 3.2 : kind === 'angled' ? 1.5 : 2;
  const dy = mood === 'shock' ? -3.5 : mood === 'happy' ? -1 : 0;
  const shape = (x: number, side: -1 | 1) => {
    const outer = x + side * 4, inner = x - side * 4;
    if (kind === 'arched') return `M${inner},38 Q${x},34.6 ${outer},37.6`;
    if (kind === 'angled') return `M${inner},37 L${outer},38.4`;
    return `M${inner},37.6 L${outer},37.4`;
  };
  // Rotation around each brow centre: sad lifts the inner ends, smug raises the left one.
  const rot = (side: -1 | 1) => (mood === 'sad' ? side * -13 : mood === 'smug' && side === -1 ? -10 : mood === 'dead' ? side * -6 : 0);
  const lift = (side: -1 | 1) => dy + (mood === 'smug' && side === -1 ? -2.5 : 0);
  return (
    <G stroke={color} strokeWidth={thick} strokeLinecap="round" fill="none">
      {([[42, -1], [58, 1]] as [number, -1 | 1][]).map(([x, side]) => (
        <Path key={x} d={shape(x, side)} transform={`translate(0 ${lift(side)}) rotate(${rot(side)} ${x} 37.5)`} />
      ))}
    </G>
  );
}

function Nose({ kind, skin }: { kind: string; skin: string }) {
  const sh = shadeHex(skin, 0.78);
  switch (kind) {
    case 'line': return <Path d="M50.5,45 L48,52.5 L51.5,52.5" stroke={sh} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    case 'pointed': return <Path d="M50,44 L46.6,53 Q50,55 53.4,53" stroke={sh} strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    case 'round': return <Ellipse cx={50} cy={51.5} rx={3.4} ry={2.5} fill={sh} />;
    case 'button':
    default: return <Ellipse cx={50} cy={51.5} rx={2.1} ry={1.6} fill={sh} />;
  }
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'happy':
      return (
        <G>
          <Path d="M43,56.5 Q50,65.5 57,56.5 Q50,58.8 43,56.5 Z" fill={MOUTH} />
          <Path d="M45,57.3 Q50,59.2 55,57.3 L54.5,58.6 Q50,60 45.5,58.6 Z" fill={TEETH} />
        </G>
      );
    case 'smug': return <Path d="M44,59.2 Q50,59.8 56.5,55.4" stroke={MOUTH} strokeWidth={2} fill="none" strokeLinecap="round" />;
    case 'shock': return <Ellipse cx={50} cy={59.5} rx={3} ry={4} fill={MOUTH} />;
    case 'sad': return <Path d="M44,61.5 Q50,55.8 56,61.5" stroke={MOUTH} strokeWidth={2} fill="none" strokeLinecap="round" />;
    case 'dead': return <Path d="M44,59 L47,58 L50,59.5 L53,58 L56,59" stroke={MOUTH} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    case 'neutral':
    default: return <Path d="M45,58.4 Q50,59.6 55,58.4" stroke={MOUTH} strokeWidth={2} fill="none" strokeLinecap="round" />;
  }
}

function FacialHair({ kind, color, stubble, g }: { kind: string; color: string; stubble: string; g: Geo }) {
  const L = 50 - g.w, R = 50 + g.w;
  const jaw = `M${L + 0.5},46 C${L + 0.5},57 ${50 - g.jw},${g.chin - 1} 50,${g.chin} C${50 + g.jw},${g.chin - 1} ${R - 0.5},57 ${R - 0.5},46 `;
  const mustache = <Path d="M43,56.3 Q46.5,52.6 50,54.4 Q53.5,52.6 57,56.3 Q50,55.2 43,56.3 Z" fill={color} />;
  switch (kind) {
    case 'stubble': return <Path d={`${jaw}L${R - 3.5},50 Q56,63.5 50,63.5 Q44,63.5 ${L + 3.5},50 Z`} fill={stubble} opacity={0.22} />;
    case 'mustache': return mustache;
    case 'beard':
      return (
        <G>
          <Path d={`${jaw}L${R - 3.5},50 Q57,62.6 50,62.6 Q43,62.6 ${L + 3.5},50 Z`} fill={color} />
          {mustache}
        </G>
      );
    default: return null;
  }
}

function Glasses({ kind }: { kind: string }) {
  const frame = '#1b1b1b';
  if (kind === 'round') {
    return (
      <G stroke={frame} strokeWidth={1.4} fill={WHITE} fillOpacity={0.12}>
        <Circle cx={42} cy={44} r={5.6} /><Circle cx={58} cy={44} r={5.6} />
        <Line x1={47.6} y1={43.6} x2={52.4} y2={43.6} />
      </G>
    );
  }
  if (kind === 'square') {
    return (
      <G stroke={frame} strokeWidth={1.6} fill={WHITE} fillOpacity={0.12}>
        <Rect x={35.8} y={39.6} width={12.4} height={8.8} rx={1.8} /><Rect x={51.8} y={39.6} width={12.4} height={8.8} rx={1.8} />
        <Line x1={48.2} y1={43.2} x2={51.8} y2={43.2} />
      </G>
    );
  }
  return null;
}

function Wrinkles({ level, bags, skin, sag, g }: { level: number; bags: boolean; skin: string; sag: number; g: Geo }) {
  const ln = shadeHex(skin, 0.74);
  return (
    <G stroke={ln} strokeWidth={0.9} fill="none" strokeLinecap="round" opacity={0.85}>
      {level >= 1 && <Path d="M43,31 Q50,29.6 57,31" />}
      {level >= 2 && <Path d="M44.5,28 Q50,27 55.5,28" />}
      {level >= 2 && <G><Path d="M35.6,42.6 L33.6,41.6" /><Path d="M35.8,45 L33.6,45.4" /><Path d="M64.4,42.6 L66.4,41.6" /><Path d="M64.2,45 L66.4,45.4" /></G>}
      {bags && <G><Path d="M39,48.6 Q42,50.2 45,48.6" /><Path d="M55,48.6 Q58,50.2 61,48.6" /></G>}
      {level >= 3 && <G><Path d="M44.6,53 Q42.4,56.6 43.6,60" /><Path d="M55.4,53 Q57.6,56.6 56.4,60" /></G>}
      {sag > 0 && <G><Path d={`M${50 - g.jw - 2},${g.chin - 5} Q${50 - g.jw},${g.chin - 1} ${50 - g.jw + 3},${g.chin}`} /><Path d={`M${50 + g.jw + 2},${g.chin - 5} Q${50 + g.jw},${g.chin - 1} ${50 + g.jw - 3},${g.chin}`} /></G>}
    </G>
  );
}

function Headset() {
  return (
    <G>
      <Path d="M29,46 C27,17 73,17 71,46" stroke="#232323" strokeWidth={2.6} fill="none" />
      <Rect x={25.6} y={41} width={6} height={10} rx={2.4} fill="#232323" />
      <Rect x={68.4} y={41} width={6} height={10} rx={2.4} fill="#232323" />
      <Path d="M29,50 Q31,60 42,60" stroke="#232323" strokeWidth={1.6} fill="none" />
      <Circle cx={42.5} cy={60} r={1.8} fill="#c9ff3a" />
    </G>
  );
}

function AvatarImpl({ look, age, mood = 'neutral', size = 52, outfit = 'tee', desaturate, bg = null, testID }: AvatarProps) {
  const gray = mood === 'dead' ? 1 : desaturate ?? 0;
  const c = (hex: string) => desatHex(hex, gray);
  const aging = agingFor(age);
  const geo0 = FACE_GEO[FACE_SHAPES[look.face] ?? 'oval'];
  // 65+: the jaw widens and drops a touch (face sag); the head sits lower over the shoulders (posture).
  const geo: Geo = { w: geo0.w, jw: geo0.jw + aging.sag * 2.4, chin: geo0.chin + aging.sag * 1.4 };
  const skin = c(SKIN_TONES[look.skin] ?? SKIN_TONES[0]);
  const hair = c(hairHex(look, age));
  const top = c(TOP_COLORS[look.top] ?? TOP_COLORS[0]);
  const hairStyle = HAIR_STYLES[look.hair] ?? 'short';
  const eyes = EYES[look.eyes] ?? 'dot';
  const brows = BROWS[look.brows] ?? 'straight';
  const nose = NOSES[look.nose] ?? 'button';
  const facial = FACIAL_HAIR[look.facial] ?? 'none';
  const glasses = GLASSES[look.glasses] ?? 'none';
  // Facial hair never takes the dyed teal (→ dark brown); stubble is a skin-derived shadow, not a hair-colour wash.
  const beardBase = look.hairColor === 5 ? hairHex({ ...look, hairColor: 1 }, age) : hairHex(look, age);
  const beard = c(beardBase);
  const stubble = c(mixHex(shadeHex(SKIN_TONES[look.skin] ?? SKIN_TONES[0], 0.55), beardBase, 0.35));
  const browColor = hairStyle === 'bald' || hairStyle === 'buzz' ? c(shadeHex(hairHex(look, age), 0.85)) : hair;
  const head = `translate(0 ${(aging.sag * 2.6).toFixed(2)})`;
  const sk = c(shadeHex(SKIN_TONES[look.skin] ?? SKIN_TONES[0], 0.88));
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" testID={testID}>
      {bg && <Circle cx={50} cy={50} r={50} fill={bg} />}
      <G transform={`translate(0 ${(aging.sag * 1.5).toFixed(2)})`}>
        <Torso style={outfit} base={top} skin={skin} />
      </G>
      <G transform={head}>
        <BackHair style={hairStyle} color={hair} w={geo.w} />
        <Ellipse cx={50 - geo.w - 0.5} cy={46} rx={3.6} ry={5} fill={sk} />
        <Ellipse cx={50 + geo.w + 0.5} cy={46} rx={3.6} ry={5} fill={sk} />
        <Path d={facePath(geo)} fill={skin} />
        {mood === 'happy' && <G fill="#ff7a8a" opacity={0.28}><Circle cx={38} cy={52} r={3.6} /><Circle cx={62} cy={52} r={3.6} /></G>}
        <Wrinkles level={aging.wrinkles} bags={aging.bags} skin={skin} sag={aging.sag} g={geo} />
        <Eyes kind={eyes} mood={mood} skin={skin} />
        <Brows kind={brows} mood={mood} color={browColor} />
        <Nose kind={nose} skin={skin} />
        <FacialHair kind={facial} color={beard} stubble={stubble} g={geo} />
        <Mouth mood={mood} />
        <FrontHair style={hairStyle} color={hair} w={geo.w} accent={c(shadeHex(TOP_COLORS[(look.top + 3) % TOP_COLORS.length]!, 1))} />
        <Glasses kind={glasses} />
        {outfit === 'headset' && <Headset />}
      </G>
    </Svg>
  );
}

export const Avatar = memo(AvatarImpl);

/** Pamuk — a white cat sprite (procedural shapes, 40×40 box). */
function CatSpriteImpl({ size = 24, mood = 'neutral', bg = null }: { size?: number; mood?: Mood; bg?: string | null }) {
  const fur = '#f4f2ec', edge = '#b9b4a6', pink = '#f3a7b4';
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {bg && <Circle cx={20} cy={20} r={20} fill={bg} />}
      <Path d="M30,33 Q38,30 35,22" stroke={edge} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Ellipse cx={22} cy={30} rx={10} ry={7.5} fill={fur} stroke={edge} strokeWidth={0.8} />
      <Path d="M10,14 L12,5 L17,11 Z" fill={fur} stroke={edge} strokeWidth={0.8} strokeLinejoin="round" />
      <Path d="M28,14 L26,5 L21,11 Z" fill={fur} stroke={edge} strokeWidth={0.8} strokeLinejoin="round" />
      <Path d="M12,12 L12.8,7.6 L15.4,10.6 Z" fill={pink} />
      <Path d="M26,12 L25.2,7.6 L22.6,10.6 Z" fill={pink} />
      <Circle cx={19} cy={17} r={9} fill={fur} stroke={edge} strokeWidth={0.8} />
      {mood === 'happy'
        ? <G stroke="#3b3a36" strokeWidth={1.1} fill="none" strokeLinecap="round"><Path d="M14.4,16.8 Q16,15 17.6,16.8" /><Path d="M20.4,16.8 Q22,15 23.6,16.8" /></G>
        : <G fill="#6aa86a"><Ellipse cx={16} cy={16.4} rx={1.5} ry={1.9} /><Ellipse cx={22} cy={16.4} rx={1.5} ry={1.9} /></G>}
      <Path d="M18,19.6 L20,19.6 L19,20.8 Z" fill={pink} />
      <G stroke={edge} strokeWidth={0.6}><Line x1={13} y1={20} x2={8} y2={19} /><Line x1={13} y1={21.2} x2={8} y2={22} /><Line x1={25} y1={20} x2={30} y2={19} /><Line x1={25} y1={21.2} x2={30} y2={22} /></G>
    </Svg>
  );
}

export const CatSprite = memo(CatSpriteImpl);
