export const encodeUrlParams = (path: string, params?: object) => {
  if (!params) return path;

  const encodedParams = new Map();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (!encodedParams.has(key)) encodedParams.set(key, []);
        encodedParams.get(key).push(val as string);
      });
    } else if (value && value !== 'null') {
      if (!encodedParams.has(key)) encodedParams.set(key, []);
      encodedParams.get(key).push(value as string);
    }
  }

  if (encodedParams.size === 0) return path;

  const queryPairs: string[] = [];
  encodedParams.forEach((values, key) => {
    values.forEach((value: string) =>
      queryPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    );
  });

  const paramsString = queryPairs.join('&');

  return `${path}?${paramsString}`;
};
