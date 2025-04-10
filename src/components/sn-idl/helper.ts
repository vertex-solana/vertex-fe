export const isIdlV29 = (idl: any): boolean => {
  if (Object.values(idl).filter((v) => v === "name")) {
    return true;
  }
  return false;
};
