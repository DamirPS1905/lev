import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

	getCatalog(id): object {
		return {id: id};
	}
}
