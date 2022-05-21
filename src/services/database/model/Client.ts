import { IAddress, IContact } from "./Company";

export interface IClient {
    id?: number;
    name : string;
    details : string;
    gst : string[15];
    address : IAddress;
    contact : IContact[];
}