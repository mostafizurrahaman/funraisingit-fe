import Image from "next/image";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FileSpreadsheet,
  Info,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import orderImage from "@/assets/order.png";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DeliveryType = "Pickup" | "Delivery" | "Shipping";
type OrderStatus = "Paid";

type CustomerOrder = {
  id: string;
  customer: string;
  email: string;
  contact: string;
  product: string;
  quantity: number;
  delivery: DeliveryType;
  total: string;
  date: string;
  status: OrderStatus;
};

const summaryStats = [
  { title: "Total Orders", value: "18", detail: "All Orders", icon: ShoppingCart, tone: "secondary" },
  { title: "Total Items Sold", value: "28", detail: "Across all orders", icon: PackageCheck, tone: "primary" },
  { title: "Total Sales", value: "$180.00", detail: "From orders", icon: CircleDollarSign, tone: "violet" },
  { title: "To Be Delivered", value: "12", detail: "Not marked delivered", icon: Truck, tone: "blue" },
  { title: "Completed", value: "6", detail: "Delivered/Pickup", icon: CheckCircle2, tone: "green" },
] as const;

const orderTabs = ["All Orders (18)", "To Be Delivered (12)", "Completed (6)", "Canceled (0)"] as const;

const orders: CustomerOrder[] = [
  {
    id: "#FRI0018",
    customer: "Sarah M.",
    email: "sarah.m@gmail.com",
    contact: "123 Maple St.\nDallas, TX 75201\n(214) 555-0198",
    product: "Banana Pudding",
    quantity: 2,
    delivery: "Pickup",
    total: "$20.00",
    date: "May 18, 2026\n10:24 AM",
    status: "Paid",
  },
  {
    id: "#FRI0019",
    customer: "John D.",
    email: "john.d@gmail.com",
    contact: "456 Oak Ave.\nAustin, TX 78701\n(512) 555-0134",
    product: "Chocolate Cake",
    quantity: 1,
    delivery: "Delivery",
    total: "$15.00",
    date: "May 18, 2026\n11:00 AM",
    status: "Paid",
  },
  {
    id: "#FRI0020",
    customer: "Emily R.",
    email: "emily.r@email.com",
    contact: "789 Pine Blvd.\nHouston, TX 77002\n(713) 555-0185",
    product: "Cheesecake",
    quantity: 3,
    delivery: "Pickup",
    total: "$45.00",
    date: "May 20, 2026\n12:30 PM",
    status: "Paid",
  },
  {
    id: "#FRI0021",
    customer: "Michael B.",
    email: "michael.b@email.com",
    contact: "321 Cedar St.\nSan Antonio\n(210) 555-0176",
    product: "Fruit Tart",
    quantity: 4,
    delivery: "Shipping",
    total: "$60.00",
    date: "May 21, 2026\n01:15 PM",
    status: "Paid",
  },
];

const deliveryTone: Record<DeliveryType, string> = {
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
  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-lg bg-white text-foreground shadow-sm ring-1 ring-border">
            <ShoppingCart className="size-8" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage and fulfill customer orders</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="h-12 justify-center border-slate-300 px-5 text-foreground hover:border-secondary hover:text-white">
            <Download className="size-5" />
            Download CSV
          </Button>
          <Button variant="outline" className="h-12 justify-center border-secondary px-5 text-foreground hover:text-white">
            <FileSpreadsheet className="size-5 text-emerald-600" />
            Download Excel
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <DashboardCard key={stat.title} className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full", statToneStyles[stat.tone])}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.detail}</p>
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
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary",
                  index === 0 && "bg-secondary/10 text-secondary",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search orders, name, email..." className="h-11 rounded-lg border-border pl-10 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border bg-[#f8ffff] text-xs font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
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
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors duration-300 hover:bg-secondary/5">
                  <td className="px-4 py-4 font-semibold">{order.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </td>
                  <td className="whitespace-pre-line px-4 py-4 text-xs leading-5 text-muted-foreground">{order.contact}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Image src={orderImage} alt="" className="size-8 rounded-md object-cover" />
                      <span className="font-medium">{order.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold">{order.quantity}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold", deliveryTone[order.delivery])}>{order.delivery}</span>
                  </td>
                  <td className="px-4 py-4 font-semibold">{order.total}</td>
                  <td className="whitespace-pre-line px-4 py-4 text-xs leading-5 text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{order.status}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button type="button" className="text-sm font-semibold text-secondary transition-colors duration-300 hover:text-primary">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      <section className="grid gap-4 rounded-lg border border-secondary/50 bg-secondary/5 p-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBlock title="About Orders" text="Orders are automatically marked as paid when payment is successful." />
        <InfoBlock title="Delivery Types" text="Pickup, delivery, and shipping help you organize fulfillment." />
        <InfoBlock title="Need to update an order?" text="Click View to see order details and update delivery information." />
        <InfoBlock title="Questions?" text="Our support team is here to help. Contact Support." />
      </section>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
        {title === "Need to update an order?" ? <Clock3 className="size-4" /> : <Info className="size-4" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-secondary">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
