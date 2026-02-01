import * as React from "react"
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu"
import {
  RiArrowRightSLine,
  RiCheckboxBlankCircleLine,
  RiCheckLine,
  RiRadioButtonFill,
} from "@remixicon/react"

const cx = (...classes) => classes.filter(Boolean).join(" ")

const DropdownMenu = DropdownMenuPrimitives.Root
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuGroup = DropdownMenuPrimitives.Group
DropdownMenuGroup.displayName = "DropdownMenuGroup"

const DropdownMenuSubMenu = DropdownMenuPrimitives.Sub
DropdownMenuSubMenu.displayName = "DropdownMenuSubMenu"

const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

const DropdownMenuSubMenuTrigger = React.forwardRef(({ className, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.SubTrigger
    ref={forwardedRef}
    className={cx(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-1 outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm",
      "text-gray-900",
      "data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:hover:bg-none",
      "focus-visible:bg-gray-100 data-[state=open]:bg-gray-100",
      "hover:bg-gray-100",
      className,
    )}
    {...props}
  >
    {children}
    <RiArrowRightSLine className="ml-auto size-4 shrink-0" aria-hidden="true" />
  </DropdownMenuPrimitives.SubTrigger>
))
DropdownMenuSubMenuTrigger.displayName = "DropdownMenuSubMenuTrigger"

const DropdownMenuSubMenuContent = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.SubContent
    ref={forwardedRef}
    className={cx(
      "min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md",
      className,
    )}
    {...props}
  />
))
DropdownMenuSubMenuContent.displayName = "DropdownMenuSubMenuContent"

const DropdownMenuContent = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Content
    ref={forwardedRef}
    className={cx(
      "min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md",
      className,
    )}
    {...props}
  />
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Item
    ref={forwardedRef}
    className={cx(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-hidden transition-colors sm:text-sm",
      "text-gray-900",
      "data-disabled:pointer-events-none data-disabled:text-gray-400",
      "focus-visible:bg-gray-100",
      "hover:bg-gray-100",
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.RadioItem
    ref={forwardedRef}
    className={cx(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-1 outline-hidden transition-colors sm:text-sm",
      "text-gray-900",
      "data-disabled:pointer-events-none data-disabled:text-gray-400",
      "focus-visible:bg-gray-100",
      "hover:bg-gray-100",
      className,
    )}
    {...props}
  >
    {children}
    <span className="ml-auto flex items-center">
      <DropdownMenuPrimitives.ItemIndicator>
        <RiRadioButtonFill className="size-4" aria-hidden="true" />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
  </DropdownMenuPrimitives.RadioItem>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.CheckboxItem
    ref={forwardedRef}
    className={cx(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-1 outline-hidden transition-colors sm:text-sm",
      "text-gray-900",
      "data-disabled:pointer-events-none data-disabled:text-gray-400",
      "focus-visible:bg-gray-100",
      "hover:bg-gray-100",
      className,
    )}
    checked={checked}
    {...props}
  >
    {children}
    <span className="ml-auto flex items-center">
      <DropdownMenuPrimitives.ItemIndicator>
        <RiCheckLine className="size-4" aria-hidden="true" />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
  </DropdownMenuPrimitives.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Label
    ref={forwardedRef}
    className={cx("px-2 py-1.5 text-sm font-semibold text-gray-900", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Separator
    ref={forwardedRef}
    className={cx("-mx-1 my-1 h-px bg-gray-200", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuIconWrapper = ({ className, ...props }) => {
  return (
    <div
      className={cx(
        "text-gray-600",
        "group-data-disabled/DropdownMenuItem:text-gray-400",
        className,
      )}
      {...props}
    />
  )
}
DropdownMenuIconWrapper.displayName = "DropdownMenuIconWrapper"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSubMenuTrigger,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuIconWrapper,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}