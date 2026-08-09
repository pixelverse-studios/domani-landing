export type ReleaseFilter = 'all' | 'ios' | 'android' | 'feature' | 'improvement' | 'major-fixes';

interface FilterableNote {
  type: 'feature' | 'improvement' | 'fix' | 'breaking';
  platforms: Array<'ios' | 'android'>;
}

interface ReleaseTimeline {
  kind: 'released' | 'confirmed_date' | 'target_date' | 'target_month' | 'tbd';
  value: string | null;
}

export interface TimelineSummary {
  value: string;
  label: 'Released' | 'Scheduled date' | 'Target date' | 'Target month' | 'Timing';
}

export const PUBLIC_MARKDOWN_ELEMENTS = ['p', 'br', 'em', 'strong', 'code', 'ol', 'ul', 'li', 'a'];

const allowedAbsoluteLink = /^(?:https?:|mailto:)/i;
const externalHttpLink = /^https?:/i;

export const publicMarkdownUrlTransform = (url: string): string => {
  if (url.startsWith('#')) return url;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (allowedAbsoluteLink.test(url)) return url;
  return '';
};

export const publicMarkdownLinkRel = (href: string | undefined): string | undefined =>
  href && externalHttpLink.test(href) ? 'noopener noreferrer' : undefined;

export const filterReleaseNotes = <Note extends FilterableNote>(
  notes: Note[],
  filter: ReleaseFilter
): Note[] => {
  if (filter === 'all') return notes;
  if (filter === 'ios' || filter === 'android') {
    return notes.filter((note) => note.platforms.includes(filter));
  }
  if (filter === 'major-fixes') {
    return notes.filter((note) => note.type === 'fix' || note.type === 'breaking');
  }
  return notes.filter((note) => note.type === filter);
};

const utcDate = (value: string, includeDay: boolean): Date | null => {
  const pattern = includeDay ? /^(\d{4})-(\d{2})-(\d{2})/ : /^(\d{4})-(\d{2})$/;
  const match = value.match(pattern);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = includeDay ? Number(match[3]) : 1;
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

export const timelineSummary = (timeline: ReleaseTimeline | undefined): TimelineSummary => {
  if (!timeline?.value || timeline.kind === 'tbd') return { value: 'TBD', label: 'Timing' };

  const includesDay = timeline.kind !== 'target_month';
  const date = utcDate(timeline.value, includesDay);
  if (!date) return { value: 'TBD', label: 'Timing' };

  const value = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    ...(includesDay ? { day: 'numeric' as const } : {}),
    timeZone: 'UTC',
  }).format(date);

  const labels = {
    released: 'Released',
    confirmed_date: 'Scheduled date',
    target_date: 'Target date',
    target_month: 'Target month',
  } as const;

  return { value, label: labels[timeline.kind] };
};
