import { Injectable } from '@nestjs/common';
import { WolDto } from 'src/dto/wol-dto';

const wol = require('wol');

@Injectable()
export class NetService {

    wakeOnLan(wolDto: WolDto) {
        wol.wake(wolDto.macAddress, (err, res) => {
            console.info(`WOL magic packet sent, response=${res}`);
        });
    }

}
