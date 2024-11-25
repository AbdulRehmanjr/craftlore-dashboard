import { type Dayjs } from 'dayjs'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DateRangeProps = {
    roomId: string
    hotelId: string
    subRateId: string
    rateCode: string
    occupancy:number
    startDate: Dayjs | null
    endDate: Dayjs | null
}

interface PriceState {
    priceDate: DateRangeProps
    priceDialog: boolean
    setPriceDialog: (open: boolean) => void
    setPriceDate: (priceDate: Partial<DateRangeProps>) => void
    clearCalendarStore: () => void
}

const initialStore = {
    priceDate: { roomId: 'none', hotelId: 'none', rateCode: 'none', subRateId: "none", occupancy:0,startDate: null, endDate: null },
    priceDialog: false,
}



export const usePrice = create<PriceState>()(
    persist(
        (set) => ({
            ...initialStore,
            setPriceDate: (priceDate) => set((state) => ({ priceDate: { ...state.priceDate, ...priceDate } })),
            setPriceDialog: (open) => set({ priceDialog: open }),
            clearCalendarStore: () => set(initialStore),
        }),
        {
            name: 'KOLIBRI-PRICE-DATE',
        }
    )
)


