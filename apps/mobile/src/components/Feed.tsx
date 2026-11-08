/**
 * LifeFeed: the dated chat-and-calendar stream. Auto-scrolls only while the player is at the bottom
 * (07 §2.2.1); scrolling up to read leaves the position alone.
 */
import { memo, useRef } from 'react';
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

export function Feed({ items, typeMs, footer }: { items: FeedItem[]; typeMs: number; footer?: React.ReactNode }) {
  const ref = useRef<ScrollViewInstance>(null);
  const atBottom = useRef(true);
  const autoScrollAt = useRef(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Ignore the scroll events our own smooth scrollToEnd produces; only a player scrolling up stops the follow.
    if (Date.now() - autoScrollAt.current < 700) return;
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    atBottom.current = contentOffset.y + layoutMeasurement.height >= contentSize.height - 120;
  };
  const follow = () => {
    if (!atBottom.current) return;
    autoScrollAt.current = Date.now();
    ref.current?.scrollToEnd({ animated: typeMs > 0 });
  };
  return (
    <ScrollView ref={ref} style={st.feed} contentContainerStyle={st.content} onScroll={onScroll} scrollEventThrottle={64}
      onContentSizeChange={follow} testID="feed">
      {items.map((it) => <View key={it.id}><Row item={it} typeMs={typeMs} /></View>)}
      {footer}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  feed: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 20, gap: 10, flexGrow: 1, justifyContent: 'flex-end' },
});
