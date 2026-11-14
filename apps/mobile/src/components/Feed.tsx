/**
 * LifeFeed: the dated chat-and-calendar stream. Auto-scrolls only while the player is at the bottom
 * (07 §2.2.1); scrolling up to read leaves the position alone.
 *
 * Follow rule (playtest 2026-11-12, deneyim #15: at ▶▶ the feed stalled days behind the HUD): only a scroll that
 * moves UP is the player's; our own scrollToEnd only ever moves down, so while the content grows faster than a
 * smooth scroll can catch up, the follow is kept instead of being dropped. A birthday report card always pulls
 * the feed to the bottom, so it is seen before "One More Year".
 */
import { memo, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';
import type { FeedItem } from '../state/feed';
import { CoachLine, MundaneLine, NpcBubble, PlayerBubble, ResultLine, SysLine } from './Bubbles';
import { DayCard } from './DayCard';
import { DateLine, FlowLines, SkipSummary, TypingLine } from './DayLines';
import { ReportCard } from './ReportCard';

const Row = memo(function Row({ item, typeMs }: { item: FeedItem; typeMs: number }) {
  switch (item.kind) {
    case 'date': return <DateLine item={item} />;
    case 'skip': return <SkipSummary item={item} />;
    case 'flow': return <FlowLines item={item} />;
    case 'typing': return <TypingLine item={item} />;
    case 'card': return <DayCard item={item} />;
    case 'npc': return <NpcBubble item={item} />;
    case 'reply': return <PlayerBubble item={item} />;
    case 'outcome': return <ResultLine item={item} />;
    case 'coach': return <CoachLine item={item} typeMs={typeMs} />;
    case 'report': return <ReportCard item={item} typeMs={typeMs} />;
    case 'sys': return <SysLine item={item} />;
    case 'mundane': return <MundaneLine item={item} />;
  }
});

/** `pinKey`: changes whenever a decision appears (choices / One More Year) — the feed then snaps to the newest line. */
export function Feed({ items, typeMs, footer, pinKey = null }: { items: FeedItem[]; typeMs: number; footer?: React.ReactNode; pinKey?: string | null }) {
  const ref = useRef<ScrollViewInstance>(null);
  const atBottom = useRef(true);
  const lastY = useRef(0);
  const lastH = useRef(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    if (y + layoutMeasurement.height >= contentSize.height - 120) atBottom.current = true;   // back at the bottom: follow again
    // The player scrolled up to read — not a clamp from content shrinking (typing line removed, old items trimmed).
    else if (y < lastY.current - 4 && contentSize.height >= lastH.current) atBottom.current = false;
    lastY.current = y;
    lastH.current = contentSize.height;
  };
  // Smooth scrolling only at ▶ (typewriter speed); at ▶▶ items arrive faster than an animated scroll settles.
  const follow = () => { if (atBottom.current) ref.current?.scrollToEnd({ animated: typeMs >= 10 }); };
  // The decision zone grows (choices, One More Year) after the last bubble landed: the feed viewport shrinks with
  // no content change, so re-pin to the bottom here — the latest line stays fully visible above the panel (UX #7/#8).
  const onLayout = () => { if (atBottom.current) ref.current?.scrollToEnd({ animated: false }); };
  const last = items[items.length - 1];
  const reportId = last?.kind === 'report' ? last.id : null;
  useEffect(() => {
    if (pinKey === null) return;
    atBottom.current = true;
    ref.current?.scrollToEnd({ animated: false });
  }, [pinKey]);
  useEffect(() => {
    if (reportId === null) return;
    atBottom.current = true;
    ref.current?.scrollToEnd({ animated: false });
  }, [reportId]);
  return (
    <ScrollView ref={ref} style={st.feed} contentContainerStyle={st.content} onScroll={onScroll} scrollEventThrottle={64}
      onContentSizeChange={follow} onLayout={onLayout} testID="feed">
      {items.map((it) => <View key={it.id}><Row item={it} typeMs={it.restored ? 0 : typeMs} /></View>)}
      {footer}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  feed: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 20, gap: 10, flexGrow: 1, justifyContent: 'flex-end' },
});
