export default function useCreateRequest(
  databaseType,
  actionType,
  collectionType,
  inputParams,
  callback,
  condition = null
) {
  return [
    {
      databaseType,
      actionType,
      collectionType,
      inputParams,
    },
    callback,
    condition,
  ];
}
