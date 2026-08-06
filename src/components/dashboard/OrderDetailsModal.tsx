"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, Mail, MapPin, Package, Phone, ShoppingBag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OrderDetails = {
  id: string;
  customer: string;
  email: string;
  contact: string;
  product: string;
  quantity: number;
  delivery: "Pickup" | "Delivery" | "Shipping";
  total: string;
  date: string;
  status: string;
};

const deliveryTone: Record<OrderDetails["delivery"], string> = {
  Pickup: "bg-emerald-100 text-emerald-700",
  Delivery: "bg-blue-100 text-blue-700",
  Shipping: "bg-violet-100 text-violet-700",
};

export function OrderDetailsModal({ order }: { order: OrderDetails }) {
  const contactLines = order.contact.split("\n");
  const dateLines = order.date.split("\n");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary">
          View
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-white p-0 text-foreground shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">Order Details</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">{order.id} from {order.customer}</Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <X className="size-5" />
              <span className="sr-only">Close order details</span>
            </Dialog.Close>
          </div>

          <div className="space-y-5 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryItem icon={ShoppingBag} label="Order Total" value={order.total} />
              <SummaryItem icon={Package} label="Quantity" value={`${order.quantity} item${order.quantity > 1 ? "s" : ""}`} />
              <SummaryItem icon={Truck} label="Delivery" value={order.delivery} badgeClassName={deliveryTone[order.delivery]} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold">Customer</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <DetailRow icon={Mail} label="Email" value={order.email} />
                  <DetailRow icon={Phone} label="Phone" value={contactLines.at(-1) ?? ""} />
                  <DetailRow icon={MapPin} label="Address" value={contactLines.slice(0, -1).join(", ")} />
                </div>
              </section>

              <section className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold">Order</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <DetailRow icon={Package} label="Product" value={order.product} />
                  <DetailRow icon={CalendarDays} label="Date" value={dateLines.join(" at ")} />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{order.status}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="rounded-lg bg-secondary/5 p-4">
              <p className="text-sm font-semibold text-secondary">Fulfillment note</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Confirm customer details before updating delivery information or marking this order as completed.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </Dialog.Close>
            <Button type="button" className="w-full sm:w-auto">
              Mark as Completed
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  badgeClassName,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  badgeClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-[#f8ffff] p-4">
      <Icon className="size-5 text-secondary" />
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
      {badgeClassName ? (
        <span className={cn("mt-2 inline-flex rounded-md px-2 py-1 text-sm font-semibold", badgeClassName)}>{value}</span>
      ) : (
        <p className="mt-1 text-lg font-semibold">{value}</p>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-secondary" />
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium">{value}</p>
      </div>
    </div>
  );
}
