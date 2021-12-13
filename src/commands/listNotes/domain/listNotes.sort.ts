import { sortField } from '../../shared/itemsOperations/sorting';
import { TimeMarkWithDifference } from './listNotes.types';

type WithDateGaps = {
  gapBetweenDates: number;
};

export const sortNotesDifference = sortField<TimeMarkWithDifference, 'difference'>('ASC', 'difference');
export const sortNotesGapWithDate = sortField<WithDateGaps, 'gapBetweenDates'>('ASC', 'gapBetweenDates');
