import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/pos.tsx"),
  route("home", "routes/home.tsx")
] satisfies RouteConfig;
