"use client";

import React from "react";

interface StatusChipProps {
  status: "ONLINE" | "AWAY" | "OFFLINE" | undefined;
}

const statusColors: Record<string, string> = {
  ONLINE: "limegreen",
  AWAY: "goldenrod",
  OFFLINE: "gray",
};

export default function StatusChip({ status }: StatusChipProps) {
  if (!status) return null;

  return (
    <span
      style={{
        backgroundColor: statusColors[status] || "gray",
        color: "white",
        padding: "0.2rem 0.5rem",
        borderRadius: "0.5rem",
        fontSize: "0.75rem",
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}
