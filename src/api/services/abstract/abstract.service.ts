import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilesService } from './../special/files.service'

@Injectable()
export abstract class AService {
	
	constructor(
		protected readonly em: EntityManager,
		protected readonly fm: FilesService,
	){}

	getEm(emt: EntityManager = null){
		return emt || this.em.fork();
	}

	async transactional(cb){
		const em = this.em.fork(),
					patch = this.fm.getPatch();
		await em.begin();
		let result = undefined;
		try{
			result = await cb(em, patch);
			await em.commit();
			await patch.commit();
			return result;
		}catch(e){
			await em.rollback();
			await patch.rollback();
			throw e;
		}
	}

}