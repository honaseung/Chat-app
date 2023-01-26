export default function useCreateRequest(
  databaseType,
  actionType,
  collectionType,
  inputParams,
  condition,
  sucCallback,
  failCallback
) {
  return [
    {
      databaseType,
      actionType,
      collectionType,
      inputParams,
      condition,
    },
    sucCallback,
    failCallback,
  ];
}
