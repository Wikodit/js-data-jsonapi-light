export const ERROR = {
  "FORCE_STORE_OPTION": "JsonApiAdapter needs to be given a store option.",
  "PREVENT_SERIALIZE_DESERIALIZE_OPTIONS": "You can not use deserialize and serialize options with this adapter, you should instead provide an afterSerialize, a beforeSerialize, an afterDeserialize or a beforeDeserialize.",
  NO_BATCH_CREATE: 'JSONApi doesn\'t support creating in batch.',
  NO_BATCH_UPDATE: 'JSONApi doesn\'t support updating in batch.',
  NO_BATCH_DESTROY: 'JSONApi doesn\'t support destroying in batch.'
};

export const WARNING = {
  NO_RESSOURCE: (type:string) => { return `Can\'t find resource '${type}'` },
  RELATION_UNKNOWN: 'Unknown relation',
  WRONG_RELATION_ARRAY_EXPECTED: 'Wrong relation somewhere, array expected',
  WRONG_RELATION_OBJECT_EXPECTED: 'Wrong relation somewhere, object expected'
}