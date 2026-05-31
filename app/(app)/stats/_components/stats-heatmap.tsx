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

const HEATMAP_CELL =
  'size-3.5 shrink-0 rounded-[3px] sm:size-4 lg:size-[15px]';

function getMonday(date: dayjs.Dayjs): dayjs.Dayjs {
  const day = date.day();
  if (day === 0) return date.subtract(6, 'day');
  return date.subtract(day - 1, 'day');
}

function buildWeeks(today: dayjs.Dayjs): WeekData[] {
  const startOfRange = today.subtract(2, 'month').startOf('month');
  const endOfRange = today.endOf('month');

  const firstMonday = getMonday(startOfRange);
  const lastMonday = getMonday(endOfRange);
  const lastSunday = lastMonday.add(6, 'day');

  const weeks: WeekData[] = [];
  let currentMonday = firstMonday;

  while (
    currentMonday.isBefore(lastSunday) ||
    currentMonday.isSame(lastSunday)
  ) {
    weeks.push({
      dates: Array.from({ length: 7 }, (_, i) => currentMonday.add(i, 'day')),
    });
    currentMonday = currentMonday.add(7, 'day');
  }

  return weeks;
}

function getMonthLabelForWeek(
  week: WeekData,
  weekIndex: number,
  weeks: WeekData[],
): string | null {
  const firstOfMonth = week.dates.find((date) => date.date() === 1);
  if (firstOfMonth) {
    return MONTH_LABELS[firstOfMonth.month()];
  }

  if (weekIndex === 0) {
    return MONTH_LABELS[week.dates[0].month()];
  }

  const previousMonth = weeks[weekIndex - 1].dates[3].month();
  const currentMonth = week.dates[3].month();

  if (currentMonth !== previousMonth) {
    return MONTH_LABELS[currentMonth];
  }

  return null;
}

function HeatmapCell({
  date,
  dayData,
  startOfRange,
  today,
}: {
  date: dayjs.Dayjs;
  dayData: GetStats200ConsistencyByDay[string] | undefined;
  startOfRange: dayjs.Dayjs;
  today: dayjs.Dayjs;
}) {
  const isInRange =
    !date.isBefore(startOfRange, 'day') && !date.isAfter(today, 'day');

  if (!isInRange) {
    return (
      <div
        className={`${HEATMAP_CELL} bg-[#ebedf0] dark:bg-[#2d333b]`}
        aria-hidden='true'
      />
    );
  }

  if (dayData?.workoutDayCompleted) {
    return <div className={`${HEATMAP_CELL} bg-primary`} />;
  }

  if (dayData?.workoutDayStarted) {
    return <div className={`${HEATMAP_CELL} bg-primary/55`} />;
  }

  return <div className={`${HEATMAP_CELL} bg-[#ebedf0] dark:bg-[#2d333b]`} />;
}

export function StatsHeatmap({ consistencyByDay, today }: StatsHeatmapProps) {
  const weeks = buildWeeks(today);
  const startOfRange = today.subtract(2, 'month').startOf('month');

  return (
    <div className='relative w-full lg:mx-auto lg:max-w-3xl'>
      <div className='overflow-x-auto rounded-xl border border-border bg-background p-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-4 [&::-webkit-scrollbar]:hidden'>
        <div className='flex w-max min-w-full gap-2'>
          <div className='hidden shrink-0 flex-col gap-[3px] pt-[18px] sm:flex'>
            {WEEKDAY_LABELS.map((label, index) => (
              <div
                key={label}
                className='flex h-3.5 items-center sm:h-4 lg:h-[15px]'
              >
                {index % 2 === 0 ? (
                  <span className='w-7 font-heading text-[10px] text-muted-foreground'>
                    {label}
                  </span>
                ) : (
                  <span className='w-7' aria-hidden='true' />
                )}
              </div>
            ))}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex h-[14px] gap-[3px]'>
              {weeks.map((week, weekIndex) => {
                const weekKey = week.dates[0].format('YYYY-MM-DD');
                const monthLabel = getMonthLabelForWeek(week, weekIndex, weeks);

                return (
                  <div
                    key={`${weekKey}-label`}
                    className='relative w-3.5 shrink-0 sm:w-4 lg:w-[15px]'
                  >
                    {monthLabel && (
                      <span className='absolute left-0 top-0 whitespace-nowrap font-heading text-[10px] font-medium text-muted-foreground sm:text-[11px]'>
                        {monthLabel}
                      </span>
                    )}
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
                          startOfRange={startOfRange}
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
        className='pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end rounded-r-xl bg-linear-to-l from-background via-background/90 to-transparent pr-0.5 sm:hidden'
        aria-hidden='true'
      >
        <ChevronRight className='size-4 text-muted-foreground/60' />
      </div>

      <p className='mt-2 text-center font-heading text-xs text-muted-foreground sm:hidden'>
        Swipe to see history
      </p>
    </div>
  );
}
