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
import { useAuthStore } from "@/stores/useAuthStore";
import { useLocation } from "@tanstack/react-router";
import {
  Book,
  CreditCard,
  EllipsisVertical,
  GraduationCap,
  GraduationCapIcon,
  LayoutDashboardIcon,
  LibraryBig,
  ListChecksIcon,
  NotebookText,
  School,
  Settings,
  Stars,
  User,
} from "lucide-react";

const sidebarConfig = {
  admin: {
    groups: [
      {
        name: "GENERAL",
        items: [
          { name: "Dashboard", to: "/admin", icon: LayoutDashboardIcon },
          { name: "Teachers", to: "/admin/teachers", icon: User },
          { name: "Students", to: "/admin/students", icon: GraduationCap },
          { name: "Classes", to: "/admin/classes", icon: School },
          { name: "Billing", to: "/admin/billing", icon: CreditCard },
          { name: "Settings", to: "/admin/settings", icon: Settings },
        ],
      },
    ],
  },
  teacher: {
    groups: [
      {
        name: "GENERAL",
        items: [
          { name: "Dashboard", to: "/teacher", icon: LayoutDashboardIcon },
          { name: "Library", to: "/teacher/library", icon: LibraryBig },
          { name: "Generate", to: "/teacher/generate", icon: Stars },
          { name: "My Materials", to: "/teacher/materials", icon: Book },
        ],
      },
    ],
  },
  student: {
    groups: [
      {
        name: "GENERAL",
        items: [
          { name: "Dashboard", to: "/student", icon: LayoutDashboardIcon },
          { name: "Study Materials", to: "/student/materials", icon: Book },
          {
            name: "Practice Quizzes",
            to: "/student/quizzes",
            icon: ListChecksIcon,
          },
          { name: "AI Tutor", to: "/student/tutor", icon: GraduationCapIcon },
          { name: "My Results", to: "/student/results", icon: NotebookText },
        ],
      },
    ],
  },
} as const;

const sidebarFooter = {
  dropdown: [
    { name: "Payment", to: "/admin/billing" },
    { name: "Settings", to: "/admin/settings" },
    { name: "Profile", to: "/admin/settings" },
  ],
} as const;

export default function AppSidebar() {
  const { user } = useAuthStore();
  const { open } = useSidebar();
  const location = useLocation();
  const CURRENT_USER = location.pathname.startsWith("/admin") ? "admin" : location.pathname.startsWith("/teacher") ? "teacher" : "student";

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
                  <SmartLink variant="noColor" to={item.to}>
                    <item.icon />
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
            <div className="flex flex-col flex-nowrap">
            <span>{open ? user?.name || "John Doe" : null}</span>
            <span className="text-xs text-gray-500">{open ? user?.school_name || "Delhi Public So Cool" : null}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className={cn(
                  "",
                  open
                    ? ""
                    : "absolute top-0 left-0 group-hover:visible invisible",
                )}
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                {sidebarFooter.dropdown.map((item, i) => {
                  return (
                    <DropdownMenuItem asChild key={i}>
                      <SmartLink variant="noColor" to={item.to}>
                        {item.name}
                      </SmartLink>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
