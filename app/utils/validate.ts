import mongoose from "mongoose";

/**
 * Checks if the input is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string | undefined | null): boolean {
  return !!id && mongoose.Types.ObjectId.isValid(id);
}
