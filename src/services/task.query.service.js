"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksCursor = exports.getTasksOffset = exports.buildSort = exports.buildFilters = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Task_1 = require("../models/Task");
const buildFilters = (query) => {
    const filter = {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    };
    if (query.projectId)
        filter.projectId = query.projectId;
    if (query.status)
        filter.status = query.status;
    if (query.priority)
        filter.priority = query.priority;
    if (query.assignedTo)
        filter.assignedTo = query.assignedTo;
    return filter;
};
exports.buildFilters = buildFilters;
const buildSort = (sortBy, order) => {
    const field = sortBy || "createdAt";
    const dir = order === "asc" ? 1 : -1;
    // ✅ stable ordering by adding _id as a tie-breaker
    return { [field]: dir, _id: dir };
};
exports.buildSort = buildSort;
/**
 * Cursor format (base64 JSON):
 * { v: <lastSortFieldValue>, id: <lastMongoId> }
 */
const encodeCursor = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64");
const decodeCursor = (cursor) => {
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
const getTasksOffset = async (query) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    if (!Number.isFinite(limit) || limit <= 0) {
        return { status: 400, error: "limit must be greater than 0" };
    }
    if (!Number.isFinite(page) || page <= 0) {
        return { status: 400, error: "page must be greater than 0" };
    }
    const filter = (0, exports.buildFilters)(query);
    const sortBy = query.sortBy || "createdAt";
    const order = query.order || "desc";
    const sort = (0, exports.buildSort)(sortBy, order);
    const total = await Task_1.Task.countDocuments(filter);
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
    const data = await Task_1.Task.find(filter).sort(sort).skip(skip).limit(limit);
    const hasMore = page < totalPages;
    return {
        status: 200,
        data,
        meta: { total, page, limit, totalPages, hasMore },
    };
};
exports.getTasksOffset = getTasksOffset;
/**
 * CURSOR pagination: cursor/limit
 * ✅ Correct even when sorting by createdAt / dueDate / priority
 * Cursor follows the SAME sort field + _id tie-breaker.
 */
const getTasksCursor = async (query) => {
    const limit = Number(query.limit ?? 10);
    if (!Number.isFinite(limit) || limit <= 0) {
        return { status: 400, error: "limit must be greater than 0" };
    }
    const sortBy = query.sortBy || "createdAt";
    const order = query.order || "desc";
    const dir = order === "asc" ? 1 : -1;
    const filter = (0, exports.buildFilters)(query);
    const sort = (0, exports.buildSort)(sortBy, order);
    if (query.cursor) {
        let decoded;
        try {
            decoded = decodeCursor(String(query.cursor));
        }
        catch {
            return { status: 400, error: "Invalid cursor" };
        }
        const { v, id } = decoded;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return { status: 400, error: "Invalid cursor id" };
        }
        const cursorId = new mongoose_1.default.Types.ObjectId(id);
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
    const data = await Task_1.Task.find(filter)
        .sort(sort)
        .limit(limit + 1);
    const hasMore = data.length > limit;
    if (hasMore)
        data.pop();
    const last = data.length ? data[data.length - 1] : null;
    const nextCursor = last
        ? encodeCursor({
            v: last[sortBy],
            id: last._id.toString(),
        })
        : null;
    return {
        status: 200,
        data,
        meta: { nextCursor, hasMore, limit },
    };
};
exports.getTasksCursor = getTasksCursor;
