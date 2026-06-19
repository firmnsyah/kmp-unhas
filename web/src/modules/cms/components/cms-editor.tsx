"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { richTextToHtml } from "@/shared/lib/html";
import type { ContentSections } from "@/shared/lib/types";
import { ImageUpload } from "@/shared/ui/image-upload";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import { Loader2 } from "lucide-react";
import { useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { saveSiteContent } from "../admin-actions";

const linesToList = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const listToText = (list?: string[]) => (list ?? []).join("\n");

function SectionForm({
  sectionKey,
  buildValue,
  children,
}: {
  sectionKey: string;
  buildValue: (fd: FormData) => unknown;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveSiteContent(sectionKey, buildValue(fd));
      if (res.ok) toast.success("Konten tersimpan.");
      else toast.error(res.error ?? "Gagal menyimpan.");
    });
  }
  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}
function AreaField({ label, name, defaultValue, rows = 3, hint }: { label: string; name: string; defaultValue?: string; rows?: number; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

export function CmsEditor({ content }: { content: ContentSections }) {
  const { settings, hero, stats, chairman, about, contact, mars, privacy } = content;

  return (
    <Tabs defaultValue="settings" className="flex w-full flex-col gap-0">
      <TabsList className="mb-6 flex! h-auto! w-full flex-wrap justify-start gap-2 bg-transparent! p-0!">
        {[
          { value: "settings", label: "Umum" },
          { value: "hero", label: "Beranda" },
          { value: "chairman", label: "Sambutan" },
          { value: "about", label: "Tentang" },
          { value: "contact", label: "Kontak" },
          { value: "mars", label: "Mars KMP" },
          { value: "privacy", label: "Privasi" },
        ].map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="border-input text-muted-foreground hover:bg-accent hover:text-foreground data-active:bg-primary data-active:text-primary-foreground! data-active:border-primary h-auto flex-none rounded-full border bg-transparent px-4 py-2 text-sm font-medium transition-colors"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Pengaturan umum */}
      <TabsContent value="settings" className="pt-2">
        <SectionForm
          sectionKey="settings"
          buildValue={(fd) => ({
            site_name: String(fd.get("site_name") ?? ""),
            registration_open: fd.get("registration_open") === "on",
            footer_text: { id: String(fd.get("footer_text") ?? "") },
          })}
        >
          <Field label="Nama Situs" name="site_name" defaultValue={settings.site_name} />
          <AreaField label="Teks Footer" name="footer_text" defaultValue={settings.footer_text.id} rows={2} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="registration_open" defaultChecked={settings.registration_open} className="accent-primary size-4" />
            Pendaftaran anggota dibuka
          </label>
        </SectionForm>
      </TabsContent>

      {/* Beranda: hero + statistik */}
      <TabsContent value="hero" className="space-y-6 pt-2">
        <SectionForm
          sectionKey="home_hero"
          buildValue={(fd) => ({
            title: { id: String(fd.get("title") ?? "") },
            subtitle: { id: String(fd.get("subtitle") ?? "") },
            description: { id: String(fd.get("description") ?? "") },
            images: hero.images ?? [],
          })}
        >
          <Field label="Judul Hero" name="title" defaultValue={hero.title.id} />
          <Field label="Subjudul" name="subtitle" defaultValue={hero.subtitle.id} />
          <AreaField label="Deskripsi" name="description" defaultValue={hero.description.id} />
        </SectionForm>

        <SectionForm
          sectionKey="home_stats"
          buildValue={(fd) => ({
            founded: Number(fd.get("founded") ?? 0),
            members: Number(fd.get("members") ?? 0),
            departments: Number(fd.get("departments") ?? 0),
            programs: Number(fd.get("programs") ?? 0),
          })}
        >
          <p className="text-sm font-semibold">Statistik Beranda</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tahun Berdiri" name="founded" type="number" defaultValue={String(stats.founded)} />
            <Field label="Anggota Aktif" name="members" type="number" defaultValue={String(stats.members)} />
            <Field label="Departemen" name="departments" type="number" defaultValue={String(stats.departments)} />
            <Field label="Program Kerja" name="programs" type="number" defaultValue={String(stats.programs)} />
          </div>
        </SectionForm>
      </TabsContent>

      {/* Sambutan ketua */}
      <TabsContent value="chairman" className="pt-2">
        <SectionForm
          sectionKey="chairman"
          buildValue={(fd) => ({
            name: String(fd.get("name") ?? ""),
            period: String(fd.get("period") ?? ""),
            photo_url: String(fd.get("photo_url") ?? ""),
            quote: { id: String(fd.get("quote") ?? "") },
          })}
        >
          <Field label="Nama Ketua" name="name" defaultValue={chairman.name} />
          <Field label="Periode" name="period" defaultValue={chairman.period} />
          <div className="space-y-2">
            <Label>Sambutan/Kutipan</Label>
            <RichTextEditor name="quote" defaultValue={richTextToHtml(chairman.quote.id)} />
          </div>
          <div className="space-y-2">
            <Label>Foto Ketua</Label>
            <ImageUpload name="photo_url" defaultValue={chairman.photo_url} bucket="people" />
          </div>
        </SectionForm>
      </TabsContent>

      {/* Tentang */}
      <TabsContent value="about" className="pt-2">
        <SectionForm
          sectionKey="about"
          buildValue={(fd) => ({
            history: { id: String(fd.get("history") ?? "") },
            vision: { id: String(fd.get("vision") ?? "") },
            missions: { id: linesToList(fd.get("missions")) },
            purpose: { id: linesToList(fd.get("purpose")) },
            efforts: { id: linesToList(fd.get("efforts")) },
            logo_philosophy: { id: String(fd.get("logo_philosophy") ?? "") },
            logo_download_url: String(fd.get("logo_download_url") ?? ""),
            logo_creator: {
              name: String(fd.get("creator_name") ?? ""),
              photo_url: String(fd.get("creator_photo") ?? ""),
              description: { id: String(fd.get("creator_desc") ?? "") },
            },
          })}
        >
          <div className="space-y-2">
            <Label>Sejarah</Label>
            <RichTextEditor name="history" defaultValue={about.history.id} />
          </div>
          <div className="space-y-2">
            <Label>Visi</Label>
            <RichTextEditor name="vision" defaultValue={richTextToHtml(about.vision.id)} />
          </div>
          <AreaField label="Misi (satu poin per baris)" name="missions" defaultValue={listToText(about.missions.id)} rows={4} />
          <AreaField label="Tujuan (satu poin per baris)" name="purpose" defaultValue={listToText(about.purpose.id)} rows={4} />
          <AreaField label="Usaha (satu poin per baris)" name="efforts" defaultValue={listToText(about.efforts.id)} rows={4} />
          <div className="space-y-2">
            <Label>Filosofi Logo</Label>
            <RichTextEditor name="logo_philosophy" defaultValue={richTextToHtml(about.logo_philosophy.id)} />
          </div>
          <Field label="URL Unduh Logo" name="logo_download_url" defaultValue={about.logo_download_url} />
          <p className="pt-2 text-sm font-semibold">Pembuat Logo</p>
          <Field label="Nama Pembuat" name="creator_name" defaultValue={about.logo_creator.name} />
          <div className="space-y-2">
            <Label>Keterangan Pembuat</Label>
            <RichTextEditor name="creator_desc" defaultValue={richTextToHtml(about.logo_creator.description.id)} />
          </div>
          <div className="space-y-2">
            <Label>Foto Pembuat</Label>
            <ImageUpload name="creator_photo" defaultValue={about.logo_creator.photo_url} bucket="people" />
          </div>
        </SectionForm>
      </TabsContent>

      {/* Kontak */}
      <TabsContent value="contact" className="pt-2">
        <SectionForm
          sectionKey="contact"
          buildValue={(fd) => ({
            address: String(fd.get("address") ?? ""),
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
            instagram: String(fd.get("instagram") ?? ""),
            youtube: String(fd.get("youtube") ?? ""),
            tiktok: String(fd.get("tiktok") ?? ""),
            maps_embed: String(fd.get("maps_embed") ?? ""),
          })}
        >
          <div className="space-y-2">
            <Label>Alamat</Label>
            <RichTextEditor name="address" defaultValue={richTextToHtml(contact.address)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" name="email" defaultValue={contact.email} />
            <Field label="Telepon/WA" name="phone" defaultValue={contact.phone} />
          </div>
          <Field label="Instagram (URL)" name="instagram" defaultValue={contact.instagram} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="YouTube (URL)" name="youtube" defaultValue={contact.youtube} />
            <Field label="TikTok (URL)" name="tiktok" defaultValue={contact.tiktok} />
          </div>
          <AreaField label="Embed Google Maps (URL)" name="maps_embed" defaultValue={contact.maps_embed} rows={2} />
        </SectionForm>
      </TabsContent>

      {/* Mars */}
      <TabsContent value="mars" className="pt-2">
        <SectionForm
          sectionKey="mars"
          buildValue={(fd) => ({
            lyrics: { id: String(fd.get("lyrics") ?? "") },
            video_url: String(fd.get("video_url") ?? ""),
          })}
        >
          <div className="space-y-2">
            <Label>Lirik Mars</Label>
            <RichTextEditor name="lyrics" defaultValue={richTextToHtml(mars.lyrics.id)} />
          </div>
          <Field label="URL Video YouTube" name="video_url" defaultValue={mars.video_url} />
        </SectionForm>
      </TabsContent>

      {/* Privasi */}
      <TabsContent value="privacy" className="pt-2">
        <SectionForm
          sectionKey="privacy"
          buildValue={(fd) => ({ content: { id: String(fd.get("content") ?? "") } })}
        >
          <div className="space-y-2">
            <Label>Isi Kebijakan Privasi</Label>
            <RichTextEditor name="content" defaultValue={privacy.content.id} />
          </div>
        </SectionForm>
      </TabsContent>
    </Tabs>
  );
}
