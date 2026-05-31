import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import type { GetStats200ConsistencyByDay } from '@/app/_lib/api/fetch-generated';

interface StatsHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
  today: dayjs.Dayjs;
}

interface WeekData {
  dates: dayjs.Dayjs[];
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CELL =
  'size-[11px] shrink-0 rounded-[2px] sm:size-3 lg:size-[13px] xl:size-[14px]';

const CELL_EMPTY = 'bg-[#d8dee4] dark:bg-[#30363d]';

function getMonday(date: dayjs.Dayjs): dayjs.Dayjs {
  const day = date.day();
  if (day === 0) return date.subtract(6, 'day');
  return date.subtract(day - 1, 'day');
}

function buildYearWeeks(today: dayjs.Dayjs): WeekData[] {
  const startOfYear = today.startOf('year');
  const endOfYear = today.endOf('year');

  const firstMonday = getMonday(startOfYear);
  const lastMonday = getMonday(endOfYear);
  const lastSunday = lastMonday.add(6, 'day');

  const weeks: WeekData[] = [];
  let currentMonday = firstMonday;

  while (
    currentMonday.isBefore(lastSunday) ||
    currentMonday.isSame(lastSunday, 'day')
  ) {
    weeks.push({
      dates: Array.from({ length: 7 }, (_, i) => currentMonday.add(i, 'day')),
    });
    currentMonday = currentMonday.add(7, 'day');
  }

  return weeks;
}

function buildMonthLabels(weeks: WeekData[]): (string | null)[] {
  const shownMonths = new Set<string>();

  return weeks.map((week, weekIndex) => {
    const dayOne = week.dates.find((date) => date.date() === 1);

    if (dayOne) {
      const key = dayOne.format('YYYY-MM');
      if (shownMonths.has(key)) return null;
      shownMonths.add(key);
      return MONTH_LABELS[dayOne.month()];
    }

    if (weekIndex === 0) {
      const key = week.dates[0].format('YYYY-MM');
      if (shownMonths.has(key)) return null;
      shownMonths.add(key);
      return MONTH_LABELS[week.dates[0].month()];
    }

    return null;
  });
}

function HeatmapCell({
  date,
  dayData,
  yearStart,
  today,
}: {
  date: dayjs.Dayjs;
  dayData: GetStats200ConsistencyByDay[string] | undefined;
  yearStart: dayjs.Dayjs;
  today: dayjs.Dayjs;
}) {
  const yearEnd = yearStart.endOf('year');
  const isTrackableDay =
    !date.isBefore(yearStart, 'day') &&
    !date.isAfter(yearEnd, 'day') &&
    !date.isAfter(today, 'day');

  if (!isTrackableDay) {
    return <div className={`${CELL} ${CELL_EMPTY}`} aria-hidden='true' />;
  }

  if (dayData?.workoutDayCompleted) {
    return <div className={`${CELL} bg-primary`} />;
  }

  if (dayData?.workoutDayStarted) {
    return <div className={`${CELL} bg-primary/60`} />;
  }

  return <div className={`${CELL} ${CELL_EMPTY}`} />;
}

export function StatsHeatmap({ consistencyByDay, today }: StatsHeatmapProps) {
  const weeks = buildYearWeeks(today);
  const monthLabels = buildMonthLabels(weeks);
  const yearStart = today.startOf('year');

  return (
    <div className='relative w-full'>
      <div className='overflow-x-auto rounded-xl border border-border bg-background p-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-4 lg:overflow-x-auto [&::-webkit-scrollbar]:hidden'>
        <div className='inline-flex gap-2'>
          <div className='hidden shrink-0 flex-col gap-[3px] pt-4 sm:flex'>
            {WEEKDAY_LABELS.map((label, index) => (
              <div
                key={label}
                className='flex h-[11px] items-center sm:h-3 lg:h-[13px] xl:h-[14px]'
              >
                {index % 2 === 0 ? (
                  <span className='w-7 font-heading text-[10px] leading-none text-muted-foreground'>
                    {label}
                  </span>
                ) : (
                  <span className='w-7' aria-hidden='true' />
                )}
              </div>
            ))}
          </div>

          <div className='shrink-0'>
            <div className='mb-1 flex h-4 gap-[3px]'>
              {weeks.map((week, weekIndex) => {
                const weekKey = week.dates[0].format('YYYY-MM-DD');
                const monthLabel = monthLabels[weekIndex];

                return (
                  <div
                    key={`${weekKey}-label`}
                    className='relative w-[11px] shrink-0 sm:w-3 lg:w-[13px] xl:w-[14px]'
                  >
                    {monthLabel ? (
                      <span className='absolute left-0 top-0 font-heading text-[10px] font-medium leading-none text-muted-foreground'>
                        {monthLabel}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className='flex gap-[3px]'>
              {weeks.map((week) => {
                const weekKey = week.dates[0].format('YYYY-MM-DD');

                return (
                  <div key={weekKey} className='flex flex-col gap-[3px]'>
                    {week.dates.map((date) => {
                      const dateStr = date.format('YYYY-MM-DD');
                      const dayData = consistencyByDay[dateStr];

                      return (
                        <HeatmapCell
                          key={dateStr}
                          date={date}
                          dayData={dayData}
                          yearStart={yearStart}
                          today={today}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className='pointer-events-none absolute inset-y-0 right-0 flex w-8 items-center justify-end rounded-r-xl bg-linear-to-l from-background via-background/95 to-transparent sm:hidden'
        aria-hidden='true'
      >
        <ChevronRight className='size-4 text-muted-foreground/70' />
      </div>

      <p className='mt-2 text-center font-heading text-xs text-muted-foreground sm:hidden'>
        Swipe to see history
      </p>
    </div>
  );
}
