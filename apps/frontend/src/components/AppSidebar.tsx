import { LayoutDashboard } from "lucide-react";
import { BiSolidInstitution } from "react-icons/bi";
import { FaNoteSticky } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { GiTeacher } from "react-icons/gi";
import { HiPresentationChartBar } from "react-icons/hi";
import { useLocation } from "react-router-dom";
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Enseignants",
    url: "/enseignants/liste",
    icon: GiTeacher,
    subItems: [
      {
        title: "Avancement",
        url: "/enseignants/avancement",
        icon: FaArrowTrendUp,
      },
      {
        title: "Liste",
        url: "/enseignants/liste",
        icon: FaList,
      },
      {
        title: "Empechements",
        url: "/enseignants/empechement",
        icon: FaUserShield,
      },
    ],
  },
  {
    title: "Institutions",
    url: "/institutions/liste",
    icon: BiSolidInstitution,
    subItems: [
      {
        title: "Liste",
        url: "/institutions/liste",
        icon: FaList,
      },
      {
        title: "Representation",
        url: "/institutions/representation",
        icon: HiPresentationChartBar,
      },
    ],
  },
  {
    title: "Notes",
    url: "/notes",
    icon: FaNoteSticky,
  },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SGSCE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="p-2">
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`p-5 text-lg flex items-center gap-4 rounded-md hover:bg-blue-700 hover:text-white w-full  ${
                        pathname === item.url && !item.subItems
                          ? "bg-blue-600 text-white shadow-lg"
                          : ""
                      }  `}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="p-2">
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={`p-5 text-lg flex items-center gap-4 rounded-md hover:bg-blue-700 hover:text-white w-full ${
                                pathname === subItem.url
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : ""
                              }  `}
                            >
                              <subItem.icon
                                className={`hover:fill-white ${
                                  pathname === subItem.url ? "fill-white" : ""
                                }`}
                              />
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
