import Image from "next/image";
import { Camera, Eye, Upload } from "lucide-react";
import user from "@/assets/user.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const profileFields = [
  { id: "first-name", label: "First Name", defaultValue: "Jennifer", autoComplete: "given-name" },
  { id: "last-name", label: "Last Name", defaultValue: "Park", autoComplete: "family-name" },
] as const;

const passwordFields = [
  { id: "current-password", label: "Current Password", autoComplete: "current-password" },
  { id: "new-password", label: "New Password", autoComplete: "new-password" },
  { id: "confirm-new-password", label: "Confirm New Password", autoComplete: "new-password" },
] as const;

export default function SettingsPage() {
  return (
    <div className="max-w-[760px] space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Account Settings</h2>
        <p className="mt-2 text-sm text-muted-foreground">Manage your profile, security, and notification preferences.</p>
      </header>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Profile Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">Update your public organizer profile.</p>
        </div>

        <form className="space-y-5 px-5 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative size-16 shrink-0">
              <Image src={user} alt="Jennifer Park profile" className="size-16 rounded-lg object-cover" />
              <span className="absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full bg-secondary text-white ring-2 ring-white">
                <Camera className="size-3.5" />
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Profile Photo</h4>
              <label htmlFor="profile-photo" className="mt-1 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary">
                <Upload className="size-4" />
                Upload photo
              </label>
              <input id="profile-photo" name="profilePhoto" type="file" accept="image/*" className="sr-only" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
                  {field.label}
                </label>
                <Input id={field.id} name={field.id} defaultValue={field.defaultValue} autoComplete={field.autoComplete} className="h-11 rounded-2xl border-border text-sm" />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <Input id="email" name="email" type="email" defaultValue="jen.park@gmail.com" autoComplete="email" className="h-11 rounded-2xl border-border text-sm" />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <Input id="phone" name="phone" type="tel" defaultValue="+1 (312) 555-0192" autoComplete="tel" className="h-11 rounded-2xl border-border text-sm" />
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" className="bg-secondary px-6 text-xs hover:bg-secondary/90">
              Save Changes
            </Button>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Change Password</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
        </div>

        <form className="space-y-5 px-5 py-6">
          {passwordFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
                {field.label}
              </label>
              <div className="relative">
                <Input
                  id={field.id}
                  name={field.id}
                  type="password"
                  defaultValue="password"
                  autoComplete={field.autoComplete}
                  className="h-11 rounded-2xl border-border pr-12 text-sm"
                />
                <button
                  type="button"
                  aria-label={`Show ${field.label.toLowerCase()}`}
                  className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground transition-colors duration-300 hover:text-secondary"
                >
                  <Eye className="size-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-3">
            <Button type="submit" className="bg-secondary px-6 text-xs hover:bg-secondary/90">
              Update Password
            </Button>
          </div>
        </form>
      </DashboardCard>
    </div>
  );
}

