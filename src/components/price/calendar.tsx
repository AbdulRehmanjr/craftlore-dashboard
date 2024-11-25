"use client";

import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { ChevronDown, User } from "lucide-react";
import { PriceDateTemplate } from "~/components/price/date-template";
import { CreatePriceForm } from "~/components/price/creation";

import isBetween from "dayjs/plugin/isBetween";
import { usePrice } from "~/hooks/use-price";

dayjs.extend(isBetween);

export const CreatePriceCalendar = () => {
    const { priceDate, setPriceDate, setPriceDialog } = usePrice();
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [data] = api.price.getAllPrices.useSuspenseQuery();

    const currentMonth: Dayjs[] = useMemo(() => {
        const currentMonth = selectedDate.clone().startOf("month");
        const daysInMonth = currentMonth.daysInMonth();

        return Array.from({ length: daysInMonth }, (_, i) =>
            currentMonth.clone().date(i + 1),
        );
    }, [selectedDate]);

    const handlePreviousMonth = () => {
        setSelectedDate((prevDate) => prevDate.clone().subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setSelectedDate((prevDate) => prevDate.clone().add(1, "month"));
    };

    const handleDateClick = (
        date: Dayjs,
        roomId: string,
        subRateId: string,
        planCode: string,
        hotelId: string,
        occupancy: number
    ) => {
        if (priceDate.roomId !== roomId || priceDate.rateCode !== planCode || priceDate.occupancy !== occupancy)
            setPriceDate({
                rateCode: planCode,
                roomId: roomId,
                subRateId: subRateId,
                hotelId: hotelId,
                startDate: date,
                endDate: date,
                occupancy: occupancy
            });
        else if (priceDate.startDate === null)
            setPriceDate({ startDate: date, endDate: date });
        else if (!date.isBefore(priceDate.startDate, "day")) {
            setPriceDialog(true);
            setPriceDate({ endDate: date });
        } else
            setPriceDate({
                rateCode: "none",
                roomId: "none",
                subRateId: "none",
                hotelId: "none",
                occupancy: 0,
                startDate: null,
                endDate: null,
            });
    };

    const isInRange = (date: Dayjs, roomId: string, planCode: string, occupancy: number) => {
        if (
            priceDate.roomId !== roomId ||
            priceDate.rateCode !== planCode ||
            priceDate.occupancy !== occupancy ||
            !priceDate.startDate ||
            !priceDate.endDate
        )
            return false;
        return date.isBetween(priceDate.startDate, priceDate.endDate, "day", "[]");
    };

    return (
        <div className="flex h-full w-full flex-col gap-4 p-2 text-primary">
            <div className="mb-3 flex justify-start">
                <Button
                    type="button"
                    variant={"outline"}
                    onClick={() =>
                        setPriceDate({ startDate: null, endDate: null })
                    }
                >
                    Clear
                </Button>
            </div>
            <div className="mb-4 flex items-center justify-between">
                <Button type="button" onClick={handlePreviousMonth}>
                    Prev
                </Button>
                <p className="text-lg font-bold text-primary md:text-xl">
                    {selectedDate
                        ? selectedDate.format("MMMM YYYY")
                        : dayjs().format("MMMM YYYY")}
                </p>
                <Button type="button" onClick={handleNextMonth}>
                    Next
                </Button>
            </div>
            <div className="relative flex flex-grow flex-col overflow-auto">
                <div className="flex w-full bg-primary text-[8px] text-white sm:text-xs md:text-sm">
                    <div className="flex h-12 w-20 shrink-0 items-center justify-center border-[1px] sm:h-16 sm:w-24 md:h-20 md:w-32">
                        Rooms
                    </div>
                    {currentMonth.map((date, index) => (
                        <div
                            key={index}
                            className="flex h-12 w-6 shrink-0 flex-col items-center justify-center border-[1px] sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
                        >
                            <span>{weekdayNames[date.day()]}</span>
                            <span>{date.date()}</span>
                        </div>
                    ))}
                </div>

                {data.map((groupedRatePlan, index) => (
                    <Collapsible key={index}>
                        <CollapsibleTrigger className="w-full" asChild>
                            <div className="flex">
                                <div className="flex h-12 w-20 shrink-0 items-center justify-between border-[1px] bg-white p-2 sm:h-16 sm:w-24 md:h-20 md:w-32">
                                    <span className="text-[8px] font-semibold sm:text-[10px] md:text-xs">
                                        {groupedRatePlan.roomName}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                                {currentMonth.map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex h-12 w-6 shrink-0 items-center justify-center border-[1px] p-0.5 text-center text-[10px] hover:cursor-pointer sm:h-16 sm:w-8 sm:text-xs md:h-20 md:w-[2.75rem]"
                                    >
                                    </div>
                                ))}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {groupedRatePlan.rates.map((ratePlan, index) => (
                                <div key={`${index}-${ratePlan.rrpId}`} className="flex">
                                    <div className="flex h-12 w-20 shrink-0 flex-col items-start justify-center border-[1px] bg-white p-2 sm:h-16 sm:w-24 md:h-20 md:w-32">
                                        <span className="text-[8px] font-semibold sm:text-[10px] md:text-xs">
                                            {ratePlan.rate.name}
                                        </span>
                                        <span className="text-[6px] text-gray-500 sm:text-[8px] md:text-[10px]">
                                            {ratePlan.hotelName}
                                        </span>
                                        <span className="flex items-center text-[6px] text-gray-500 sm:text-[8px] md:text-[10px]">
                                            <User className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                            {ratePlan.occupancy}
                                        </span>
                                    </div>
                                    {currentMonth.map((date, index) => (
                                        <PriceDateTemplate
                                            key={index}
                                            date={date}
                                            roomId={ratePlan.roomId}
                                            occupancy={ratePlan.occupancy}
                                            planCode={ratePlan.rate.code}
                                            subRateId={ratePlan.rate.ratePlanId}
                                            hotelId={ratePlan.hotelId}
                                            subPrices={ratePlan.RoomPrice}
                                            className="h-12 w-6 shrink-0 sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
                                            isInRange={isInRange}
                                            onDateClick={handleDateClick}
                                        />
                                    ))}
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
            <div className="hidden">
                <CreatePriceForm />
            </div>
        </div>
    );
};
