export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Anchored, case-sensitive regex on a lowercase field -> can use the index. */
export const prefixRegex = (search: string) => new RegExp('^' + escapeRegex(search.trim().toLowerCase()));

export const pageMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

/** from/to are YYYY-MM-DD (UTC). `to` is inclusive, so we use an exclusive upper bound of the next day. */
export function dateRange(from?: string, to?: string): { $gte?: Date; $lt?: Date } | undefined {
  if (!from && !to) return undefined;
  const range: { $gte?: Date; $lt?: Date } = {};
  if (from) range.$gte = new Date(`${from}T00:00:00.000Z`);
  if (to) {
    const end = new Date(`${to}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    range.$lt = end;
  }
  return range;
}
