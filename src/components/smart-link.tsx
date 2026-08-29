import { cn } from "@/lib/utils";
import { Link, LinkProps } from "@tanstack/react-router";
import { cva, VariantProps } from "class-variance-authority";

interface SmartLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const notToPreload = ["/"];

const smartLinkVariants = cva("transition-colors duration-200", {
  variants: {
    variant: {
      default: "text-blue-500 hover:text-blue-600",
      noColor: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function SmartLink({
  prefetch,
  className,
  style,
  variant,
  to,
  ...props
}: SmartLinkProps &
  VariantProps<typeof smartLinkVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    prefetch?: "intent" | "render" | "viewport" | false;
  }) {
  return (
    <Link
      className={cn(smartLinkVariants({ variant }), className)}
      style={style}
      preload={
        prefetch || (to && !notToPreload.includes(to) ? "intent" : false)
      }
      to={to}
      {...props}
    />
  );
}
