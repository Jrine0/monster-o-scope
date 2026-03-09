import SmartLink from "@/components/smart-link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { EllipsisVertical, LayoutDashboardIcon, User } from "lucide-react";

const sidebarConfig = {
  admin: {
    groups: [
      {
        name: "GENERAL",
        items: [
          {
            name: "Dashboard",
            href: "/admin",
            icon: <LayoutDashboardIcon />,
          },
          { name: "Users", href: "/admin", icon: <User /> },
        ],
      },
    ],
  },
  teacher: {
    groups: [
      {
        name: "GENERAL",
        items: [
          {
            name: "Dashboard",
            href: "/teacher",
            icon: <LayoutDashboardIcon />,
          },
        ],
      },
    ],
  },
  student: {
    groups: [
      {
        name: "GENERAL",
        items: [
          {
            name: "Dashboard",
            href: "/student",
            icon: <LayoutDashboardIcon />,
          },
        ],
      },
    ],
  },
} as const;

export default function AppSidebar() {
  const CURRENT_USER = "admin";
  const { open } = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex flex-row items-start flex-wrap justify-between gap-2 text-lg font-display transition-all",
          open ? "h-12" : "h-26",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-500 rounded-full shrink-0"></div>
          {open ? "Vyasa" : null}
        </div>
        <SidebarTrigger variant="outline" size="icon-sm" className="m-0.5" />
      </SidebarHeader>
      <SidebarContent>
        {sidebarConfig[CURRENT_USER].groups.map((group) => {
          return (
            <SidebarGroup key={group.name}>
              <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
              {group.items.map((item, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className={cn("justify-start", open ? "" : "p-2")}
                  asChild
                >
                  <SmartLink variant="noColor" to={item.href}>
                    {item.icon}
                    {open ? item.name : null}
                  </SmartLink>
                </Button>
              ))}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="">
        <div className="flex justify-between items-center group relative">
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              open ? "" : "group-hover:invisible",
            )}
          >
            <div className="h-7 w-7 bg-gray-500 rounded-full shrink-0"></div>
            {open ? "John Doe" : null}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className={cn(
                  "",
                  open ? "" : "absolute top-0 left-0 group-hover:visible invisible",
                )}
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <SmartLink variant="noColor" to="/">
                    Payment
                  </SmartLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SmartLink variant="noColor" to="/">
                    Settings
                  </SmartLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SmartLink variant="noColor" to="/">
                    Profile
                  </SmartLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
