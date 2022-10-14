export interface ITransport {
    technical_details: string;
    weight: number;
    amount: number;
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
