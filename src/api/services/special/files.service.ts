import { Injectable } from '@nestjs/common';
import { writeFile, rename, rm } from 'fs/promises';
import { createWriteStream, existsSync } from 'node:fs'
import { lookup, extension } from 'mime-types'

@Injectable()
export class FilesService{
	
	getPatch(): FsPatch{
		return new FsPatch();
	}
	
	public async transactional(cb){
		const patch = this.getPatch();
		try{
			await cb(patch);
			await patch.commit();
		}catch(e){
			await patch.rollback();
			throw e;
		}
	}
	
}

export class FsPatch{
	
	private changes = [];
	
	public async write(path: string, buffer: Buffer){
		if(existsSync(path)){
			await rename(path, path+'.bak');
			this.changes.unshift({type: 'backup', path: path});
		}
		await writeFile(path, buffer);
		this.changes.unshift({type: 'write', path: path});
	}
	
	public async delete(path: string){
		if(existsSync(path)){
			await rename(path, path+'.bak');
			this.changes.unshift({type: 'backup', path: path});
		}
	}
	
	public async commit(){
		for(let change of this.changes){
			if(change.type==='backup'){
				await rm(change.path+'.bak');
			}
		}
	}
	
	public async rollback(){
		for(let change of this.changes){
			switch(change.type){
				case 'backup':
					await rename(change.path+'.bak', change.path);
					break;
				case 'write':
					await rm(change.path);
					break;
			}
		}
	}
	
}