import { Injectable } from '@nestjs/common';
import { GenStoresService } from './gen/stores.service';

@Injectable()
export class StoresService extends GenStoresService {
  // extra code here...
}
