"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Loader2, 
  X, 
  CheckCircle, 
  Ban, 
  Eye, 
  HelpCircle 
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { 
  useGetAllMyCampaignsQuery, 
  useCancelCampaignMutation,
  useCompleteCampaignMutation
} from "@/redux/features/campaign/campaignApi";
import toast from "react-hot-toast";

export default function MyCampaignsPage() {
  const { data: response, isLoading, refetch } = useGetAllMyCampaignsQuery(undefined);
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelCampaignMutation();
  const [completeCampaign, { isLoading: isCompleting }] = useCompleteCampaignMutation();
  const isUpdating = isCancelling || isCompleting;
  const campaigns = response?.data || [];

  // Story Modal State
  const [selectedStory, setSelectedStory] = useState<{ name: string; story: string } | null>(null);
  
  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<{
    campaignId: string;
    campaignName: string;
    action: "completed" | "cancelled";
  } | null>(null);
  const [cancelledReason, setCancelledReason] = useState("");

  const handleStatusUpdate = async () => {
    if (!confirmAction) return;
    const { campaignId, action } = confirmAction;

    try {
      const res = action === "completed" 
        ? await completeCampaign(campaignId).unwrap()
        : await cancelCampaign({ campaignId, cancelledReason }).unwrap();

      if (res.success) {
        toast.success(`Campaign ${action === "completed" ? "completed" : "cancelled"} successfully!`);
        refetch();
      } else {
        toast.error(res.message || "Failed to update campaign status.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong.");
    } finally {
      setConfirmAction(null);
      setCancelledReason("");
    }
  };

  const formatCategory = (category: string) => {
    if (!category) return "N/A";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
            <Sparkles className="size-7" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">My Campaigns</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage and monitor all your fundraising campaigns.</p>
          </div>
        </div>
      </section>

      <DashboardCard className="p-0 bg-white border border-border">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-base font-semibold">Fundraisers List</h3>
          <p className="text-sm font-medium text-muted-foreground">
            {campaigns.length} {campaigns.length === 1 ? "Campaign" : "Campaigns"}
          </p>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 animate-spin text-secondary" />
              <p className="text-sm text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center p-4">
              <Sparkles className="size-12 text-slate-300 mb-2" />
              <p className="text-base font-semibold text-muted-foreground">
                You haven&apos;t created any campaigns yet.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="text-xs font-semibold text-muted-foreground bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3">Campaign Details</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Raised</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((campaign: any) => {
                  const isStoryClickable = !!campaign.story;
                  return (
                    <tr key={campaign._id} className="transition-colors duration-300 hover:bg-secondary/5">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {campaign.thumbnail && (
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={campaign.thumbnail}
                                alt={campaign.name}
                                className="absolute inset-0 size-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p 
                              onClick={() => isStoryClickable && setSelectedStory({ name: campaign.name, story: campaign.story })}
                              className={`font-semibold text-foreground truncate max-w-[240px] ${isStoryClickable ? "cursor-pointer hover:text-secondary underline decoration-dotted" : ""}`}
                              title={isStoryClickable ? "Click to view full story" : undefined}
                            >
                              {campaign.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {campaign.durationDays} Days Duration
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-semibold text-slate-600">
                        {campaign.campaignCode || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-700">
                        {formatCategory(campaign.campaignCategory)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        ${(campaign.goalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-secondary">${(campaign.raisedAmount || 0).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {campaign.progress ? campaign.progress.toFixed(1) : 0}% of goal
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          campaign.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : campaign.status === "completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {campaign.story && (
                            <Button
                              onClick={() => setSelectedStory({ name: campaign.name, story: campaign.story })}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1 border-slate-200 text-slate-600 cursor-pointer"
                            >
                              <Eye className="size-3.5" />
                              View Story
                            </Button>
                          )}
                          {campaign.status === "active" && (
                            <>
                              <Button
                                onClick={() => setConfirmAction({
                                  campaignId: campaign._id,
                                  campaignName: campaign.name,
                                  action: "completed"
                                })}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1 border-secondary text-secondary hover:bg-secondary/10 cursor-pointer"
                              >
                                <CheckCircle className="size-3.5" />
                                Complete
                              </Button>
                              <Button
                                onClick={() => setConfirmAction({
                                  campaignId: campaign._id,
                                  campaignName: campaign.name,
                                  action: "cancelled"
                                })}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Ban className="size-3.5" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </DashboardCard>

      {/* Story Details Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-2 pr-8">{selectedStory.name}</h3>
            <p className="text-xs text-secondary font-semibold mb-4">Campaign Description / Story</p>
            <div className="border-t border-slate-100 pt-4 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {selectedStory.story}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedStory(null)} className="h-10 px-5 cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <HelpCircle className="size-8" />
              <h3 className="text-lg font-bold text-foreground">Confirm Action</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to <strong>{confirmAction.action === "completed" ? "early complete" : "cancel"}</strong> the campaign <strong>&quot;{confirmAction.campaignName}&quot;</strong>? 
              <br />
              <span className="text-xs text-red-500 mt-2 block font-medium">This action cannot be undone.</span>
            </p>
            {confirmAction.action === "cancelled" && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={cancelledReason}
                  onChange={(e) => setCancelledReason(e.target.value)}
                  placeholder="Please enter a reason (e.g. This campaign is cancelled due to rain)"
                  rows={3}
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition-all duration-300 focus:border-red-500 resize-none"
                />
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmAction(null);
                  setCancelledReason("");
                }}
                className="h-10 border-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || (confirmAction.action === "cancelled" && !cancelledReason.trim())}
                className={`h-10 px-5 text-white cursor-pointer ${confirmAction.action === "completed" ? "bg-secondary hover:bg-secondary/90" : "bg-red-600 hover:bg-red-700"}`}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1" />
                    Updating...
                  </>
                ) : (
                  confirmAction.action === "completed" ? "Complete Campaign" : "Cancel Campaign"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
