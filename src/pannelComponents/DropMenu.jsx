import React from "react"
import {
  RiAddCircleLine,
  RiAddLine,
  RiArrowUpCircleLine,
  RiDiscordLine,
  RiHeartPulseLine,
  RiIdCardLine,
  RiLogoutBoxLine,
  RiMailAddLine,
  RiMessageLine,
  RiSettings2Line,
  RiSlackLine,
  RiTelegramLine,
  RiUserSmileLine,
  RiWhatsappLine,
} from "@remixicon/react"

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIconWrapper,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
} from "../pannelComponents/DropMenuUtils"

import { signOut } from "../api/auth"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../globalState/zustand"

export const DropdownMenuItems = () => {
    const logout = useAuthStore((state)=>state.logout)

    const navigate = useNavigate()

    const requestsignOut = async ()=>{

        const serverresponse = await signOut();

        if(serverresponse.status){

            logout()

            navigate('/')

        }
    }
  return (
    <DropdownMenuContent className="min-w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem>
          <span className="flex items-center gap-x-2">
            <RiArrowUpCircleLine className="size-4 text-blue-500" />
            <span className="text-blue-500">Upgrade</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled shortcut="⌘B">
          <span className="flex items-center gap-x-2">
            <DropdownMenuIconWrapper>
              <RiIdCardLine className="size-4 text-inherit" />
            </DropdownMenuIconWrapper>
            <span>Billing</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘S">
          <span className="flex items-center gap-x-2">
            <DropdownMenuIconWrapper>
              <RiSettings2Line className="size-4 text-inherit" />
            </DropdownMenuIconWrapper>
            <span>Account Settings</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem hint="Pro">
          <span className="flex items-center gap-x-2">
            <RiUserSmileLine className="size-4 text-inherit" />
            <span>Manage workspace</span>
          </span>
        </DropdownMenuItem>

        <DropdownMenuSubMenu>
          <DropdownMenuSubMenuTrigger>
            <span className="flex items-center gap-x-2">
              <RiAddCircleLine className="size-4 text-inherit" />
              <span>Invite users</span>
            </span>
          </DropdownMenuSubMenuTrigger>
          <DropdownMenuSubMenuContent>
            <DropdownMenuItem>
              <span className="flex items-center gap-x-2">
                <RiMailAddLine className="size-4 text-inherit" />
                <span>Email</span>
              </span>
            </DropdownMenuItem>

            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>
                <span className="flex items-center gap-x-2">
                  <RiMessageLine className="size-4 text-inherit" />
                  <span>Message</span>
                </span>
              </DropdownMenuSubMenuTrigger>
             
            </DropdownMenuSubMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span className="flex items-center gap-x-2">
                <RiAddCircleLine className="size-4 text-inherit" />
                <span>More...</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubMenuContent>
        </DropdownMenuSubMenu>
        <DropdownMenuItem shortcut="⌘T">
          <span className="flex items-center gap-x-2">
            <RiAddLine className="size-4 text-inherit" />
            <span>New Workspace</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem>
        <span className="flex items-center gap-x-2">
          <RiHeartPulseLine className="size-4 text-inherit" />
          <span>Support</span>
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem  shortcut="⇧⌘Q">
        <span onClick={requestsignOut} className="flex items-center gap-x-2">
          <RiLogoutBoxLine className="size-4 text-inherit" />
          <span>Sign out</span>
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}