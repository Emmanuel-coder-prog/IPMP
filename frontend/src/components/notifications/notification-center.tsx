'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNotifications, useNotificationMutations } from '@/hooks/queries/use-notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function NotificationList({ mobile = false }: { mobile?: boolean }) {
  const { data, isLoading } = useNotifications();
  const { markRead, markAllRead } = useNotificationMutations();
  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-sm font-medium">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => markAllRead.mutate()}
          >
            Clear all
          </Button>
        )}
      </div>
      <ScrollArea className={mobile ? 'h-[60vh]' : 'h-80'}>
        {notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No notifications</p>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                  !n.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => !n.isRead && markRead.mutate(n.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{n.title}</span>
                  {!n.isRead && (
                    <Badge variant="default" className="h-5 shrink-0 text-[10px]">
                      New
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export function NotificationCenter() {
  const { data } = useNotifications(true);
  const unreadCount = data?.data?.length ?? 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2">
            <NotificationList />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative sm:hidden">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <NotificationList mobile />
        </SheetContent>
      </Sheet>
    </>
  );
}
