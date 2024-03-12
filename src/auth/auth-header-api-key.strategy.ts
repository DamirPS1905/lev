import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ApiKeysService } from './../api/services/api-keys.service';
import Strategy from 'passport-headerapikey';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
	constructor(
		private readonly apiKeysService: ApiKeysService
	) {
		super({ header: 'X-API-KEY', prefix: '' },
		true,
		async (apiKey, done) => {
		  return this.validate(apiKey, done);
		});
	}
	
	public validate = async(apiKey: string, done: (error: Error, data) => {}) => {
		this.apiKeysService.findByKey(apiKey)
			.then(key => {
				if (key!==null && key.disposed===false) {
				  done(null, key);
				}else{
					done(new UnauthorizedException(), null);
				}
			}).catch(_ =>{
				done(new UnauthorizedException(), null);
			});
	}
}