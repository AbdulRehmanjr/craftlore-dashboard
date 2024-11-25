'use client'
import React, { type FC, memo, useMemo } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { cn } from '~/lib/utils';

interface DateTemplateProps {
    date: Dayjs;
    roomId: string;
    planCode: string;
    subRateId: string;
    hotelId: string;
    occupancy: number
    subPrices: {
        startDate: string;
        endDate: string;
        price: number;
        planCode: string;
    }[];
    className?: string;
    isInRange: (date: Dayjs, roomId: string, planCode: string, occupancy: number) => boolean;
    onDateClick: (date: Dayjs, roomId: string, subRateId: string, planCode: string, hotelId: string, occupancy: number) => void;
}

export const PriceDateTemplate: FC<DateTemplateProps> = memo(({
    date,
    roomId,
    planCode,
    subRateId,
    hotelId,
    subPrices,
    occupancy,
    className,
    isInRange,
    onDateClick
}) => {
    const isSelected = isInRange(date, roomId, planCode, occupancy);

    const price = useMemo(() => {
        if (!dayjs.isDayjs(date) || !Array.isArray(subPrices)) {
            return 0;
        }

        const validEntries = subPrices
            .filter((entry) => {
                if (
                    !entry.startDate ||
                    !entry.endDate ||
                    typeof entry.price !== "number"
                ) {
                    console.warn("Invalid price entry:", entry);
                    return false;
                }
                const start = dayjs(entry.startDate);
                const end = dayjs(entry.endDate);
                if (start.isAfter(end)) {
                    console.warn("Invalid date range:", entry);
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                const durationA = dayjs(a.endDate).diff(dayjs(a.startDate));
                const durationB = dayjs(b.endDate).diff(dayjs(b.startDate));
                return durationA - durationB;
            });

        for (const entry of validEntries) {
            const entryStartDate = dayjs(entry.startDate);
            const entryEndDate = dayjs(entry.endDate);

            if (date.isBetween(entryStartDate, entryEndDate, "day", "[]")) {
                return entry.price;
            }
        }

        return 0;
    }, [date, subPrices]);

    return (
        <button
            type="button"
            className={cn(
                "flex flex-col items-center justify-center border-[1px] p-0.5 text-center text-[10px] hover:cursor-pointer sm:text-xs",
                isSelected && "bg-primary text-white",
                className
            )}
            onClick={() => onDateClick(date, roomId, subRateId, planCode, hotelId, occupancy)}
        >
            <span>{price ?? 0} €</span>
        </button>
    );
});

PriceDateTemplate.displayName = 'PriceDateTemplate';