import Header from '@/components/header';
import Sidebar from '@/components/sidebar'
import useAanalyticHook from '@/hooks/useAanalytic';
import React, { useState } from 'react'

type BodyLayoutProps = {
  children: React.ReactNode
}

export default function BodyLayout(props: BodyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAanalyticHook()
  const { children } = props

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {children}
      </div>
    </div>
  )
}
