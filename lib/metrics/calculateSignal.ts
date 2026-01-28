import type { SerializedSnapshot } from '@/lib/types/snapshot';

export type Signal = 'positive' | 'negative' | 'neutral';

/**
 * Calculate performance signal by comparing current snapshot to previous
 * 
 * Returns:
 * - 'positive' if metrics show improvement
 * - 'negative' if metrics show decline  
 * - 'neutral' if no significant change or not enough data
 */
export function calculateSignal(
  currentSnapshot: SerializedSnapshot | any,
  previousSnapshot?: SerializedSnapshot | any | null
): Signal {
  if (!previousSnapshot) {
    return 'neutral';
  }

  let positiveSignals = 0;
  let negativeSignals = 0;

  // Compare views
  if (currentSnapshot.views !== null && previousSnapshot.views !== null) {
    const viewsChange = currentSnapshot.views - previousSnapshot.views;
    if (viewsChange > 0) positiveSignals++;
    else if (viewsChange < 0) negativeSignals++;
  }

  // Compare likes  
  if (currentSnapshot.likes !== null && previousSnapshot.likes !== null) {
    const likesChange = currentSnapshot.likes - previousSnapshot.likes;
    if (likesChange > 0) positiveSignals++;
    else if (likesChange < 0) negativeSignals++;
  }

  // Compare comments
  if (currentSnapshot.comments !== null && previousSnapshot.comments !== null) {
    const commentsChange = currentSnapshot.comments - previousSnapshot.comments;
    if (commentsChange > 0) positiveSignals++;
    else if (commentsChange < 0) negativeSignals++;
  }

  // Compare shares
  if (currentSnapshot.shares !== null && previousSnapshot.shares !== null) {
    const sharesChange = currentSnapshot.shares - previousSnapshot.shares;
    if (sharesChange > 0) positiveSignals++;
    else if (sharesChange < 0) negativeSignals++;
  }

  // Determine overall signal
  if (positiveSignals > negativeSignals) {
    return 'positive';
  } else if (negativeSignals > positiveSignals) {
    return 'negative';
  }

  return 'neutral';
}
