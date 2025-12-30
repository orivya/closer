"use client";

import { useEffect, useState } from "react";

function formatTime(timeZone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

export function TimezonePill() {
  const [sfTime, setSfTime] = useState("6:42 PM");
  const [nyTime, setNyTime] = useState("9:42 PM");

  useEffect(() => {
    function update() {
      setSfTime(formatTime("America/Los_Angeles"));
      setNyTime(formatTime("America/New_York"));
    }

    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="timezone-pill" aria-label="Time zones">
      <div className="timezone-item">
        <span className="tz-time" id="time-sf">
          {sfTime}
        </span>
        <span className="tz-city">San Francisco</span>
      </div>
      <div className="timezone-divider" />
      <div className="timezone-item">
        <span className="tz-time" id="time-ny" style={{ color: "var(--mist)" }}>
          {nyTime}
        </span>
        <span className="tz-city">New York</span>
      </div>
    </div>
  );
}
