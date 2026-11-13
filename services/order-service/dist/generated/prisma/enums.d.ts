export declare const OrderStatus: {
    readonly PENDING: 'PENDING';
    readonly CONFIRMED: 'CONFIRMED';
    readonly PROCESSING: 'PROCESSING';
    readonly SHIPPED: 'SHIPPED';
    readonly DELIVERED: 'DELIVERED';
    readonly CANCELLED: 'CANCELLED';
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentStatus: {
    readonly UNPAID: 'UNPAID';
    readonly PENDING: 'PENDING';
    readonly PAID: 'PAID';
    readonly FAILED: 'FAILED';
    readonly REFUNDED: 'REFUNDED';
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
