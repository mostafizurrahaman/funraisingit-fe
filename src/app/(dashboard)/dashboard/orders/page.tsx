/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,

  Info,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import orderImage from "@/assets/order.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  OrderDetailsModal,
  type OrderDetails,
} from "@/components/dashboard/OrderDetailsModal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAllOrdersQuery, useGetOrderOverviewQuery } from "@/redux/features/orderManagement/orderManagementApi";
import { ExportButtons } from "@/components/dashboard/ExportButtons";

// type DeliveryType = OrderDetails["delivery"];

import { useState } from "react";
import { Loader2 } from "lucide-react";

const deliveryTone: Record<string, string> = {
  Pickup: "bg-emerald-100 text-emerald-700",
  Delivery: "bg-blue-100 text-blue-700",
  Shipping: "bg-violet-100 text-violet-700",
};

const statToneStyles = {
  secondary: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
} as const;

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const campaignId = typeof window !== "undefined" ? localStorage.getItem("campaignId") : null;

  const { data: ordersResponse, isLoading } = useGetAllOrdersQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    skipPagination: true,
    ...(campaignId ? { campaignId } : {}),
  });

  const {data:getOrderOverviewResponse, isLoading: isLoadingOverview} = useGetOrderOverviewQuery(
    campaignId ? { campaignId } : undefined
  );
  const ordersData = ordersResponse?.data?.result || ordersResponse?.data || [];

  const mappedOrders: OrderDetails[] = ordersData.map((order: any) => {
    const shippingAddrObj = order.shippingAddress;
    const address = typeof shippingAddrObj === "object" && shippingAddrObj
      ? [
          shippingAddrObj.addressLine1,
          shippingAddrObj.addressLine2,
          shippingAddrObj.city,
          shippingAddrObj.state,
          shippingAddrObj.postalCode,
          shippingAddrObj.country
        ].filter(Boolean).join(", ")
      : [
          order.addressLine1,
          order.addressLine2,
          order.city,
          order.state,
          order.postalCode,
          order.country
        ].filter(Boolean).join(", ") || "No address provided";

    const phoneNum = order.customerPhone || order.supporterPhone || order.shippingAddress?.phoneNumber || "";
    const contact = `${address}\n${phoneNum}`;

    const firstItem = order.orderItems?.[0];
    const orderDate = order.paidAt || firstItem?.createdAt || order.createdAt;
    const dateObj = orderDate ? new Date(orderDate) : new Date();
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + "\n" + dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });

    let deliveryVal: OrderDetails["delivery"] = "Pickup";
    const typeLower = (order.shippingType || order.deliveryType || order.delivery || "").toLowerCase();
    if (typeLower.includes("pickup") || typeLower.includes("local_pickup")) {
      deliveryVal = "Pickup";
    } else if (typeLower.includes("delivery") || typeLower.includes("local_delivery")) {
      deliveryVal = "Delivery";
    } else if (typeLower.includes("shipping")) {
      deliveryVal = "Shipping";
    }

    const quantity = firstItem?.purchasedQuantity || order.quantity || 1;
    const productName = firstItem?.productName || order.productName || "Product";
    const productImage = firstItem?.productImage || order.productImage || "";

    return {
      id: order.orderId || order._id || order.id || "N/A",
      customer: order.customerName || order.supporterName || order.name || "Customer",
      email: order.supporterEmail || order.email || "No email provided",
      contact: contact,
      product: productName,
      quantity: quantity,
      delivery: deliveryVal,
      total: `$${(order.totalAmount || order.amount || order.total || 0).toFixed(2)}`,
      date: dateFormatted,
      status: order.orderStatus || order.paymentStatus || order.status || "Paid",
      productImage: productImage,
    };
  });

  const filteredOrders = mappedOrders.filter((order) => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const statusLower = order.status.toLowerCase();
    if (activeTab === 1) {
      return statusLower !== "completed" && statusLower !== "delivered" && statusLower !== "canceled" && statusLower !== "cancelled";
    }
    if (activeTab === 2) {
      return statusLower === "completed" || statusLower === "delivered";
    }
    if (activeTab === 3) {
      return statusLower === "canceled" || statusLower === "cancelled";
    }

    return true;
  });

  const countAll = mappedOrders.length;
  const countToBeDelivered = mappedOrders.filter(o => {
    const s = o.status.toLowerCase();
    return s !== "completed" && s !== "delivered" && s !== "canceled" && s !== "cancelled";
  }).length;
  const countCompleted = mappedOrders.filter(o => {
    const s = o.status.toLowerCase();
    return s === "completed" || s === "delivered";
  }).length;
  // const countCanceled = mappedOrders.filter(o => {
  //   const s = o.status.toLowerCase();
  //   return s === "canceled" || s === "cancelled";
  // }).length;

  const orderTabs = [
    `All Orders (${countAll})`,
    // `To Be Delivered (${countToBeDelivered})`,
    // `Completed (${countCompleted})`,
    // `Canceled (${countCanceled})`,
  ];

  const totalOrders = mappedOrders.length;
  const totalItemsSold = mappedOrders.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalSales = mappedOrders.reduce((acc, curr) => {
    const numericTotal = parseFloat(curr.total.replace(/[^0-9.-]+/g, "")) || 0;
    return acc + numericTotal;
  }, 0);

  const overview = getOrderOverviewResponse?.data || {};

  const statsTotalOrders = typeof overview.totalOrders !== "undefined" ? overview.totalOrders : totalOrders;
  const statsTotalItemsSold = typeof overview.totalItemsSold !== "undefined" ? overview.totalItemsSold : totalItemsSold;
  
  let statsTotalSales = `$${totalSales.toFixed(2)}`;
  if (typeof overview.totalSales !== "undefined") {
    statsTotalSales = typeof overview.totalSales === "number" ? `$${overview.totalSales.toFixed(2)}` : String(overview.totalSales);
  }

  const statsToBeDelivered = typeof overview.toBeDelivered !== "undefined"
    ? overview.toBeDelivered
    : (typeof overview.toBeDeliverd !== "undefined" ? overview.toBeDeliverd : countToBeDelivered);
  
  const statsCompleted = typeof overview.completed !== "undefined" ? overview.completed : countCompleted;

  const summaryStats = [
    {
      title: "Total Orders",
      value: String(statsTotalOrders),
      detail: "All Orders",
      icon: ShoppingCart,
      tone: "secondary",
    },
    {
      title: "Total Items Sold",
      value: String(statsTotalItemsSold),
      detail: "Across all orders",
      icon: PackageCheck,
      tone: "primary",
    },
    {
      title: "Total Sales",
      value: String(statsTotalSales),
      detail: "From orders",
      icon: CircleDollarSign,
      tone: "violet",
    },
    {
      title: "To Be Delivered",
      value: String(statsToBeDelivered),
      detail: "Not marked delivered",
      icon: Truck,
      tone: "blue",
    },
    {
      title: "Completed",
      value: String(statsCompleted),
      detail: "Delivered/Pickup",
      icon: CheckCircle2,
      tone: "green",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-lg bg-white text-foreground shadow-sm ring-1 ring-border">
            <ShoppingCart className="size-8" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and fulfill customer orders
            </p>
          </div>
        </div>

        <ExportButtons
          data={ordersData}
          headers={["Order ID", "Customer Name", "Email", "Product", "Qty", "Delivery", "Total", "Status", "Date"]}
          filename={`${campaignId ? "campaign_" + campaignId : "all"}_orders`}
          toastSubject="Orders"
          buttonClassName="h-12 justify-center border-slate-300 px-5 text-foreground hover:border-secondary hover:text-white shrink-0 cursor-pointer"
          mappingFn={(order: any) => {
            const firstItem = order.orderItems?.[0];
            return [
              order.orderId || order._id || "N/A",
              order.customerName || order.supporterName || "Customer",
              order.supporterEmail || order.email || "N/A",
              firstItem?.productName || order.productName || "Product",
              firstItem?.purchasedQuantity || order.quantity || 1,
              order.shippingType || order.deliveryType || "Pickup",
              (order.totalAmount || order.amount || 0).toFixed(2),
              order.orderStatus || order.paymentStatus || "Paid",
              order.paidAt || order.createdAt || ""
            ];
          }}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <DashboardCard
              key={stat.title}
              className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
                    statToneStyles[stat.tone],
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </section>

      <DashboardCard className="p-0">
        <div className="flex flex-col gap-4 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orderTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary",
                  index === activeTab && "bg-secondary/10 text-secondary",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders, name, email..."
              className="h-11 rounded-lg border-border pl-10 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 animate-spin text-secondary" />
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-border bg-[#f8ffff] text-xs font-semibold text-muted-foreground">
                <tr>
                  {/* <th className="px-4 py-3">Order</th> */}
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors duration-300 hover:bg-secondary/5"
                  >
                    {/* <td className="px-4 py-4 font-semibold">{order.id}</td> */}
                    <td className="px-4 py-4">
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.email}
                      </p>
                    </td>
                    <td className="whitespace-pre-line px-4 py-4 text-xs leading-5 text-muted-foreground">
                      {order.contact}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {order.productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={order.productImage}
                            alt=""
                            className="size-8 rounded-md object-cover bg-slate-50"
                          />
                        ) : (
                          <Image
                            src={orderImage}
                            alt=""
                            className="size-8 rounded-md object-cover bg-slate-50"
                          />
                        )}
                        <span className="font-medium">{order.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-1 text-xs font-semibold",
                          deliveryTone[order.delivery] || "bg-slate-100 text-slate-700",
                        )}
                      >
                        {order.delivery}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold">{order.total}</td>
                    <td className="whitespace-pre-line px-4 py-4 text-xs leading-5 text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <OrderDetailsModal order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DashboardCard>

      <section className="grid gap-4 rounded-lg border border-secondary/50 bg-secondary/5 p-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBlock
          title="About Orders"
          text="Orders are automatically marked as paid when payment is successful."
        />
        <InfoBlock
          title="Delivery Types"
          text="Pickup, delivery, and shipping help you organize fulfillment."
        />
        <InfoBlock
          title="Need to update an order?"
          text="Click View to see order details and update delivery information."
        />
        <InfoBlock
          title="Questions?"
          text="Our support team is here to help. Contact Support."
        />
      </section>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
        {title === "Need to update an order?" ? (
          <Clock3 className="size-4" />
        ) : (
          <Info className="size-4" />
        )}
      </span>
      <div>
        <p className="text-sm font-semibold text-secondary">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
