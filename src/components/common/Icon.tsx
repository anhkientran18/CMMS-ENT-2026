/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode, SVGProps } from "react"
import type { IconName } from "../../types"

const iconPaths: Record<IconName, ReactNode> = {
  analytics: <path d="M4 19V9M10 19V5M16 19v-7M22 19V3M2 19h21" />,
  assets: (
    <>
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  cube: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 15a2 2 0 0 0 .4 2.2l-2.2 2.2A2 2 0 0 0 15 19a2 2 0 0 0-1.8 1.2H10A2 2 0 0 0 8 19a2 2 0 0 0-2.2.4l-2.2-2.2A2 2 0 0 0 4 15a2 2 0 0 0-1.2-1.8V10A2 2 0 0 0 4 8a2 2 0 0 0-.4-2.2l2.2-2.2A2 2 0 0 0 8 4a2 2 0 0 0 2-1.2h3.2A2 2 0 0 0 15 4a2 2 0 0 0 2.2-.4l2.2 2.2A2 2 0 0 0 19 8a2 2 0 0 0 1.2 2v3.2A2 2 0 0 0 19 15Z" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4h8v2M3 11h18M10 14h4" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a4.5 4.5 0 0 0-5.9-4.2l2.7 2.7-2.7 2.7-2.7-2.7a4.5 4.5 0 0 0 5.8 5.9l7.1 7.1a2.1 2.1 0 0 0 3-3l-7.3-7.1v-1.4Z" />
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  tag: (
    <>
      <path d="M12 2H2v10l9.29 9.29a2.42 2.42 0 0 0 3.42 0l6.58-6.58a2.42 2.42 0 0 0 0-3.42L12 2Z" />
      <circle cx="7" cy="7" r=".8" fill="currentColor" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  paperclip: (
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l7.88-7.88" />
  ),
}

export function Icon({
  name,
  className = "size-4",
  ...props
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  )
}
