export function mapperCacheRelationByField (mapper:any):void {
  if (!mapper.relationByField || !mapper.relationByFieldId) {
    mapper.relationByField = {};
    mapper.relationByFieldId = {};
    for (let i = 0, l = (mapper.relationList || []).length; i < l; i++ ) {
      let field:string = mapper.relationList[i].localField;

      if (mapper.relationList[i].type === 'belongsTo) {
        let key:string = mapper.relationList[i].foreignKey;
        if (!relation.foreignKey) {
          this.warn(WARNING.NO_FOREIGN_KEY, relation);
        } else {
          mapper.relationByFieldId[key] = mapper.relationList[i];
        }
      }

      if (field) {
        mapper.relationByField[field] = mapper.relationList[i];
      } else {
        this.warn('localField missing'); continue;
      }
    }
  }
}