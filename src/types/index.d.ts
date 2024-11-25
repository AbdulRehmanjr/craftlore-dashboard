type AccountTypeProps = 'NORMAL' | 'ADVANCE'

type AccountProps = {
    email: string;
    password: string;
    accountId: string;
    accountType: AccountTypeProps;
    createdAt: Date;
    udpatedAt: Date;
}

type RoomProps = {
    roomId: string
    code: string
    roomName: string
    capacity: number
    area: number
    features: string[]
    description: string
    roomType: string
    dp: string
    beds: number
    quantity: number
    price: number
    pictures: string[]
    hotelId: string
    isActive: boolean
    minimumstay: number
}

type RoomDetailProps = {
    roomId: string
    code: string
    roomName: string
    capacity: number
    area: number
    features: string[]
    description: string
    roomType: string
    dp: string
    beds: number
    quantity: number
    price: number
    pictures: string[]
    hotelId: string
    isActive: boolean
    hotel: {
        hotelId: string
        hotelName: string
        location: string
        manager: string
        createdAt: Date
        accountId: string
        island: string
    }
}

type RoomTableProps = {
    roomId: string
    roomName: string
    capacity: number
    area: number
    beds: number
    code: string
    features: string[]
    pictures: string[]
    dp: string
    quantity: number
    hotelId: string
    description: string
    roomType: string
    isActive: boolean
    minimumstay: number
    hotel: {
        hotelName: string;
        hotelId: string;
        island: string
        phone: string
        code: string
        accountId: string;
    };
}

type PriceProps = {
    priceId: string
    startDate: string
    endDate: string
    planCode: string
    price: number
    rrpId: string
}

type RatePriceProps = {
    rrpId: string
    rateId: string
    roomId: string
    occupancy: number
    hotelName: string
    hotelId: string
    RoomPrice: {
        startDate: string
        endDate: string
        price: number
        planCode: string
    }[]
    room: {
        roomId: string
        roomName: string
        quantity: number
    }
    rate: {
        ratePlanId: string
        name: string
        code: string
    }
}

type GroupedRatePriceProps = {
    roomId: string
    roomName: string
    occupancy: number
    rates: {
        rrpId: string
        rateId: string
        roomId: string
        occupancy: number
        hotelName: string
        hotelId: string
        RoomPrice: {
            startDate: string
            endDate: string
            price: number
            planCode: string
        }[]
        rate: {
            ratePlanId: string
            name: string
            code: string
        }
    }[]
}

type FilteredPricesProps = {
    rrpId: string;
    rateId: string;
    roomId: string;
    occupancy: number;
    hotelName: string;
    hotelId: string;
    RoomPrice: {
        startDate: string;
        endDate: string;
        price: number;
        planCode: string;
    }[];
}

type BookingProps = {
    bookingId: string
    startDate: string
    endDate: string
    price: string
    mealType: string
    status: boolean
    isRefund: boolean
    paymentEmail: string
    captureId: string
    payerId: string
    paymentId: string
    roomId: string
    bookingDetailId: string
}

type BookingInfoProps = {
    bookingDetailId: string
    city: string
    country: string
    phone: string
    zip: string
    address: string
    firstName: string
    lastName: string
    email: string
    arrivalTime: string
}

type BookingTableProps = {
    bookingId: string
    startDate: string
    endDate: string
    price: number
    adults: number
    children: number
    isRefund: boolean
    type: string
    mealType: string
    createdAt: Date
    payPalBookingId: string | null
    bookingDetailId: string
    bookingDetails: {
        bookingDetailId: string
        firstName: string
        lastName: string
        email: string
        status: string
        bookingReservationId: string
    }
    Room: {
        roomId: string
        roomName: string
    }
    PayPalBooking: {
        paymentId: string
    } | null

}

