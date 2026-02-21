import { isInt } from 'neo4j-driver';

export const toNum = (value: any, defaultValue = 0): number => {
  if (value === undefined || value === null) return defaultValue;

  if (typeof value === 'number') return value;

  if (isInt(value)) {
    return value.toNumber();
  }

  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const transformNeo4jTypes = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return isInt(obj) ? obj.toNumber() : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformNeo4jTypes);
  }

  const transformed: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (isInt(value)) {
        transformed[key] = value.toNumber();
      } else if (
        value &&
        typeof value === 'object' &&
        !(value instanceof Date)
      ) {
        transformed[key] = transformNeo4jTypes(value);
      } else {
        transformed[key] = value;
      }
    }
  }
  return transformed;
};
