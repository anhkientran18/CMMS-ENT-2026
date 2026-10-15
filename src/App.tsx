/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Analytics } from "./components/Analytics"
import { Assets } from "./components/Assets"
import { Dashboard } from "./components/Dashboard"
import { Maintenance } from "./components/Maintenance"
import { Settings } from "./components/Settings"
import { SidebarMaster } from "./components/SidebarMaster"
import { WorkOrders } from "./components/WorkOrders"
import { screenToSidebarVariant } from "./constants"
import { LanguageProvider } from "./context/LanguageContext"
import { WorkOrderProvider, useWorkOrderDrawer } from "./context/WorkOrderContext"
import { WorkOrderDetailDrawer } from "./components/common/WorkOrderDetailDrawer"
import type { Screen } from "./types"

// Re-export context and modular components so imports from App.tsx or subpaths remain 100% backward-compatible
export { LanguageContext, LanguageProvider, useLanguage } from "./context/LanguageContext"
export { WorkOrderProvider, useWorkOrderDrawer } from "./context/WorkOrderContext"
export { WorkOrderDetailDrawer } from "./components/common/WorkOrderDetailDrawer"
export { SidebarMaster } from "./components/SidebarMaster"
export { AppHeader } from "./components/AppHeader"
export { Dashboard } from "./components/Dashboard"
export { WorkOrders } from "./components/WorkOrders"
export { Assets } from "./components/Assets"
export { Maintenance } from "./components/Maintenance"
export { Analytics } from "./components/Analytics"
export { Settings } from "./components/Settings"

function AppContent() {
  const [screen, setScreen] = useState<Screen>("dashboard")
  const { setNavigateHandler } = useWorkOrderDrawer()

  useEffect(() => {
    setNavigateHandler(setScreen)
  }, [setNavigateHandler])

  const screens: Record<Screen, ReactNode> = {
    dashboard: (
      <Dashboard onNavigateToWorkOrders={() => setScreen("work-orders")} />
    ),
    "work-orders": <WorkOrders />,
    assets: <Assets />,
    maintenance: <Maintenance />,
    analytics: <Analytics />,
    settings: <Settings />,
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-slate-900 antialiased">
      <SidebarMaster
        onNavigate={setScreen}
        variant={screenToSidebarVariant[screen]}
      />
      {screens[screen]}

      {/* Global Work Order Detail Slide-over Drawer */}
      <WorkOrderDetailDrawer />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <WorkOrderProvider>
        <AppContent />
      </WorkOrderProvider>
    </LanguageProvider>
  )
}
