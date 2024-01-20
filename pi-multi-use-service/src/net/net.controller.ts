import { Body, Controller, Post } from '@nestjs/common';
import { WolDto } from 'src/dto/wol-dto';
import { NetService } from './net.service';

@Controller('/api/v1/net')
export class NetController {

    constructor(private netService: NetService) {
    }

    @Post('wol')
    wakeOnLan(@Body() wolDto: WolDto) {
        this.netService.wakeOnLan(wolDto);
    }

}
