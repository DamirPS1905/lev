import { MikroORM } from '@mikro-orm/core';
import { EntityGenerator } from '@mikro-orm/entity-generator';

(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
      extensions: [EntityGenerator],
    },
    dbName: 'lev',
  });
  const dump = await orm.entityGenerator.generate({
    save: true,
    path: process.cwd() + '/entities',
  });
  console.log(dump);
  await orm.close(true);
})();