"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { ModeToggle } from "./ThemeSwitch";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import Preloader from "@/components/Loader/Preloader";

type Props = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: Props) {


  return (
    <Suspense fallback={<Preloader />}>
      <SidebarProvider suppressHydrationWarning={true}>
        <AppSidebar collapsible="offcanvas" />
        <SidebarInset>
          <Card className="flex border-1 border-white h-16 m-4 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-[rgba(0,0,0,0.09)_0px_3px_12px] dark:shadow-[rgba(109,40,216,0.24)_0px_3px_8px]">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex items-center gap-2 px-4">
              <ModeToggle />
            </div>
          </Card>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
