"use client";

import React from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ExportDataParams {
  data: any[];
  headers: string[];
  filename: string;
  mappingFn: (item: any) => (string | number)[];
  format: "csv" | "excel";
  toastSubject?: string;
}

export const exportData = ({
  data,
  headers,
  filename,
  mappingFn,
  format,
  toastSubject = "Data",
}: ExportDataParams) => {
  if (!data || data.length === 0) {
    toast.error(`No ${toastSubject.toLowerCase()} to export.`);
    return;
  }

  const rows = data.map(mappingFn);
  
  // Helper to safely format cell values, escaping commas, newlines, and double quotes
  const escapeCsv = (val: any) => {
    const stringVal = val === null || val === undefined ? "" : String(val);
    if (stringVal.includes(",") || stringVal.includes("\n") || stringVal.includes('"')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const content = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  const mimeType = format === "csv" ? "text/csv" : "application/vnd.ms-excel";
  const extension = format === "csv" ? "csv" : "xls";

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.${extension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`${toastSubject} exported in ${format.toUpperCase()} successfully!`);
};

interface ExportButtonsProps {
  data: any[];
  headers: string[];
  filename: string;
  mappingFn: (item: any) => (string | number)[];
  buttonClassName?: string;
  containerClassName?: string;
  toastSubject?: string;
}

export function ExportButtons({
  data,
  headers,
  filename,
  mappingFn,
  buttonClassName,
  containerClassName = "grid gap-3 sm:grid-cols-2",
  toastSubject = "Data",
}: ExportButtonsProps) {
  return (
    <div className={containerClassName}>
      <Button
        onClick={() => exportData({ data, headers, filename, mappingFn, format: "csv", toastSubject })}
        variant="outline"
        className={buttonClassName}
      >
        <Download className="size-4 sm:size-5" />
        Download CSV
      </Button>
      <Button
        onClick={() => exportData({ data, headers, filename, mappingFn, format: "excel", toastSubject })}
        variant="outline"
        className={buttonClassName}
      >
        <FileSpreadsheet className="size-4 sm:size-5 text-emerald-600" />
        Download Excel
      </Button>
    </div>
  );
}
