// src/services/task.query.service.ts
import mongoose from "mongoose";
import { Task } from "../models/Task";

type SortBy = "createdAt" | "dueDate" | "priority";
type Order = "asc" | "desc";

type OffsetMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

type CursorMeta = {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

type ServiceOk<T, M> = { status: 200; data: T; meta: M };
type ServiceBad = { status: 400; error: string };

export const buildFilters = (query: any) => {
  const filter: any = {
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  };

  if (query.projectId) filter.projectId = query.projectId;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  return filter;
};

export const buildSort = (sortBy?: SortBy, order?: Order) => {
  const field: SortBy = sortBy || "createdAt";
  const dir = order === "asc" ? 1 : -1;

  // ✅ stable ordering by adding _id as a tie-breaker
  return { [field]: dir, _id: dir } as Record<string, 1 | -1>;
};

/**
 * Cursor format (base64 JSON):
 * { v: <lastSortFieldValue>, id: <lastMongoId> }
 */
const encodeCursor = (obj: { v: any; id: string }) =>
  Buffer.from(JSON.stringify(obj)).toString("base64");

const decodeCursor = (cursor: string): { v: any; id: string } => {
  const raw = Buffer.from(cursor, "base64").toString("utf8");
  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid cursor");
  }
  if (!("v" in parsed) || typeof parsed.id !== "string") {
    throw new Error("Invalid cursor payload");
  }
  return parsed;
};

/** OFFSET pagination: page/limit */
export const getTasksOffset = async (
  query: any,
): Promise<ServiceOk<any[], OffsetMeta> | ServiceBad> => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isFinite(limit) || limit <= 0) {
    return { status: 400, error: "limit must be greater than 0" };
  }
  if (!Number.isFinite(page) || page <= 0) {
    return { status: 400, error: "page must be greater than 0" };
  }

  const filter = buildFilters(query);
  const sortBy: SortBy = (query.sortBy as SortBy) || "createdAt";
  const order: Order = (query.order as Order) || "desc";
  const sort = buildSort(sortBy, order);

  const total = await Task.countDocuments(filter);
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  // edge: page beyond total pages -> empty slice
  if (totalPages > 0 && page > totalPages) {
    return {
      status: 200,
      data: [],
      meta: { total, page, limit, totalPages, hasMore: false },
    };
  }

  const skip = (page - 1) * limit;
  const data = await Task.find(filter).sort(sort).skip(skip).limit(limit);

  const hasMore = page < totalPages;

  return {
    status: 200,
    data,
    meta: { total, page, limit, totalPages, hasMore },
  };
};

/**
 * CURSOR pagination: cursor/limit
 * ✅ Correct even when sorting by createdAt / dueDate / priority
 * Cursor follows the SAME sort field + _id tie-breaker.
 */
export const getTasksCursor = async (
  query: any,
): Promise<ServiceOk<any[], CursorMeta> | ServiceBad> => {
  const limit = Number(query.limit ?? 10);

  if (!Number.isFinite(limit) || limit <= 0) {
    return { status: 400, error: "limit must be greater than 0" };
  }

  const sortBy: SortBy = (query.sortBy as SortBy) || "createdAt";
  const order: Order = (query.order as Order) || "desc";
  const dir = order === "asc" ? 1 : -1;

  const filter = buildFilters(query);
  const sort = buildSort(sortBy, order);

  if (query.cursor) {
    let decoded: { v: any; id: string };

    try {
      decoded = decodeCursor(String(query.cursor));
    } catch {
      return { status: 400, error: "Invalid cursor" };
    }

    const { v, id } = decoded;

    if (!mongoose.isValidObjectId(id)) {
      return { status: 400, error: "Invalid cursor id" };
    }

    const cursorId = new mongoose.Types.ObjectId(id);
    const op = dir === 1 ? "$gt" : "$lt";

    // ASC:
    //   (field > v) OR (field == v AND _id > id)
    // DESC:
    //   (field < v) OR (field == v AND _id < id)
    filter.$or = [
      { [sortBy]: { [op]: v } },
      { [sortBy]: v, _id: { [op]: cursorId } },
    ];
  }

  const data = await Task.find(filter)
    .sort(sort)
    .limit(limit + 1);

  const hasMore = data.length > limit;
  if (hasMore) data.pop();

  const last = data.length ? data[data.length - 1] : null;

  const nextCursor = last
    ? encodeCursor({
        v: (last as any)[sortBy],
        id: last._id.toString(),
      })
    : null;

  return {
    status: 200,
    data,
    meta: { nextCursor, hasMore, limit },
  };
};
