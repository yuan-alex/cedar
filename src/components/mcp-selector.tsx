import mcpIcon from "@lobehub/icons-static-svg/icons/mcp.svg";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { $mcpSelectedServers } from "@/utils/stores";

export function McpSelector() {
  const selectedServersCsv = useStore($mcpSelectedServers) || "";
  const selectedServers = useMemo(
    () => selectedServersCsv.split(",").filter(Boolean),
    [selectedServersCsv],
  );
  const { data: availableServers = [] } = useQuery({
    queryKey: ["availableMcpServers"],
    queryFn: async () => {
      const res = await fetch("/api/v1/mcp/servers");
      const data: Record<string, { enabled?: boolean }> = await res.json();
      return Object.entries(data)
        .filter(([, cfg]) => cfg?.enabled !== false)
        .map(([name]) => name)
        .sort();
    },
    staleTime: 5 * 60 * 1000,
  });

  const setAll = (enabled: boolean) => {
    if (enabled) {
      $mcpSelectedServers.set(availableServers.join(","));
    } else {
      $mcpSelectedServers.set("");
    }
  };

  const toggleServer = (name: string, enabled: boolean) => {
    const next = new Set(selectedServers);
    if (enabled) next.add(name);
    else next.delete(name);
    $mcpSelectedServers.set(Array.from(next).join(","));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <img src={mcpIcon} className="w-4 h-4" alt="MCP" />
          MCP Connections
          {selectedServers.length ? ` (${selectedServers.length})` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Manage connections</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableServers.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No connections available
          </div>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setAll(true);
              }}
            >
              Enable all
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setAll(false);
              }}
              data-variant="destructive"
            >
              Disable all
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {availableServers.map((name) => {
              const isEnabled = selectedServers.includes(name);
              return (
                <DropdownMenuItem
                  key={name}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleServer(name, !isEnabled);
                  }}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate pr-2 leading-none">{name}</span>
                  <div className="shrink-0">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        toggleServer(name, !!checked)
                      }
                    />
                  </div>
                </DropdownMenuItem>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
