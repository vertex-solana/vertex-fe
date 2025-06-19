export const isIdlV29 = (idl: any): boolean => {
  if (!("address" in idl)) {
    return true;
  }
  return false;
};
