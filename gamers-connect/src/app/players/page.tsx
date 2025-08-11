"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import PlayerCard from "../../components/PlayerCard";
import FilterBar from "../../components/FilterBar";
import api, { type UserProfile } from "../../lib/api";

type UpperStatus = "ONLINE" | "AWAY" | "OFFLINE";
type LowerStatus = "online" | "away" | "offline";

const toLowerStatus = (s?: UpperStatus): LowerStatus => {
  switch (s) {
    case "ONLINE":
      return "online";
    case "AWAY":
      return "away";
    default:
      return "offline";
  }
};

const FindPlayers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [searchGame, setSearchGame] = useState("");
  const [searchPlatform, setSearchPlatform] = useState("");
  const [searchPlaystyle, setSearchPlaystyle] = useState("");

  // demo lists for FilterBar
  const mockGames = ["Valorant", "Overwatch", "Rocket League", "League of Legends", "CS2", "Fortnite"];
  const mockPlatforms = ["PC", "PS5", "Xbox", "Switch"];
  const mockPlaystyles = ["Casual", "Competitive", "Cooperative"];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.users.getAll({
        game: searchGame || undefined,
        platform: searchPlatform || undefined,
        playstyle: searchPlaystyle || undefined,
        limit: 50,
      });
      
      // Filter out current user if logged in
      const allUsers = res.users || [];
      const filteredUsers = user 
        ? allUsers.filter((u) => u.id !== user.id)
        : allUsers;
        
      setUsers(filteredUsers);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load players";
      console.error(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSearch = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", color: "white" }}>
        Loading players…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
          Find Players
        </h2>
        <p style={{ color: "#d1d5db" }}>Connect with fellow UH gamers who share your interests</p>
      </div>

      <FilterBar
        games={mockGames}
        platforms={mockPlatforms}
        playstyles={mockPlaystyles}
        searchGame={searchGame}
        searchPlatform={searchPlatform}
        searchPlaystyle={searchPlaystyle}
        onGameChange={setSearchGame}
        onPlatformChange={setSearchPlatform}
        onPlaystyleChange={setSearchPlaystyle}
        onSearch={handleSearch}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {users.length === 0 ? (
          <div style={{ color: "#9ca3af" }}>No players found.</div>
        ) : (
          users.map((u) => (
            <PlayerCard
              key={u.id}
              player={{
                ...u,
                // convert API uppercase to PlayerCard's lowercase expectation
                status: toLowerStatus(u.status as UpperStatus | undefined),
              }}
              showRating
              isDetailed
              onUpdate={fetchUsers}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FindPlayers;
