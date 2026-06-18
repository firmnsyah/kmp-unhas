"use client";

import { Button } from "@/components/ui/button";
import { DataTable, EmptyRow } from "@/modules/dashboard";
import { formatDate } from "@/shared/lib/locale";
import { Download } from "lucide-react";
import type { FormQuestion, FormResponse } from "../types";

function answerText(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

const isUrl = (v: unknown): v is string => typeof v === "string" && /^https?:\/\//.test(v);
const fileName = (u: string) => decodeURIComponent(u.split("/").pop() ?? u).replace(/^\d+-\w+\./, ".");

function AnswerCell({ type, value }: { type: FormQuestion["type"]; value: unknown }) {
  const urls = (Array.isArray(value) ? value : [value]).filter(isUrl);

  if ((type === "image_single" || type === "image_multiple") && urls.length) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {urls.map((u) => (
          <a key={u} href={u} target="_blank" rel="noreferrer" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="size-12 rounded border object-cover" />
          </a>
        ))}
      </div>
    );
  }
  if (type === "file" && urls.length) {
    return (
      <a href={urls[0]} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 underline">
        {fileName(urls[0])}
      </a>
    );
  }
  return <span className="line-clamp-2">{answerText(value)}</span>;
}

export function ResponsesTable({
  questions,
  responses,
}: {
  questions: FormQuestion[];
  responses: FormResponse[];
}) {
  function exportCsv() {
    const headers = ["Nama", "Waktu", ...questions.map((q) => q.label.id)];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = responses.map((r) =>
      [
        r.author_name ?? "",
        new Date(r.created_at).toLocaleString("id-ID"),
        ...questions.map((q) => answerText(r.answers[q.id])),
      ]
        .map(escape)
        .join(","),
    );
    const csv = [headers.map(escape).join(","), ...lines].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "respons-form.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Respons ({responses.length})</h2>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!responses.length}>
          <Download className="size-4" />
          Unduh CSV
        </Button>
      </div>
      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>Waktu</th>
            {questions.map((q) => (
              <th key={q.id}>{q.label.id}</th>
            ))}
          </>
        }
      >
        {responses.length ? (
          responses.map((r) => (
            <tr key={r.id}>
              <td className="font-medium">{r.author_name ?? "—"}</td>
              <td className="text-muted-foreground whitespace-nowrap">
                {formatDate(r.created_at, "id", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              {questions.map((q) => (
                <td key={q.id} className="text-muted-foreground max-w-[16rem]">
                  <AnswerCell type={q.type} value={r.answers[q.id]} />
                </td>
              ))}
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={questions.length + 2} message="Belum ada respons." />
        )}
      </DataTable>
    </div>
  );
}
