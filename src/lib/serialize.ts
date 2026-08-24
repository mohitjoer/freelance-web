// Convert Mongo documents (Dates/ObjectIds) into plain JSON-safe objects for RSC props.
// Mirrors JSON.stringify semantics exactly (toJSON hooks, undefined dropped) without
// the slow re-serialization round-trip the JSON.parse(JSON.stringify(x)) pattern costs.
export function toPlain<T>(value: T): T {
  return convert(value) as T;
}

function convert(value: unknown): unknown {
  if (value === null || value === undefined) return value === undefined ? undefined : null;

  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return value;
    case "object":
      break;
    default:
      // Functions/symbols are dropped by JSON.stringify too
      return null;
  }

  // Honor toJSON hooks (ObjectId -> hex string, etc.), matching JSON.stringify
  const withToJSON = value as { toJSON?: () => unknown };
  if (typeof withToJSON.toJSON === "function") {
    return convert(withToJSON.toJSON());
  }

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map(convert);
  }

  const source = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(source)) {
    const converted = convert(source[key]);
    if (converted !== undefined) out[key] = converted;
  }
  return out;
}