type RoomBookingDetailProps = {
    bookingId: string
    startDate: string
    endDate: string
    price: number
    isRefund: boolean
    type: string
    payPalBookingId: string | null
    roomId: string
    bookingDetailId: string
    mealType: string
    quantity: number
    adults: number
    children: number
    createdAt: Date
    bookingDetails: {
        bookingDetailId: string
        city: string
        country: string
        phone: string
        zip: string
        address: string
        firstName: string
        lastName: string
        email: string
        arrivalTime: string
        status: string
        additionalInfo: string
    }
    Room: {
        roomId: string
        roomName: string
        hotelId: string
        roomType: string
        hotel: {
            hotelName: string
            island: string
            phone: string
            hotelLogo: string
        }
    }
    PayPalBooking: {
        paypalBookingId: string
        paymentId: string
    } | null
}

type BookingDetailProps = {
    bookingDetailId: string
    city: string
    country: string
    phone: string
    zip: string
    address: string
    firstName: string
    lastName: string
    email: string
    arrivalTime: string
    bookingReservationId: string
    additionalInfo: string
    dob: string
    status: string
    RoomBooking: {
        bookingId: string
        startDate: string
        endDate: string
        price: number
        isRefund: boolean
        type: string
        payPalBookingId: string | null
        roomId: string
        bookingDetailId: string
        mealType: string
        quantity: number
        adults: number
        children: number
        ratePlan: string
        extras: string[]
        Room: {
            roomId: string
            roomName: string
            hotelId: string
            roomType: string
            hotel: {
                hotelName: string
                island: string
                phone: string
                hotelLogo: string
            }
        }
        PayPalBooking: {
            paypalBookingId: string
            paymentId: string
        } | null
    }[]
}

type HotelProps = {
    hotelId: string
    code: string
    hotelName: string
    hotelLogo: string
    hotelType: number
    island: string
    address: string
    longitude: number
    latitude: number
    description: string
    firstName: string
    lastName: string
    email: string
    phone: string
    checkIn: string
    checkOut: string
    boards: string[]
    budget: number
    rooms: number
    occupancy: number
    images: string[]
    features: string[]
    createdAt: Date
    updatedAt: Date
    accountId: string
}


type RatePlanProps = {
    ratePlanId: string
    code: string
    name: string
    description: string
    isActive: boolean
    mealId: number
    hotelId: string
}

type RatePlanDetailProps = {
    ratePlanId: string
    code: string
    name: string
    description: string
    isActive: boolean
    mealId: number
    hotelId: string
    hotel: {
        hotelId: string
        code: string
        hotelName: string
        accountId: string
    }
}

type StatusProps = {
    primaryEmail: boolean
    amountReceivable: boolean
}

type GoogleTokenProp = {
    access_token: string
    refresh_token: string
    scope: string
    token_type: string
    expiry_date: number
}

type BlockDateProps = {
    blockId: string
    dates: string[]
    roomId: string
}

type DiscountProps = {
    discountId: string
    discount: number
    title: string
    startDate: string
    endDate: string
    createdAt: Date
    redeemCode: string
}


type ResultEntry = {
    roomId: string;
    roomName: string;
    quantity: number
    hotelName: string;
    hotelId: string;
    ratePlans: {
        planCode: string;
        planName: string;
        prices: {
            date: string;
            price: number;
        }[];
    }[];
};

type SUErrorProps = {
    Errors: Array<{
        Code: string;
        ShortText: string;
    }>;
    Status: 'Fail';
};

type BookingPreviewProps = {
    type: string;
    Room: {
        hotel: {
            hotelName: string;
        };
        roomName: string;
        roomType: string;
    };
    startDate: string;
    endDate: string;
    mealType: string;
    bookingId: string;
    price: number
    adults: number;
    children: number;
    bookingDetails: {
        bookingDetailId: string
        firstName: string;
        email: string
        country: string
    };
};

type ExtrasProps = {
    extrasId: string
    name: string
    price: number
    createdAt: Date
    hotelId: string
}

type ExtrasDetailProps = {
    extrasId: string
    name: string
    price: number
    createdAt: Date
    hotelId: string
    hotel: {
        hotelName: string
    }
}

type SuTokenProps = {
    Status: string
    Data: {
        token_id: string
        proppmsid: string
        channel_codes: [{
            channel_code: string
            encrypted_channel_code: string
        }]
    }
    Message: string

}

