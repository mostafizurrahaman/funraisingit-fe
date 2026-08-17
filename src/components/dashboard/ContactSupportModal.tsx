"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Mail, FileText, Layout, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/utils/baseUrl";
import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetAllMyCampaignsQuery } from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

interface ContactSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactSupportModal({ open, onOpenChange }: ContactSupportModalProps) {
  const token = useSelector(userCurrentToken);
  const { data: profileResponse } = useGetMeQuery(undefined, { skip: !token });
  const profileData = profileResponse?.data;
  const userEmail = profileData?.email || "";

  const { data: campaignsResponse } = useGetAllMyCampaignsQuery(undefined, { skip: !token });
  const campaigns = campaignsResponse?.data || [];

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [campaign, setCampaign] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Sync user email when loaded
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsPending(true);
    try {
      const payload: Record<string, string> = {
        email,
        subject,
        message,
      };

      if (campaign) {
        payload.campaign = campaign;
      }

      const response = await fetch(`${BASE_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data?.success !== false) {
        toast.success(data?.message || "Support request submitted successfully!");
        setSubject("");
        setCampaign("");
        setMessage("");
        onOpenChange(false);
      } else {
        toast.error(data?.message || "Failed to submit support request.");
      }
    } catch (err) {
      console.error("Support ticket submission error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl outline-none sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-800">
                Contact Support
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-1">
                Let us know how we can help you with your campaigns.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 transition-colors duration-300 hover:bg-secondary/10 hover:text-secondary"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="support-email" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Mail className="size-4 text-secondary" />
                Email Address *
              </label>
              <Input
                id="support-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="mt-1.5 h-11 w-full border-slate-300 focus:border-secondary focus:ring-secondary/20"
              />
            </div>

            <div>
              <label htmlFor="support-subject" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <FileText className="size-4 text-secondary" />
                Subject *
              </label>
              <Input
                id="support-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Example: Campaign issue for payment"
                className="mt-1.5 h-11 w-full border-slate-300 focus:border-secondary focus:ring-secondary/20"
              />
            </div>

            <div>
              <label htmlFor="support-campaign" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Layout className="size-4 text-secondary" />
                Related Campaign (Optional)
              </label>
              <select
                id="support-campaign"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="mt-1.5 flex h-11 w-full rounded-md border border-slate-300 px-3 text-sm bg-white text-foreground outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 cursor-pointer"
              >
                <option value="">Select a campaign (optional)</option>
                {campaigns.map((camp: any) => (
                  <option key={camp._id} value={camp._id}>
                    {camp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="support-message" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <MessageSquare className="size-4 text-secondary" />
                Message *
              </label>
              <Textarea
                id="support-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="mt-1.5 w-full border-slate-300 focus:border-secondary focus:ring-secondary/20"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="border-secondary text-secondary hover:bg-secondary/5 h-11 px-5">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isPending} className="h-11 min-w-32 bg-primary text-white hover:bg-primary/95">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                    Sending...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
