"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { format } from "date-fns"
import { useDayPicker } from "react-day-picker"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 bg-[#0A0A0A] border border-white/10 rounded-md shadow-md", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                table: "w-full border-collapse space-y-1",
                head_row: "",
                head_cell:
                    "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
                row: "w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-[var(--color-primary)] hover:text-white"
                ),
                range_end: "day-range-end",
                selected:
                    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] hover:text-white focus:bg-[var(--color-primary)] focus:text-white",
                today: "text-[var(--color-primary)] font-bold bg-white/5 disabled:text-[var(--color-primary)]/50",
                outside:
                    "day-outside text-neutral-600 opacity-50 aria-selected:bg-white/5 aria-selected:text-neutral-500 aria-selected:opacity-30",
                disabled: "text-neutral-600 opacity-50",
                range_middle:
                    "aria-selected:bg-white/5 aria-selected:text-white",
                hidden: "invisible",
                nav: "hidden", // Hide default nav

                // v9 Aliases
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "",
                weekday: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",

                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...props }) => {
                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4" {...props} />;
                },
                CaptionLabel: ({ ...props }: any) => {
                    const { goToMonth, nextMonth, previousMonth } = useDayPicker();
                    return (
                        <div className="flex items-center justify-center space-x-4 pt-1 pb-4">
                            <button
                                type="button"
                                onClick={() => previousMonth && goToMonth(previousMonth)}
                                disabled={!previousMonth}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/10 text-white hover:bg-white/10"
                                )}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-white">
                                {format(props.children ?? props.calendarMonth?.date, "MMMM yyyy")}
                            </span>
                            <button
                                type="button"
                                onClick={() => nextMonth && goToMonth(nextMonth)}
                                disabled={!nextMonth}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/10 text-white hover:bg-white/10"
                                )}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    );
                }
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