type MealPlanTypeProps = {
    code: number;
    name: string;
};

type SuReservationProps = {
    reservations: SuReservationItemProps[];
}

type SuReservationItemProps = {
    booked_at: string;
    commissionamount: string;
    currencycode: string;
    paymenttype: string;
    hotel_id: string;
    hotel_name: string;
    paymentdue: string;
    customer: SuCustomerProps;
    rooms: SuRoomProps[];
    affiliation: SuAffiliationProps;
    chain_id: string;
    external_id: string;
    otadue: string;
    cancelreason: string;
    sellamount: string;
    nettamount: string;
    discount: string;
    confirmationlink: string;
    payment_charge: string;
    channel_booking_id: string;
    thread_id: string;
    guest_id: string;
    numberofpets: string;
    numberofinfants: string;
    listingbaseprice: string;
    processed_at: string;
    bookingcharged: string;
    amountcharged: string;
    pgtransactionid: string;
    su_payments: SuPaymentsProps;
    deposit: string;
    cvv_available: string;
    source: string;
    pg_refid: string;
    pg_type: string;
    cancellation_fee: string;
    vendor_booking_id: string;
    id: string;
    reservation_notif_id: string;
    modified_at: string;
    status: string;
    totalprice: string;
    totaltax: string;
    extrafees: SuExtraFeeProps[];
    taxes: SuTaxProps[];
}

type SuTaxProps = {
    name: string
    amount: string
}
type SuExtraFeeProps = {
    name: string
    amount: string
}

type SuCustomerProps = {
    corporate_booking_detail: SuCorporateBookingDetailProps;
    address: string;
    cc_cvc: string;
    cc_expiration_date: string;
    cc_name: string;
    cc_number: string;
    cc_type: string;
    cc_current_balance: string;
    cc_activation_date: string;
    vcc_expiration_date: string;
    cc_token: string;
    cc_token_expiration: string;
    cc_unique_code: string;
    city: string;
    state: string;
    countrycode: string;
    email: string;
    first_name: string;
    last_name: string;
    remarks: string;
    telephone: string;
    zip: string;
    cc_vault_token: string;
    cc_tracking_id: string;
    tokensource: string;
    tokentype: string;
    token_id: string;
    cc_virtual: string;
}

type SuCorporateBookingDetailProps = {
    booking_source: string;
    tax_id: string;
    billing_company: string;
    billing_address: string;
    payment_information: string;
    payment_due_date: string;
    booker_address: string;
    booker_taxid: string;
    booking_type: string;
}

type SuRoomProps = {
    arrival_date: string;
    departure_date: string;
    info: string;
    facilities: string;
    taxes: [];
    specialrequest: string;
    eta: string;
    guest_name: string;
    first_name: string;
    last_name: string;
    id: string;
    max_children: string;
    numberofguests: string;
    numberofchildren: string;
    numberofadults: string;
    roomstaystatus: string;
    roomreservation_id: string;
    totalbeforetax: string;
    totaltax: string;
    totalprice: string;
    price: SuRoomPriceProps[];
    adults: string[];
    addons: SuAddonProps[];
    extracomponents: SuExtraComponentProps[];
}

type SuAddonProps = {
    name: string
    nights: string
    priceperunit: string
    pricemode: string
    price: string
    taxes: {
        name: string
        value: string
    }[]
}

type SuExtraComponentProps = {
    name: string
    value: string
}
type SuRoomPriceProps = {
    date: string;
    rate_id: string;
    mealplan_id: string;
    mealplan: string;
    tax: string;
    pricebeforetax: string;
    priceaftertax: string;
}

type SuAffiliationProps = {
    pos: string;
    source: string;
    OTA_Code: string;
    companyname: string;
    gstno: string;
    companyaddress: string;
}

type SuPaymentsProps = {
    action: string;
    tokenid: string;
    pgid: string;
}

type PayPalErrorProps = {
    error: string
    error_description: string
}

type MealPlanType = {
    code: number;
    name: string;
};

type FeatureProps = {
    label: string;
    value: string;
};

