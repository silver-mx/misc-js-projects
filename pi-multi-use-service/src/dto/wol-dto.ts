import { IsNotEmpty, IsString } from "class-validator";

export class WolDto {
    @IsString()
    @IsNotEmpty()
    macAddress: string;
}
