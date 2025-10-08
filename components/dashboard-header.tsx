"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div />
      <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </header>
  )
}
