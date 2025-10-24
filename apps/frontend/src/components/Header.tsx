import usePathname from "@/stores/usePathname";
import SearchInput from "./SearchInput";

const Header = () => {
  const pathname = usePathname((state) => state.pathname);
  return (
    <div className="w-full h-16 shadow border-1 p-2 gap-19 rounded-md flex items-center justify-between">
      <h1 className="text-lg md:text-xl font-semibold">{pathname}</h1>
      <SearchInput />
    </div>
  );
};

export default Header;
