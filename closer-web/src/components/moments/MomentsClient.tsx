"use client";

import {
  Calendar as CalendarIcon,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Grid3X3,
  List,
  MoreHorizontal,
  Music,
  Pencil,
  Plus,
  Quote,
  Search,
  Share2,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ViewMode = "timeline" | "grid" | "calendar";
type MomentKind = "photo" | "song" | "quote" | "milestone" | "card_answer";
type MomentSource = "manual" | "messages" | "daily" | "connect" | "intimacy_deck";
type Filter = "all" | "photos" | "songs" | "quotes" | "milestones" | "from_games";
type Plan = "free" | "plus";

type Moment = {
  id: string;
  kind: MomentKind;
  source: MomentSource;
  dateKey: string;
  timeLabel?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  note?: string;
};

type ComposerType = "photo" | "song" | "quote" | "milestone";

const initialMoments: Moment[] = [
  {
    id: "m-001",
    kind: "photo",
    source: "messages",
    dateKey: "2026-01-11",
    timeLabel: "9:42 AM",
    title: "Morning Coffee ☕️",
    imageUrl: "https://images.unsplash.com/photo-1516058020843-e38466e60b2e?q=80&w=1000",
  },
  {
    id: "m-002",
    kind: "song",
    source: "manual",
    dateKey: "2026-01-11",
    timeLabel: "10:03 AM",
    title: "Until I Found You",
    subtitle: "Stephen Sanchez",
    note: "This feels like us.",
  },
  {
    id: "m-003",
    kind: "quote",
    source: "daily",
    dateKey: "2026-01-10",
    title: "Saved Answer",
    text: "“I love our shared sense of humor. Nobody makes me laugh like you do.”",
  },
  {
    id: "m-004",
    kind: "milestone",
    source: "connect",
    dateKey: "2026-01-08",
    title: "14‑Day Streak",
    subtitle: "You both checked in every day.",
  },
  {
    id: "m-005",
    kind: "photo",
    source: "manual",
    dateKey: "2025-12-30",
    timeLabel: "8:17 PM",
    title: "Snowy Walk",
    imageUrl: "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=1000",
  },
  {
    id: "m-006",
    kind: "card_answer",
    source: "intimacy_deck",
    dateKey: "2025-12-15",
    title: "Intimacy Card",
    subtitle: "Deep Connection",
    text: "“I wish you knew how safe I feel when you listen without trying to fix it.”",
  },
];

const INITIAL_ANCHOR_DATE_KEY = getMostRecentDateKey(initialMoments) ?? "2026-01-11";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map((part) => Number(part));
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function addDays(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  return toDateKey(date);
}

function formatMonthYear(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function formatLongDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function formatShortDayName(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function getMostRecentDateKey(moments: Moment[]): string | null {
  let max: string | null = null;
  for (const moment of moments) {
    if (!max || moment.dateKey > max) max = moment.dateKey;
  }
  return max;
}

function isOlderThanDays(dateKey: string, anchorDateKey: string, days: number): boolean {
  const date = parseDateKey(dateKey);
  const anchor = parseDateKey(anchorDateKey);
  const deltaDays = Math.floor((anchor.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return deltaDays > days;
}

function getRelativeDateLabel(dateKey: string, anchorDateKey: string): string {
  if (dateKey === anchorDateKey) return "Today";
  if (dateKey === addDays(anchorDateKey, -1)) return "Yesterday";
  return formatLongDate(dateKey);
}

function getMomentIcon(kind: MomentKind) {
  if (kind === "photo") return Camera;
  if (kind === "song") return Music;
  if (kind === "milestone") return Trophy;
  return Quote;
}

type LightboxState = { photoIds: string[]; index: number };

function OnThisDayHero({ moments }: { moments: Moment[] }) {
  // Mock logic: Find a moment from "1 year ago" (relaxed logic for prototype: find any moment older than 30 days)
  const memory = useMemo(() => {
    // In a real app, match exact date (MM-DD) across years.
    // For demo, just pick the 'oldest' photo or a specific one.
    return moments.find(m => m.id === "m-001") || moments[0];
  }, [moments]);

  if (!memory || memory.kind !== 'photo') return null;

  return (
    <div className="moments-hero">
      <div className="moments-hero-bg">
        <img src={memory.imageUrl} alt="" />
        <div className="overlay" />
      </div>
      <div className="moments-hero-content">
        <div className="hero-badge">
          <Sparkles size={12} color="#D4AF37" />
          <span>ON THIS DAY</span>
        </div>
        <h2 className="hero-title">Do you remember this?</h2>
        <p className="hero-date">{formatLongDate(memory.dateKey)}</p>
        <button className="hero-btn focus-ring pressable">
          <Share2 size={14} />
          <span>Share Memory</span>
        </button>
      </div>
    </div>
  );
}

export function MomentsClient() {
  const plan: Plan = "free";

  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [moments, setMoments] = useState<Moment[]>(() => initialMoments);

  const [selectedDateKey, setSelectedDateKey] = useState(() => INITIAL_ANCHOR_DATE_KEY);
  const [calendarCursorDateKey, setCalendarCursorDateKey] = useState(() => `${INITIAL_ANCHOR_DATE_KEY.slice(0, 7)}-01`);

  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [composerType, setComposerType] = useState<ComposerType | null>(null);

  const [draftDateKey, setDraftDateKey] = useState(() => INITIAL_ANCHOR_DATE_KEY);
  const [draftPhotoFile, setDraftPhotoFile] = useState<File | null>(null);
  const [draftPhotoCaption, setDraftPhotoCaption] = useState("");
  const [draftSongTitle, setDraftSongTitle] = useState("");
  const [draftSongArtist, setDraftSongArtist] = useState("");
  const [draftSongNote, setDraftSongNote] = useState("");
  const [draftQuoteText, setDraftQuoteText] = useState("");
  const [draftQuoteSource, setDraftQuoteSource] = useState("Saved Answer");
  const [draftQuoteAuthor, setDraftQuoteAuthor] = useState("");
  const [draftMilestoneTitle, setDraftMilestoneTitle] = useState("");
  const [draftMilestoneSubtitle, setDraftMilestoneSubtitle] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [highlightedMomentId, setHighlightedMomentId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchBlurTimeoutRef = useRef<number | null>(null);

  const anchorDateKey = useMemo(() => getMostRecentDateKey(moments) ?? INITIAL_ANCHOR_DATE_KEY, [moments]);

  const draftPhotoPreviewUrl = useMemo(() => {
    if (!draftPhotoFile) return null;
    return URL.createObjectURL(draftPhotoFile);
  }, [draftPhotoFile]);

  useEffect(() => {
    if (!draftPhotoPreviewUrl) return;
    return () => URL.revokeObjectURL(draftPhotoPreviewUrl);
  }, [draftPhotoPreviewUrl]);

  const filteredMoments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return moments
      .filter((moment) => {
        if (filter === "photos" && moment.kind !== "photo") return false;
        if (filter === "songs" && moment.kind !== "song") return false;
        if (filter === "quotes" && moment.kind !== "quote" && moment.kind !== "card_answer") return false;
        if (filter === "milestones" && moment.kind !== "milestone") return false;
        if (filter === "from_games" && !["connect", "intimacy_deck"].includes(moment.source)) return false;

        if (!normalizedQuery) return true;

        const haystack = [
          moment.title,
          moment.subtitle,
          moment.text,
          moment.note,
          moment.timeLabel,
          moment.source,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => (a.dateKey === b.dateKey ? a.id.localeCompare(b.id) : b.dateKey.localeCompare(a.dateKey)));
  }, [filter, moments, searchQuery]);

  const visibleMoments = useMemo(() => filteredMoments.slice(0, displayCount), [displayCount, filteredMoments]);

  const momentsByDateKey = useMemo(() => {
    const grouped = new Map<string, Moment[]>();
    for (const moment of visibleMoments) {
      const list = grouped.get(moment.dateKey);
      if (list) list.push(moment);
      else grouped.set(moment.dateKey, [moment]);
    }
    return grouped;
  }, [visibleMoments]);

  const allMatchingDates = useMemo(() => {
    const grouped = new Set<string>();
    for (const moment of filteredMoments) grouped.add(moment.dateKey);
    return grouped;
  }, [filteredMoments]);

  const sortedDateKeys = useMemo(() => {
    const keys = Array.from(momentsByDateKey.keys());
    keys.sort((a, b) => b.localeCompare(a));
    return keys;
  }, [momentsByDateKey]);

  const calendarStripDays = useMemo(() => {
    const days: Array<{ dateKey: string; dayName: string; dayNumber: number }> = [];
    for (let offset = -3; offset <= 5; offset += 1) {
      const dateKey = addDays(selectedDateKey, offset);
      const date = parseDateKey(dateKey);
      days.push({ dateKey, dayName: formatShortDayName(dateKey), dayNumber: date.getDate() });
    }
    return days;
  }, [selectedDateKey]);

  const searchableResults = useMemo(() => filteredMoments.slice(0, 7), [filteredMoments]);

  function isLocked(moment: Moment): boolean {
    if (plan !== "free") return false;
    return isOlderThanDays(moment.dateKey, anchorDateKey, 7);
  }

  function closeAllOverlays() {
    setTypePickerOpen(false);
    setComposerType(null);
    setOpenMenuId(null);
    setLightbox(null);
  }

  function scrollToDate(dateKey: string) {
    const element = document.getElementById(`moments-date-${dateKey}`);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetComposerDrafts(nextDateKey: string) {
    setDraftDateKey(nextDateKey);
    setDraftPhotoFile(null);
    setDraftPhotoCaption("");
    setDraftSongTitle("");
    setDraftSongArtist("");
    setDraftSongNote("");
    setDraftQuoteText("");
    setDraftQuoteSource("Saved Answer");
    setDraftQuoteAuthor("");
    setDraftMilestoneTitle("");
    setDraftMilestoneSubtitle("");
  }

  function openComposer(type: ComposerType, { prefillQuoteText }: { prefillQuoteText?: string } = {}) {
    setTypePickerOpen(false);
    setOpenMenuId(null);
    resetComposerDrafts(selectedDateKey);
    if (prefillQuoteText) setDraftQuoteText(prefillQuoteText);
    setComposerType(type);
  }

  function addMoment(moment: Omit<Moment, "id">) {
    const id = `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setMoments((current) => [{ ...moment, id }, ...current]);
  }

  function saveComposer() {
    if (!composerType) return;

    if (composerType === "photo") {
      if (!draftPhotoFile) return;
      const imageUrl = URL.createObjectURL(draftPhotoFile);
      addMoment({
        kind: "photo",
        source: "manual",
        dateKey: draftDateKey,
        timeLabel: "Just now",
        title: draftPhotoCaption.trim() || "Photo Moment",
        imageUrl,
      });
    }

    if (composerType === "song") {
      if (!draftSongTitle.trim() || !draftSongArtist.trim()) return;
      addMoment({
        kind: "song",
        source: "manual",
        dateKey: draftDateKey,
        timeLabel: "Just now",
        title: draftSongTitle.trim(),
        subtitle: draftSongArtist.trim(),
        note: draftSongNote.trim() || undefined,
      });
    }

    if (composerType === "quote") {
      if (!draftQuoteText.trim()) return;
      addMoment({
        kind: "quote",
        source: "manual",
        dateKey: draftDateKey,
        title: draftQuoteSource.trim() || "Quote",
        subtitle: draftQuoteAuthor.trim() || undefined,
        text: `“${draftQuoteText.trim().replace(/^“|”$/g, "")}”`,
      });
    }

    if (composerType === "milestone") {
      if (!draftMilestoneTitle.trim()) return;
      addMoment({
        kind: "milestone",
        source: "manual",
        dateKey: draftDateKey,
        title: draftMilestoneTitle.trim(),
        subtitle: draftMilestoneSubtitle.trim() || undefined,
      });
    }

    setComposerType(null);
    setTypePickerOpen(false);
    setSearchQuery("");
    setFilter("all");
    setViewMode("timeline");
    setSelectedDateKey(draftDateKey);
    setDisplayCount(8);
    window.setTimeout(() => scrollToDate(draftDateKey), 50);
  }

  function openLightboxForMomentId(momentId: string) {
    const eligiblePhotos = filteredMoments.filter((moment) => moment.kind === "photo" && !isLocked(moment));
    const photoIds = eligiblePhotos.map((moment) => moment.id);
    const index = photoIds.indexOf(momentId);
    if (index === -1) return;
    setLightbox({ photoIds, index });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAllOverlays();
        return;
      }

      if (!lightbox) return;
      if (event.key === "ArrowLeft") {
        setLightbox((current) => {
          if (!current) return current;
          return { ...current, index: (current.index - 1 + current.photoIds.length) % current.photoIds.length };
        });
      }
      if (event.key === "ArrowRight") {
        setLightbox((current) => {
          if (!current) return current;
          return { ...current, index: (current.index + 1) % current.photoIds.length };
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!openMenuId) return;
      if (!(event.target instanceof Node)) return;
      const root = document.querySelector(`[data-moment-menu-root="${openMenuId}"]`);
      if (root && root.contains(event.target)) return;
      setOpenMenuId(null);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openMenuId]);

  useEffect(() => {
    if (!highlightedMomentId) return;
    const id = window.setTimeout(() => setHighlightedMomentId(null), 1800);
    return () => window.clearTimeout(id);
  }, [highlightedMomentId]);

  function selectDate(dateKey: string) {
    setSelectedDateKey(dateKey);
    if (viewMode === "timeline") window.setTimeout(() => scrollToDate(dateKey), 50);
  }

  function jumpToMoment(moment: Moment) {
    setViewMode("timeline");
    setSelectedDateKey(moment.dateKey);
    setHighlightedMomentId(moment.id);
    setIsSearchFocused(false);
    window.setTimeout(() => scrollToDate(moment.dateKey), 50);
  }

  function deleteMoment(momentId: string) {
    setMoments((current) => current.filter((moment) => moment.id !== momentId));
    setOpenMenuId(null);
  }

  const calendarMonthLabel = useMemo(() => formatMonthYear(calendarCursorDateKey), [calendarCursorDateKey]);

  const calendarCells = useMemo(() => {
    const firstOfMonth = parseDateKey(calendarCursorDateKey);
    const year = firstOfMonth.getFullYear();
    const monthIndex = firstOfMonth.getMonth();

    const dayCount = new Date(year, monthIndex + 1, 0).getDate();
    const startWeekday = new Date(year, monthIndex, 1).getDay();

    const cells: Array<{ dateKey: string; inMonth: boolean } | null> = [];
    for (let i = 0; i < startWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= dayCount; day += 1) {
      const dateKey = `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
      cells.push({ dateKey, inMonth: true });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [calendarCursorDateKey]);

  const momentsForSelectedDate = useMemo(() => {
    return filteredMoments.filter((moment) => moment.dateKey === selectedDateKey);
  }, [filteredMoments, selectedDateKey]);

  const lightboxMoment = useMemo(() => {
    if (!lightbox) return null;
    const id = lightbox.photoIds[lightbox.index];
    return filteredMoments.find((moment) => moment.id === id) ?? null;
  }, [filteredMoments, lightbox]);

  const isEmpty = filteredMoments.length === 0;

  return (
    <main id="moments-view" className="view active" role="tabpanel" aria-label="Moments">
      <div className="container" ref={containerRef}>
        <div style={{ marginBottom: 16 }}>
          <h1 className="page-title">Moments</h1>
          <p className="page-subtitle">Tiny artifacts that make you two feel close.</p>
        </div>

        <div className="moments-toolbar" aria-label="Moments tools">
          <div className="moments-toolbar-row">
            <div className="view-toggle" role="tablist" aria-label="View modes">
              <button
                type="button"
                className={`view-toggle-btn focus-ring${viewMode === "timeline" ? " active" : ""}`}
                aria-selected={viewMode === "timeline"}
                role="tab"
                onClick={() => setViewMode("timeline")}
              >
                <List aria-hidden="true" />
                <span>Timeline</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn focus-ring${viewMode === "grid" ? " active" : ""}`}
                aria-selected={viewMode === "grid"}
                role="tab"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 aria-hidden="true" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn focus-ring${viewMode === "calendar" ? " active" : ""}`}
                aria-selected={viewMode === "calendar"}
                role="tab"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon aria-hidden="true" />
                <span>Calendar</span>
              </button>
            </div>

            <div className="moments-actions">
              <div className="moments-search" role="search" aria-label="Search moments">
                <Search aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setDisplayCount(8);
                  }}
                  onFocus={() => {
                    if (searchBlurTimeoutRef.current) window.clearTimeout(searchBlurTimeoutRef.current);
                    setIsSearchFocused(true);
                  }}
                  onBlur={() => {
                    searchBlurTimeoutRef.current = window.setTimeout(() => setIsSearchFocused(false), 120);
                  }}
                  placeholder="Search moments…"
                  className="moments-search-input focus-ring"
                  aria-label="Search moments"
                />

                {isSearchFocused && searchQuery.trim().length > 0 && searchableResults.length > 0 ? (
                  <div className="moments-search-results" role="listbox" aria-label="Search results">
                    {searchableResults.map((moment) => {
                      const Icon = getMomentIcon(moment.kind);
                      return (
                        <button
                          key={moment.id}
                          type="button"
                          className="moments-search-item focus-ring"
                          role="option"
                          aria-selected={false}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => jumpToMoment(moment)}
                        >
                          <span className="moments-search-icon" aria-hidden="true">
                            <Icon />
                          </span>
                          <span className="moments-search-main">
                            <span className="moments-search-title">{moment.title ?? "Moment"}</span>
                            <span className="moments-search-sub">
                              {getRelativeDateLabel(moment.dateKey, anchorDateKey)}
                              {moment.subtitle ? ` • ${moment.subtitle}` : ""}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className="add-moment-btn focus-ring pressable"
                onClick={() => setTypePickerOpen(true)}
              >
                <Plus aria-hidden="true" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="filter-pills" role="radiogroup" aria-label="Filter moments">
            {[
              { value: "all", label: "All" },
              { value: "photos", label: "Photos" },
              { value: "songs", label: "Songs" },
              { value: "quotes", label: "Quotes" },
              { value: "milestones", label: "Milestones" },
              { value: "from_games", label: "From Games" },
            ].map((pill) => (
              <button
                key={pill.value}
                type="button"
                className={`filter-pill focus-ring${filter === pill.value ? " active" : ""}`}
                role="radio"
                aria-checked={filter === pill.value}
                onClick={() => {
                  setFilter(pill.value as Filter);
                  setDisplayCount(8);
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "timeline" ? (
          <>
            <OnThisDayHero moments={moments} />

            <div className="calendar-strip no-scrollbar" aria-label="Calendar strip">
              {calendarStripDays.map((day) => {
                const isActive = day.dateKey === selectedDateKey;
                const hasMoments = allMatchingDates.has(day.dateKey);
                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    className={`cal-day focus-ring${isActive ? " active" : ""}${hasMoments ? " has-moments" : ""}`}
                    aria-label={`${day.dayName} ${day.dayNumber}`}
                    aria-pressed={isActive}
                    onClick={() => selectDate(day.dateKey)}
                  >
                    <span className="cal-name">{day.dayName}</span>
                    <div className="cal-num">{day.dayNumber}</div>
                  </button>
                );
              })}
            </div>

            {isEmpty ? (
              <div className="moments-empty" role="status" aria-label="No moments">
                <div className="moments-empty-title">Your memory book starts here.</div>
                <div className="moments-empty-sub">
                  Save a photo, a song, a quote, or a milestone — anything that makes you two feel close.
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setTypePickerOpen(true)}>
                    <Plus aria-hidden="true" />
                    <span>Add your first moment</span>
                  </button>
                  <button type="button" className="btn focus-ring pressable" onClick={() => openComposer("quote", { prefillQuoteText: "I love how…" })}>
                    <Quote aria-hidden="true" />
                    <span>Start with a quote</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="timeline-feed">
                  {sortedDateKeys.map((dateKey) => {
                    const dayMoments = momentsByDateKey.get(dateKey) ?? [];
                    if (dayMoments.length === 0) return null;

                    return (
                      <div key={dateKey} className="timeline-group" id={`moments-date-${dateKey}`}>
                        <div className="date-header">
                          <span className="date-text">{getRelativeDateLabel(dateKey, anchorDateKey)}</span>
                          <div className="date-line" aria-hidden="true" />
                        </div>

                        {dayMoments.map((moment) => {
                          const locked = isLocked(moment);
                          const highlighted = highlightedMomentId === moment.id;

                          if (moment.kind === "photo") {
                            return (
                              <div
                                key={moment.id}
                                className={`photo-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}
                                data-moment-menu-root={moment.id}
                              >
                                <div className="moment-card-actions">
                                  <button
                                    type="button"
                                    className="moment-menu-btn focus-ring"
                                    aria-label="Moment actions"
                                    onClick={() => setOpenMenuId((current) => (current === moment.id ? null : moment.id))}
                                  >
                                    <MoreHorizontal aria-hidden="true" />
                                  </button>
                                </div>

                                <div className="moment-locked-inner">
                                  <button
                                    type="button"
                                    className="photo-open-btn focus-ring"
                                    onClick={() => openLightboxForMomentId(moment.id)}
                                    aria-label="View photo"
                                    disabled={locked}
                                  >
                                    <img src={moment.imageUrl} className="photo-img" alt={moment.title ?? "Photo moment"} />
                                  </button>
                                  <div className="photo-caption">
                                    <span>{moment.title ?? "Photo moment"}</span>
                                    <span style={{ fontSize: 10, color: "#7a7a7a" }}>{moment.timeLabel ?? ""}</span>
                                  </div>
                                </div>

                                {locked ? (
                                  <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                                    <div className="moment-lock-card">
                                      <div className="moment-lock-title">Free plan: 7‑day history</div>
                                      <div className="moment-lock-sub">Upgrade to unlock your full timeline.</div>
                                      <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                        View plans
                                      </button>
                                    </div>
                                  </div>
                                ) : null}

                                {openMenuId === moment.id ? (
                                  <div className="moment-menu" role="menu" aria-label="Moment menu">
                                    <button
                                      type="button"
                                      className="moment-menu-item focus-ring"
                                      role="menuitem"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        openLightboxForMomentId(moment.id);
                                      }}
                                    >
                                      <Camera aria-hidden="true" /> View full
                                    </button>
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => openComposer("photo")}>
                                      <Pencil aria-hidden="true" /> Edit caption
                                    </button>
                                    <button
                                      type="button"
                                      className="moment-menu-item focus-ring"
                                      role="menuitem"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setViewMode("calendar");
                                      }}
                                    >
                                      <CalendarIcon aria-hidden="true" /> Change date
                                    </button>
                                    <div className="moment-menu-sep" aria-hidden="true" />
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                      <Share2 aria-hidden="true" /> Share
                                    </button>
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                      <Download aria-hidden="true" /> Download
                                    </button>
                                    <div className="moment-menu-sep" aria-hidden="true" />
                                    <button type="button" className="moment-menu-item danger focus-ring" role="menuitem" onClick={() => deleteMoment(moment.id)}>
                                      <X aria-hidden="true" /> Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }

                          if (moment.kind === "song") {
                            return (
                              <div
                                key={moment.id}
                                className={`song-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}
                                data-moment-menu-root={moment.id}
                                aria-label="Song moment"
                              >
                                <div className="moment-card-actions">
                                  <button
                                    type="button"
                                    className="moment-menu-btn focus-ring"
                                    aria-label="Moment actions"
                                    onClick={() => setOpenMenuId((current) => (current === moment.id ? null : moment.id))}
                                  >
                                    <MoreHorizontal aria-hidden="true" />
                                  </button>
                                </div>

                                <div className="moment-locked-inner">
                                  <div className="song-art" aria-hidden="true">
                                    <Music style={{ color: "var(--stone)" }} aria-hidden="true" />
                                  </div>
                                  <div className="song-details">
                                    <h4>{moment.title ?? "Song Moment"}</h4>
                                    <p>{moment.subtitle ?? "Artist"}</p>
                                    {moment.note ? <div className="song-note">{moment.note}</div> : null}
                                  </div>
                                  <div className="equalizer" aria-hidden="true">
                                    <div className="bar" style={{ animationDelay: "0s" }} />
                                    <div className="bar" style={{ animationDelay: "0.22s" }} />
                                    <div className="bar" style={{ animationDelay: "0.44s" }} />
                                  </div>
                                </div>

                                {locked ? (
                                  <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                                    <div className="moment-lock-card">
                                      <div className="moment-lock-title">Free plan: 7‑day history</div>
                                      <div className="moment-lock-sub">Upgrade to revisit older moments.</div>
                                      <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                        View plans
                                      </button>
                                    </div>
                                  </div>
                                ) : null}

                                {openMenuId === moment.id ? (
                                  <div className="moment-menu" role="menu" aria-label="Moment menu">
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                      <Music aria-hidden="true" /> View full
                                    </button>
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => openComposer("song")}>
                                      <Pencil aria-hidden="true" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="moment-menu-item focus-ring"
                                      role="menuitem"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setViewMode("calendar");
                                      }}
                                    >
                                      <CalendarIcon aria-hidden="true" /> Change date
                                    </button>
                                    <div className="moment-menu-sep" aria-hidden="true" />
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                      <Share2 aria-hidden="true" /> Share
                                    </button>
                                    <div className="moment-menu-sep" aria-hidden="true" />
                                    <button type="button" className="moment-menu-item danger focus-ring" role="menuitem" onClick={() => deleteMoment(moment.id)}>
                                      <X aria-hidden="true" /> Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }

                          if (moment.kind === "milestone") {
                            return (
                              <div
                                key={moment.id}
                                className={`milestone-card card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}
                                data-moment-menu-root={moment.id}
                              >
                                <div className="moment-card-actions">
                                  <button
                                    type="button"
                                    className="moment-menu-btn focus-ring"
                                    aria-label="Moment actions"
                                    onClick={() => setOpenMenuId((current) => (current === moment.id ? null : moment.id))}
                                  >
                                    <MoreHorizontal aria-hidden="true" />
                                  </button>
                                </div>

                                <div className="moment-locked-inner">
                                  <div className="milestone-icon" aria-hidden="true">
                                    <Trophy aria-hidden="true" />
                                  </div>
                                  <div className="milestone-content">
                                    <div className="milestone-title">{moment.title ?? "Milestone"}</div>
                                    {moment.subtitle ? <div className="milestone-sub">{moment.subtitle}</div> : null}
                                    <div className="milestone-meta">{formatLongDate(moment.dateKey)}</div>
                                  </div>
                                </div>

                                {locked ? (
                                  <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                                    <div className="moment-lock-card">
                                      <div className="moment-lock-title">Free plan: 7‑day history</div>
                                      <div className="moment-lock-sub">Upgrade to unlock your full timeline.</div>
                                      <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                        View plans
                                      </button>
                                    </div>
                                  </div>
                                ) : null}

                                {openMenuId === moment.id ? (
                                  <div className="moment-menu" role="menu" aria-label="Moment menu">
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                      <Trophy aria-hidden="true" /> View full
                                    </button>
                                    <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => openComposer("milestone")}>
                                      <Pencil aria-hidden="true" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="moment-menu-item focus-ring"
                                      role="menuitem"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setViewMode("calendar");
                                      }}
                                    >
                                      <CalendarIcon aria-hidden="true" /> Change date
                                    </button>
                                    <div className="moment-menu-sep" aria-hidden="true" />
                                    <button type="button" className="moment-menu-item danger focus-ring" role="menuitem" onClick={() => deleteMoment(moment.id)}>
                                      <X aria-hidden="true" /> Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }

                          return (
                            <div
                              key={moment.id}
                              className={`daily-card card quote-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}
                              data-moment-menu-root={moment.id}
                              style={{ padding: 24, maxWidth: 560 }}
                            >
                              <div className="moment-card-actions">
                                <button
                                  type="button"
                                  className="moment-menu-btn focus-ring"
                                  aria-label="Moment actions"
                                  onClick={() => setOpenMenuId((current) => (current === moment.id ? null : moment.id))}
                                >
                                  <MoreHorizontal aria-hidden="true" />
                                </button>
                              </div>

                              <div className="moment-locked-inner">
                                <div className="card-label" style={{ marginBottom: 12 }}>
                                  {moment.title ?? "Saved"}
                                  {moment.subtitle ? <span className="source-badge">{moment.subtitle}</span> : null}
                                </div>
                                <p className="quote-text">{moment.text ?? "“A moment you’ll want to remember.”"}</p>
                              </div>

                              {locked ? (
                                <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                                  <div className="moment-lock-card">
                                    <div className="moment-lock-title">Free plan: 7‑day history</div>
                                    <div className="moment-lock-sub">Upgrade to unlock older moments.</div>
                                    <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                      View plans
                                    </button>
                                  </div>
                                </div>
                              ) : null}

                              {openMenuId === moment.id ? (
                                <div className="moment-menu" role="menu" aria-label="Moment menu">
                                  <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                    <Quote aria-hidden="true" /> View full
                                  </button>
                                  <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => openComposer("quote")}>
                                    <Pencil aria-hidden="true" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="moment-menu-item focus-ring"
                                    role="menuitem"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setViewMode("calendar");
                                    }}
                                  >
                                    <CalendarIcon aria-hidden="true" /> Change date
                                  </button>
                                  <div className="moment-menu-sep" aria-hidden="true" />
                                  <button type="button" className="moment-menu-item focus-ring" role="menuitem" onClick={() => setOpenMenuId(null)}>
                                    <Share2 aria-hidden="true" /> Share
                                  </button>
                                  <div className="moment-menu-sep" aria-hidden="true" />
                                  <button type="button" className="moment-menu-item danger focus-ring" role="menuitem" onClick={() => deleteMoment(moment.id)}>
                                    <X aria-hidden="true" /> Delete
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {filteredMoments.length > visibleMoments.length ? (
                  <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                    <button type="button" className="btn focus-ring pressable" onClick={() => setDisplayCount((c) => c + 6)}>
                      Load more
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}

        {viewMode === "grid" ? (
          <>
            {isEmpty ? (
              <div className="moments-empty" role="status" aria-label="No moments">
                <div className="moments-empty-title">No moments match this filter.</div>
                <div className="moments-empty-sub">Try a different filter — or add something new.</div>
                <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setTypePickerOpen(true)}>
                  <Plus aria-hidden="true" />
                  <span>Add a moment</span>
                </button>
              </div>
            ) : (
              <div className="moments-grid" aria-label="Moments grid">
                {filteredMoments.map((moment) => {
                  const locked = isLocked(moment);
                  const highlighted = highlightedMomentId === moment.id;

                  if (moment.kind === "photo") {
                    return (
                      <div
                        key={moment.id}
                        className={`photo-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}
                        style={{ width: "100%", transform: "rotate(-0.6deg)" }}
                      >
                        <div className="moment-locked-inner">
                          <button type="button" className="photo-open-btn focus-ring" onClick={() => openLightboxForMomentId(moment.id)} disabled={locked}>
                            <img src={moment.imageUrl} className="photo-img" alt={moment.title ?? "Photo moment"} />
                          </button>
                          <div className="photo-caption">
                            <span>{moment.title ?? "Photo moment"}</span>
                            <span style={{ fontSize: 10, color: "#7a7a7a" }}>{moment.timeLabel ?? ""}</span>
                          </div>
                        </div>

                        {locked ? (
                          <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                            <div className="moment-lock-card">
                              <div className="moment-lock-title">Free plan: 7‑day history</div>
                              <div className="moment-lock-sub">Upgrade to unlock older moments.</div>
                              <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                View plans
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (moment.kind === "song") {
                    return (
                      <div key={moment.id} className={`song-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}>
                        <div className="moment-locked-inner">
                          <div className="song-art" aria-hidden="true">
                            <Music style={{ color: "var(--stone)" }} aria-hidden="true" />
                          </div>
                          <div className="song-details">
                            <h4>{moment.title ?? "Song Moment"}</h4>
                            <p>{moment.subtitle ?? "Artist"}</p>
                            {moment.note ? <div className="song-note">{moment.note}</div> : null}
                          </div>
                          <div className="equalizer" aria-hidden="true">
                            <div className="bar" style={{ animationDelay: "0s" }} />
                            <div className="bar" style={{ animationDelay: "0.22s" }} />
                            <div className="bar" style={{ animationDelay: "0.44s" }} />
                          </div>
                        </div>

                        {locked ? (
                          <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                            <div className="moment-lock-card">
                              <div className="moment-lock-title">Free plan: 7‑day history</div>
                              <div className="moment-lock-sub">Upgrade to unlock older moments.</div>
                              <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                View plans
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (moment.kind === "milestone") {
                    return (
                      <div key={moment.id} className={`milestone-card card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`}>
                        <div className="moment-locked-inner">
                          <div className="milestone-icon" aria-hidden="true">
                            <Trophy aria-hidden="true" />
                          </div>
                          <div className="milestone-content">
                            <div className="milestone-title">{moment.title ?? "Milestone"}</div>
                            {moment.subtitle ? <div className="milestone-sub">{moment.subtitle}</div> : null}
                            <div className="milestone-meta">{formatLongDate(moment.dateKey)}</div>
                          </div>
                        </div>

                        {locked ? (
                          <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                            <div className="moment-lock-card">
                              <div className="moment-lock-title">Free plan: 7‑day history</div>
                              <div className="moment-lock-sub">Upgrade to unlock older moments.</div>
                              <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                                View plans
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <div key={moment.id} className={`daily-card card quote-card${highlighted ? " moment-highlight" : ""}${locked ? " moment-locked" : ""}`} style={{ padding: 22 }}>
                      <div className="moment-locked-inner">
                        <div className="card-label" style={{ marginBottom: 12 }}>
                          {moment.title ?? "Saved"}
                          {moment.subtitle ? <span className="source-badge">{moment.subtitle}</span> : null}
                        </div>
                        <p className="quote-text">{moment.text ?? "“A moment you’ll want to remember.”"}</p>
                      </div>

                      {locked ? (
                        <div className="moment-lock-overlay" aria-label="Upgrade to unlock">
                          <div className="moment-lock-card">
                            <div className="moment-lock-title">Free plan: 7‑day history</div>
                            <div className="moment-lock-sub">Upgrade to unlock older moments.</div>
                            <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setViewMode("calendar")}>
                              View plans
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}

        {viewMode === "calendar" ? (
          <div className="moments-calendar-wrap" aria-label="Moments calendar view">
            <div className="moments-calendar">
              <div className="calendar-header">
                <button
                  type="button"
                  className="calendar-nav-btn focus-ring"
                  aria-label="Previous month"
                  onClick={() => {
                    const current = parseDateKey(calendarCursorDateKey);
                    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
                    setCalendarCursorDateKey(toDateKey(prev));
                  }}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <div className="calendar-month">{calendarMonthLabel}</div>
                <button
                  type="button"
                  className="calendar-nav-btn focus-ring"
                  aria-label="Next month"
                  onClick={() => {
                    const current = parseDateKey(calendarCursorDateKey);
                    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
                    setCalendarCursorDateKey(toDateKey(next));
                  }}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>

              <div className="calendar-days" aria-label="Days of month">
                {["S", "M", "T", "W", "T", "F", "S"].map((label) => (
                  <div key={label} className="calendar-day-header" aria-hidden="true">
                    {label}
                  </div>
                ))}

                {calendarCells.map((cell, index) => {
                  if (!cell) return <div key={`empty-${index}`} className="calendar-day empty" aria-hidden="true" />;
                  const isSelected = cell.dateKey === selectedDateKey;
                  const isToday = cell.dateKey === anchorDateKey;
                  const hasMoments = allMatchingDates.has(cell.dateKey);
                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      className={`calendar-day focus-ring${isSelected ? " selected" : ""}${isToday ? " today" : ""}${hasMoments ? " has-moments" : ""}`}
                      onClick={() => selectDate(cell.dateKey)}
                      aria-label={formatLongDate(cell.dateKey)}
                      aria-pressed={isSelected}
                    >
                      <span className="calendar-day-num">{Number(cell.dateKey.slice(-2))}</span>
                      {hasMoments ? <span className="calendar-dot" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="calendar-day-feed" aria-label="Moments for selected date">
              <div className="date-header" style={{ marginTop: 18 }}>
                <span className="date-text">{getRelativeDateLabel(selectedDateKey, anchorDateKey)}</span>
                <div className="date-line" aria-hidden="true" />
              </div>

              {momentsForSelectedDate.length === 0 ? (
                <div className="moments-empty" role="status" aria-label="No moments for date">
                  <div className="moments-empty-title">Nothing saved yet.</div>
                  <div className="moments-empty-sub">Add a moment for this day to grow your timeline.</div>
                  <button type="button" className="btn btn-primary focus-ring pressable" onClick={() => setTypePickerOpen(true)}>
                    <Plus aria-hidden="true" />
                    <span>Add a moment</span>
                  </button>
                </div>
              ) : (
                <div className="calendar-mini-list">
                  {momentsForSelectedDate.map((moment) => {
                    const Icon = getMomentIcon(moment.kind);
                    return (
                      <button key={moment.id} type="button" className="calendar-mini-item focus-ring" onClick={() => jumpToMoment(moment)}>
                        <span className="calendar-mini-icon" aria-hidden="true">
                          <Icon />
                        </span>
                        <span className="calendar-mini-main">
                          <span className="calendar-mini-title">{moment.title ?? "Moment"}</span>
                          <span className="calendar-mini-sub">
                            {moment.kind.toUpperCase().replace("_", " ")}
                            {moment.subtitle ? ` • ${moment.subtitle}` : ""}
                          </span>
                        </span>
                        <ChevronRight aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="add-moment-fab focus-ring pressable"
          aria-label="Add a moment"
          onClick={() => setTypePickerOpen(true)}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>

      {typePickerOpen ? (
        <div className="sheet active" role="dialog" aria-modal="true" aria-label="Add a moment">
          <div className="sheet-card" role="document">
            <div className="sheet-top">
              <div className="sheet-title">Add a Moment</div>
              <button type="button" className="sheet-close focus-ring" aria-label="Close" onClick={() => setTypePickerOpen(false)}>
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="sheet-grid" aria-label="Moment types">
              <button type="button" className="sheet-tile focus-ring" onClick={() => openComposer("photo")}>
                <span className="sheet-tile-icon" aria-hidden="true">
                  <Camera />
                </span>
                <span className="sheet-tile-title">Photo</span>
                <span className="sheet-tile-sub">Polaroid-style</span>
              </button>
              <button type="button" className="sheet-tile focus-ring" onClick={() => openComposer("song")}>
                <span className="sheet-tile-icon" aria-hidden="true">
                  <Music />
                </span>
                <span className="sheet-tile-title">Song</span>
                <span className="sheet-tile-sub">Little soundtrack</span>
              </button>
              <button type="button" className="sheet-tile focus-ring" onClick={() => openComposer("quote")}>
                <span className="sheet-tile-icon" aria-hidden="true">
                  <Quote />
                </span>
                <span className="sheet-tile-title">Quote</span>
                <span className="sheet-tile-sub">Saved words</span>
              </button>
              <button type="button" className="sheet-tile focus-ring" onClick={() => openComposer("milestone")}>
                <span className="sheet-tile-icon" aria-hidden="true">
                  <Trophy />
                </span>
                <span className="sheet-tile-title">Milestone</span>
                <span className="sheet-tile-sub">Big moments</span>
              </button>
            </div>

            <div className="sheet-recent" aria-label="From recent activity">
              <div className="sheet-recent-label">From Recent Activity</div>
              <button
                type="button"
                className="sheet-recent-item focus-ring"
                onClick={() =>
                  openComposer("quote", {
                    prefillQuoteText: "Grateful for you today because…",
                  })
                }
              >
                <span aria-hidden="true">💭</span>
                <span>Save today’s gratitude exchange</span>
              </button>
              <button
                type="button"
                className="sheet-recent-item focus-ring"
                onClick={() =>
                  openComposer("quote", {
                    prefillQuoteText: "A card answer I want to remember…",
                  })
                }
              >
                <span aria-hidden="true">🃏</span>
                <span>Save a card answer from Connect</span>
              </button>
            </div>

            <button type="button" className="sheet-cancel focus-ring" onClick={() => setTypePickerOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {composerType ? (
        <div className="modal active" role="dialog" aria-modal="true" aria-label="Create moment">
          <div className="modal-card" role="document">
            <div className="modal-top">
              <div className="modal-title">
                {composerType === "photo" ? <Camera aria-hidden="true" /> : null}
                {composerType === "song" ? <Music aria-hidden="true" /> : null}
                {composerType === "quote" ? <Quote aria-hidden="true" /> : null}
                {composerType === "milestone" ? <Trophy aria-hidden="true" /> : null}
                <span>
                  Add{" "}
                  {composerType === "photo"
                    ? "Photo"
                    : composerType === "song"
                      ? "Song"
                      : composerType === "quote"
                        ? "Quote"
                        : "Milestone"}
                </span>
              </div>
              <button type="button" className="modal-close focus-ring" aria-label="Close" onClick={() => setComposerType(null)}>
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              <div className="moment-form">
                <div className="moment-form-row">
                  <label className="moment-field" aria-label="Date">
                    <span className="moment-label">Date</span>
                    <input
                      type="date"
                      className="moment-input focus-ring"
                      value={draftDateKey}
                      onChange={(event) => setDraftDateKey(event.target.value)}
                    />
                  </label>
                </div>

                {composerType === "photo" ? (
                  <>
                    <div className="moment-upload">
                      <input
                        type="file"
                        accept="image/*"
                        className="moment-file-input"
                        onChange={(event) => setDraftPhotoFile(event.target.files?.[0] ?? null)}
                        aria-label="Choose a photo"
                      />
                      <div className="moment-upload-inner">
                        {draftPhotoFile ? (
                          <img src={draftPhotoPreviewUrl ?? ""} alt="Selected photo preview" className="moment-upload-preview" />
                        ) : (
                          <>
                            <Camera aria-hidden="true" />
                            <div className="moment-upload-title">Tap to choose a photo</div>
                            <div className="moment-upload-sub">A small artifact you’ll love revisiting.</div>
                          </>
                        )}
                      </div>
                    </div>

                    <label className="moment-field">
                      <span className="moment-label">Caption (optional)</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftPhotoCaption}
                        onChange={(event) => setDraftPhotoCaption(event.target.value)}
                        placeholder="Morning coffee, us vibes…"
                      />
                    </label>
                  </>
                ) : null}

                {composerType === "song" ? (
                  <>
                    <label className="moment-field">
                      <span className="moment-label">Song</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftSongTitle}
                        onChange={(event) => setDraftSongTitle(event.target.value)}
                        placeholder="Thinking Out Loud"
                      />
                    </label>
                    <label className="moment-field">
                      <span className="moment-label">Artist</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftSongArtist}
                        onChange={(event) => setDraftSongArtist(event.target.value)}
                        placeholder="Ed Sheeran"
                      />
                    </label>
                    <label className="moment-field">
                      <span className="moment-label">Why this song? (optional)</span>
                      <textarea
                        className="moment-textarea focus-ring"
                        value={draftSongNote}
                        onChange={(event) => setDraftSongNote(event.target.value)}
                        placeholder="This came on during our first date…"
                        rows={3}
                      />
                    </label>
                  </>
                ) : null}

                {composerType === "quote" ? (
                  <>
                    <label className="moment-field">
                      <span className="moment-label">Source badge</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftQuoteSource}
                        onChange={(event) => setDraftQuoteSource(event.target.value)}
                        placeholder="Saved Answer"
                      />
                    </label>
                    <label className="moment-field">
                      <span className="moment-label">Quote</span>
                      <textarea
                        className="moment-textarea focus-ring"
                        value={draftQuoteText}
                        onChange={(event) => setDraftQuoteText(event.target.value)}
                        placeholder="The best thing to hold onto in life is each other…"
                        rows={4}
                      />
                    </label>
                    <label className="moment-field">
                      <span className="moment-label">Author / context (optional)</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftQuoteAuthor}
                        onChange={(event) => setDraftQuoteAuthor(event.target.value)}
                        placeholder="Audrey Hepburn / You, last night"
                      />
                    </label>
                  </>
                ) : null}

                {composerType === "milestone" ? (
                  <>
                    <label className="moment-field">
                      <span className="moment-label">Title</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftMilestoneTitle}
                        onChange={(event) => setDraftMilestoneTitle(event.target.value)}
                        placeholder="100 Days Together"
                      />
                    </label>
                    <label className="moment-field">
                      <span className="moment-label">Details (optional)</span>
                      <input
                        className="moment-input focus-ring"
                        value={draftMilestoneSubtitle}
                        onChange={(event) => setDraftMilestoneSubtitle(event.target.value)}
                        placeholder="What made it special?"
                      />
                    </label>
                  </>
                ) : null}

                <div className="moment-form-actions">
                  <button type="button" className="btn focus-ring pressable" onClick={() => setComposerType(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary focus-ring pressable" onClick={saveComposer}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {lightbox && lightboxMoment && lightboxMoment.kind === "photo" ? (
        <div className="lightbox active" role="dialog" aria-modal="true" aria-label="Photo lightbox">
          <div className="lightbox-top">
            <button type="button" className="lightbox-close focus-ring" aria-label="Close" onClick={() => setLightbox(null)}>
              <X aria-hidden="true" />
            </button>
            <div className="lightbox-actions">
              <button type="button" className="lightbox-icon focus-ring" aria-label="Share">
                <Share2 aria-hidden="true" />
              </button>
              <button type="button" className="lightbox-icon focus-ring" aria-label="Download">
                <Download aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lightbox-stage" aria-label="Photo">
            <button
              type="button"
              className="lightbox-nav focus-ring"
              aria-label="Previous photo"
              onClick={() =>
                setLightbox((current) => {
                  if (!current) return current;
                  return { ...current, index: (current.index - 1 + current.photoIds.length) % current.photoIds.length };
                })
              }
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <img src={lightboxMoment.imageUrl} className="lightbox-img" alt={lightboxMoment.title ?? "Photo moment"} />

            <button
              type="button"
              className="lightbox-nav focus-ring"
              aria-label="Next photo"
              onClick={() =>
                setLightbox((current) => {
                  if (!current) return current;
                  return { ...current, index: (current.index + 1) % current.photoIds.length };
                })
              }
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <div className="lightbox-bottom">
            <div className="lightbox-caption">{lightboxMoment.title ?? "Photo moment"}</div>
            <div className="lightbox-meta">
              {formatLongDate(lightboxMoment.dateKey)}
              {lightboxMoment.timeLabel ? ` • ${lightboxMoment.timeLabel}` : ""}
            </div>
            <div className="lightbox-counter">
              {lightbox.index + 1} / {lightbox.photoIds.length}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
