export function mapperCacheRelationByField (mapper:any):void {
  if (!mapper.relationByField || !mapper.relationByFieldId) {
    mapper.relationByField = {};
    mapper.relationByFieldId = {};
    for (let i = 0, l = (mapper.relationList || []).length; i < l; i++ ) {
      let field:string = mapper.relationList[i].localField;
      let key:string = mapper.relationList[i].localKey;

      if (key) {
        mapper.relationByFieldId[key] = mapper.relationList[i];
      }

      if (field) {
        mapper.relationByField[field] = mapper.relationList[i];
      } else {
        this.warn('localField missing'); continue;
      }
    }
  }
}