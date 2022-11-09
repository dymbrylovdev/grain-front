export interface ITransport {
    technical_details: string;
    weight: number;
    amount: number;
    loading: string;
    overload: string;
    nds: boolean;
    sidewall_height: string;
    cabin_height: string;
    length: string;
    name: string;
    available: boolean;
    location?: {
        lat: number;
        lng: number;
        country: string;
        province: string;
        city: string;
        street: string;
        text: string;
        house: string;
    };
}
