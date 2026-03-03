# MechHub Views

`src/views` is the view layer.

Rules:
- Files ending with `View` must stay pure presentation components.
- Do not fetch data, call services, or perform side effects in `*View` files.
- Pass state, derived values, and handlers into `*View` files from `src/components`, `src/App.tsx`, or `src/hooks`.
