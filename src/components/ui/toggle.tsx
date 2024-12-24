"use client"

import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-[22px] text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-accent-foreground data-[state=on]:text-white  [&_svg]:pointer-events-none  [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-[#F2F4F7] text-[#4B4B4B]",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        search: "px-2 border-2 border-transparent min-w-10 data-[state=on]:bg-[#C7947929] data-[state=on]:border-2 data-[state=on]:border-primary hover:bg-[#C7947929] hover:border-[#C7947929] ",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        search: "px-1 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
