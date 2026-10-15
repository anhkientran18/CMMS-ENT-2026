/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from "react"
import type { ActionConfig, Screen } from "../../types"
import { Header } from "./Header"

interface PageProps {
  screen: Screen
  children: ReactNode
  action?: ActionConfig
  headerContent?: ReactNode
  onNotifications?: () => void
  searchContent?: ReactNode
}

export function Page({
  screen,
  children,
  action,
  headerContent,
  onNotifications,
  searchContent,
}: PageProps) {
  return (
    <>
      <Header
        action={action}
        headerContent={headerContent}
        onNotifications={onNotifications}
        screen={screen}
        searchContent={searchContent}
      />
      <main className="ml-[260px] min-h-[calc(100vh-4rem)] bg-surface pt-16">
        <div className="p-6 max-w-[1600px]">{children}</div>
      </main>
    </>
  )
}
