import { GenCatalogTypesService } from './gen/catalog-types.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql'
import { CatalogTypes } from './../../entities/CatalogTypes'
import { CatalogTypesOverload } from './../../entities/CatalogTypesOverload'

@Injectable()
export class CatalogTypesService extends GenCatalogTypesService {
	
	async findRoot(catalog: number, emt: EntityManager) {
		return await this.getEm(emt).findOne(CatalogTypes, {
			catalog: catalog,
			parent: { $eq: null }
		});
  }

  async findChildren(parent: number, emt: EntityManager) {
		return await this.getEm(emt).find(CatalogTypes, {
			parent: parent
		});
  }

  async hasChildren(parent: number, emt: EntityManager) {
	  const children = await this.getEm(emt).find(CatalogTypes, {
			parent: parent
		}, {
			limit: 1
		});
		return children.length>0;
  }

	async readTree(treeRoot, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qb = em.createQueryBuilder(CatalogTypesOverload, 'o')
							.join('o.child', 'ch')
							.select('ch.*')
							.orderBy({ delta: 'ASC', "ch.title": 'ASC' })
							.where('o.delta>0 AND o.parent = ?', [treeRoot.id]);
		console.log(qb.getQuery());
		const tree = {
						id: treeRoot.id,
						title: treeRoot.title,
						children: []
					},
					dict = {},
					list = await conn.execute(qb.getKnexQuery());
		dict[treeRoot.id] = tree;
		for(let item of list){
			dict[item.id] = {
				id: item.id,
				title: item.title,
				children: []
			};
			dict[item.parent].children.push(dict[item.id]);
		}
		return tree;
	}
	
}