import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getCurrentProfile } from "@/modules/auth";
import { listMessages } from "@/modules/contact";
import { DashboardPageHeader, StatCard, StatusBadge } from "@/modules/dashboard";
import { getAdminNewsList, getPendingNews, type NewsListItem } from "@/modules/news";
import { listRegistrations } from "@/modules/registrations";
import { formatDate } from "@/shared/lib/locale";
import { getServerSupabase } from "@/shared/lib/supabase-server";
import {
  ArrowRight,
  CheckSquare,
  Mail,
  MessageSquare,
  Newspaper,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  draft: "neutral",
  pending: "warning",
  published: "success",
  rejected: "danger",
} as const;
const STATUS_LABEL = {
  draft: "Draf",
  pending: "Menunggu",
  published: "Terbit",
  rejected: "Ditolak",
} as const;

async function countOf(query: PromiseLike<{ count: number | null }>): Promise<number> {
  const { count } = await query;
  return count ?? 0;
}

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          {href ? (
            <Button asChild variant="ghost" size="sm" className="text-primary -mr-2">
              <Link href={href}>
                {linkLabel ?? "Lihat"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function NewsRows({ items, empty }: { items: NewsListItem[]; empty: string }) {
  if (!items.length) return <p className="text-muted-foreground py-4 text-sm">{empty}</p>;
  return (
    <ul className="divide-y">
      {items.map((n) => (
        <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-medium">{n.title.id}</p>
            <p className="text-muted-foreground text-xs">
              {n.category_name?.id ?? "Tanpa kategori"} ·{" "}
              {formatDate(n.updated_at, "id", { day: "numeric", month: "short" })}
            </p>
          </div>
          <StatusBadge tone={STATUS_TONE[n.status]}>{STATUS_LABEL[n.status]}</StatusBadge>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardOverview() {
  const profile = await getCurrentProfile();
  const supabase = await getServerSupabase();
  if (!profile || !supabase) return null;

  const head = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";

  if (!isAdmin) {
    const [draft, pending, published] = await Promise.all([
      countOf(head("news").eq("author_id", profile.id).eq("status", "draft").is("deleted_at", null)),
      countOf(head("news").eq("author_id", profile.id).eq("status", "pending").is("deleted_at", null)),
      countOf(head("news").eq("author_id", profile.id).eq("status", "published").is("deleted_at", null)),
    ]);
    const myNews = (await getAdminNewsList(profile.id)).slice(0, 6);
    return (
      <>
        <DashboardPageHeader
          title={`Selamat datang, ${profile.full_name}`}
          description="Ringkasan berita yang Anda kelola."
          action={
            <Button asChild>
              <Link href="/dashboard/berita/baru">
                <Plus className="size-4" />
                Tulis Berita
              </Link>
            </Button>
          }
        />
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Draf" value={draft} icon={Newspaper} />
          <StatCard label="Menunggu Approval" value={pending} icon={CheckSquare} />
          <StatCard label="Terpublikasi" value={published} icon={Newspaper} />
        </div>
        <Panel title="Berita Terbaru Anda" href="/dashboard/berita" linkLabel="Kelola">
          <NewsRows items={myNews} empty="Anda belum menulis berita." />
        </Panel>
      </>
    );
  }

  const [
    published,
    pending,
    pendaftarTotal,
    pendaftarBaru,
    pesanBaru,
    komentar,
    recentNews,
    pendingNews,
    recentRegs,
  ] = await Promise.all([
    countOf(head("news").eq("status", "published").is("deleted_at", null)),
    countOf(head("news").eq("status", "pending").is("deleted_at", null)),
    countOf(head("registrations")),
    countOf(head("registrations").eq("status", "baru")),
    countOf(head("contact_messages").eq("is_read", false)),
    countOf(head("news_comments").eq("is_hidden", false)),
    getAdminNewsList().then((r) => r.slice(0, 6)),
    getPendingNews().then((r) => r.slice(0, 6)),
    listRegistrations().then((r) => r.slice(0, 6)),
  ]);
  const recentMessages = (await listMessages()).slice(0, 6);

  const quickActions = [
    { href: "/dashboard/berita/baru", label: "Tulis Berita", icon: Plus },
    { href: "/dashboard/approval", label: "Approval", icon: CheckSquare },
    { href: "/dashboard/pendaftar", label: "Pendaftar", icon: UserPlus },
    { href: "/dashboard/pesan", label: "Pesan", icon: Mail },
  ];

  return (
    <>
      <DashboardPageHeader
        title={`Selamat datang, ${profile.full_name}`}
        description="Ringkasan aktivitas dan data organisasi."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Berita Terbit" value={published} icon={Newspaper} />
        <StatCard label="Menunggu Approval" value={pending} icon={CheckSquare} hint="Berita panitia" />
        <StatCard label="Pendaftar Baru" value={pendaftarBaru} icon={UserPlus} hint={`dari ${pendaftarTotal} total`} />
        <StatCard label="Total Pendaftar" value={pendaftarTotal} icon={Users} />
        <StatCard label="Pesan Belum Dibaca" value={pesanBaru} icon={Mail} />
        <StatCard label="Komentar Tampil" value={komentar} icon={MessageSquare} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <Button key={a.href} asChild variant="outline" size="sm">
            <Link href={a.href}>
              <a.icon className="size-4" />
              {a.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid lg:columns-2">
        <Panel title="Berita Terbaru" href="/dashboard/berita" linkLabel="Kelola">
          <NewsRows items={recentNews} empty="Belum ada berita." />
        </Panel>

        <Panel title="Menunggu Approval" href="/dashboard/approval" linkLabel="Tinjau">
            <NewsRows items={pendingNews} empty="Tidak ada berita menunggu persetujuan." />
          </Panel>

          <Panel title="Pendaftar Terbaru" href="/dashboard/pendaftar" linkLabel="Lihat">
            {recentRegs.length ? (
              <ul className="divide-y">
                {recentRegs.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium">{r.full_name}</p>
                      <p className="text-muted-foreground text-xs">
                        {r.major} · {r.batch}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(r.created_at, "id", { day: "numeric", month: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4 text-sm">Belum ada pendaftar.</p>
            )}
          </Panel>

          <Panel title="Pesan Masuk Terbaru" href="/dashboard/pesan" linkLabel="Lihat">
            {recentMessages.length ? (
              <ul className="divide-y">
                {recentMessages.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className={`line-clamp-1 text-sm ${m.is_read ? "" : "font-semibold"}`}>
                        {m.subject}
                      </p>
                      <p className="text-muted-foreground text-xs">{m.name}</p>
                    </div>
                    {m.is_read ? null : <StatusBadge tone="info">Baru</StatusBadge>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4 text-sm">Belum ada pesan masuk.</p>
            )}
          </Panel>
      </div>
    </>
  );
}
