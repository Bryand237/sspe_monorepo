import { create } from "zustand";

type State = {
  pathname: string;
  title: string;
  setPathname: (p: string) => void;
};

const getName = (segment: string) => {
  switch (segment.toLowerCase()) {
    case "/dashboard":
      return "Dashboard";
    case "/notes":
      return "Notes";
    case "/enseignants/liste":
      return "Enseignants/Liste";
    case "/enseignants/avancement":
      return "Enseignants/Avancement";
    case "/enseignants/empechement":
      return "Enseignants/Empechement";
    case "/institutions/liste":
      return "Institutions/Liste";
    case "/institutions/representation":
      return "Institutions/Representation";
    default:
      return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

const computeTitle = (p: string) => {
  if (!p || p === "/") return "Home";
  const map: Record<string, string> = {
    "/login": "Login",
    "/dashboard": "Dashboard",
    "/notes": "Notes",
    "/enseignants/liste": "Enseignants/Liste",
    "/enseignants/avancement": "Enseignants/Avancement",
    "/enseignants/empechement": "Enseignants/Empechement",
    "/institutions/liste": "Institutions/Liste",
    "/institutions/representation": "Institutions/Representation",
  };
  if (map[p]) return map[p];
  const seg = p.split("/").filter(Boolean).pop() || "Home";
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const usePathname = create<State>((set) => {
  const initial =
    typeof window !== "undefined" ? window.location.pathname : "/";
  return {
    pathname: getName(
      initial === "/" ? "home" : initial.split("/").pop() || ""
    ),
    title: computeTitle(initial),
    setPathname: (p: string) =>
      set(() => ({ pathname: getName(p), title: computeTitle(p) })),
  };
});

export default usePathname;
