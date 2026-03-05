/**
 * lib/types.ts — Shared types used across Globe and UI components.
 *
 * Keep this file minimal: only canonical shared types that would otherwise
 * be duplicated. Component-local types stay in their respective files.
 */

/**
 * Controls which optional globe layers are visible.
 * `zambezi` is optional (added Sprint A2; may not exist in stored state).
 */
export type LayerVisibility = {
  boundary: boolean;
  province: boolean;
  particles: boolean;
  zambezi?: boolean;
};
