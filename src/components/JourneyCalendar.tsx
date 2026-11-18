import { useCallback } from "react";
import { DayPicker as PersianPicker, faIR } from "@daypicker/persian";
import {
  DayPicker as GregorianPicker,
  DayButton,
  type DayButtonProps,
} from "@daypicker/react";
import "@daypicker/react/style.css";
import {
  dayKey,
  type Locale,
  type Habit,
  type Completion,
} from "../model/habits";

type Props = {
  locale: Locale;
  selected: Date;
  onSelect: (date: Date) => void;
  completedDates: Date[];
  completions: Completion[];
  habits: Habit[];
};

export default function JourneyCalendar({
  locale,
  selected,
  onSelect,
  completedDates,
  completions,
  habits,
}: Props) {
  const StampedDay = useCallback(
    (props: DayButtonProps) => {
      const entries = completions.filter(
        (item) => item.dayKey === dayKey(props.day.date),
      );
      return (
        <DayButton
          {...props}
          aria-label={`${props["aria-label"] || ""}${entries.length ? ` · ${entries.length} ${locale === "fa" ? "عادت انجام شده" : "habits completed"}` : ""}`}
        >
          <span>{props.children}</span>
          {entries.length > 0 && (
            <span className="calendar-stamps" aria-hidden="true">
              {entries.slice(0, 3).map((entry) => (
                <span key={entry.id}>
                  {habits.find((h) => h.id === entry.habitId)?.emoji || "🌱"}
                </span>
              ))}
            </span>
          )}
        </DayButton>
      );
    },
    [completions, habits, locale],
  );
  const props = {
    mode: "single" as const,
    selected,
    onSelect: (date: Date | undefined) => date && onSelect(date),
    modifiers: { completed: completedDates },
    components: { DayButton: StampedDay },
  };
  return locale === "fa" ? (
    <PersianPicker {...props} locale={faIR} dir="rtl" />
  ) : (
    <GregorianPicker {...props} />
  );
}
