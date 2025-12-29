import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { NavRail } from "@/components/layout/NavRail";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingItem } from "@/components/settings/SettingItem";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { ConfirmDialog } from "@/components/settings/ConfirmDialog";
import { MobileNav } from "@/components/chat/MobileNav";

const toneOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "gentle", label: "Gentle" },
  { value: "direct", label: "Direct" },
  { value: "warm", label: "Warm" },
  { value: "curious", label: "Curious" },
  { value: "analytical", label: "Analytical" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Settings state
  const [tone, setTone] = useState("balanced");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  
  // Dialog state
  const [clearHistoryDialog, setClearHistoryDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  const handleToneChange = (value: string) => {
    setTone(value);
    toast.success("Tone updated");
  };

  const handleToggle = (setting: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    toast.success("Setting updated");
  };

  const handleExport = () => {
    toast.success("Preparing export...");
  };

  const handleClearHistory = () => {
    setClearHistoryDialog(false);
    toast.success("Conversation history cleared");
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountDialog(false);
    toast.success("Account deletion initiated");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const handleChangePassword = () => {
    toast.success("Password reset email sent");
  };

  return (
    <div className="flex h-screen bg-background">
      <NavRail />

      <main className="flex-1 flex flex-col overflow-hidden max-xs:pb-16">
        <SettingsHeader
          title="Settings"
          subtitle="Customize your Orivya experience"
        />

        <div className="flex-1 overflow-y-auto p-8 max-md:p-6 max-xs:p-4">
          <div className="max-w-[640px] mx-auto">
            {/* Profile Section */}
            <SettingsSection title="Profile">
              <ProfileSection
                name={user?.email?.split("@")[0] || "Your Name"}
                email={user?.email || "you@example.com"}
                onEdit={() => {}}
              />
            </SettingsSection>

            {/* Preferences Section */}
            <SettingsSection title="Preferences">
              <SettingItem
                label="Orivya's Tone"
                description="How Orivya communicates with you"
              >
                <SettingsSelect
                  value={tone}
                  options={toneOptions}
                  onChange={handleToneChange}
                />
              </SettingItem>
              <SettingItem
                label="Daily Reflection Reminder"
                description="Get a gentle nudge to check in"
              >
                <SettingsToggle
                  active={dailyReminder}
                  onChange={(v) => handleToggle("dailyReminder", v, setDailyReminder)}
                />
              </SettingItem>
              <SettingItem
                label="Weekly Pattern Report"
                description="Receive insights about your patterns"
              >
                <SettingsToggle
                  active={weeklyReport}
                  onChange={(v) => handleToggle("weeklyReport", v, setWeeklyReport)}
                />
              </SettingItem>
              <SettingItem
                label="Sound Effects"
                description="Subtle audio feedback"
                isLast
              >
                <SettingsToggle
                  active={soundEffects}
                  onChange={(v) => handleToggle("soundEffects", v, setSoundEffects)}
                />
              </SettingItem>
            </SettingsSection>

            {/* Privacy & Data Section */}
            <SettingsSection title="Privacy & Data">
              <SettingItem
                label="Export Your Data"
                description="Download all your sessions and insights"
              >
                <SettingsButton onClick={handleExport}>Export</SettingsButton>
              </SettingItem>
              <SettingItem
                label="Clear Conversation History"
                description="Remove all past sessions"
              >
                <SettingsButton
                  variant="danger"
                  onClick={() => setClearHistoryDialog(true)}
                >
                  Clear
                </SettingsButton>
              </SettingItem>
              <SettingItem
                label="Delete Account"
                description="Permanently delete your account and data"
                isLast
              >
                <SettingsButton
                  variant="danger"
                  onClick={() => setDeleteAccountDialog(true)}
                >
                  Delete
                </SettingsButton>
              </SettingItem>
            </SettingsSection>

            {/* Account Section */}
            <SettingsSection title="Account">
              <SettingItem
                label="Change Password"
                description="Update your account password"
              >
                <SettingsButton onClick={handleChangePassword}>Change</SettingsButton>
              </SettingItem>
              <SettingItem
                label="Sign Out"
                description="Sign out of this device"
                isLast
              >
                <SettingsButton onClick={handleSignOut}>Sign Out</SettingsButton>
              </SettingItem>
            </SettingsSection>

            {/* Footer Links */}
            <div className="mt-8 pt-5 border-t border-border-subtle">
              <div className="flex flex-wrap gap-4">
                <Link to="/privacy" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
                  Terms of Service
                </Link>
                <a href="#" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
                  Help & Support
                </a>
                <a href="#" className="text-[13px] text-tertiary-foreground hover:text-sage transition-colors duration-150">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={clearHistoryDialog}
        onOpenChange={setClearHistoryDialog}
        title="Clear Conversation History"
        description="This will permanently delete all your past sessions. This action cannot be undone."
        confirmLabel="Clear History"
        onConfirm={handleClearHistory}
        variant="danger"
      />

      <ConfirmDialog
        open={deleteAccountDialog}
        onOpenChange={setDeleteAccountDialog}
        title="Delete Account"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Delete Account"
        onConfirm={handleDeleteAccount}
        variant="danger"
      />
    </div>
  );
}
