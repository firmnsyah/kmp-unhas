import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { pickLocale } from "@/shared/lib/locale";
import type { BoardMember, DepartmentMember, Localized } from "@/shared/lib/types";
import Image from "next/image";
import type { DepartmentWithMembers } from "../queries";

const isCoordinator = (pos: string) => /koordinator|koord|kepala|ketua/i.test(pos);

function sortCoordinatorFirst(members: DepartmentMember[], locale: string) {
  return [...members].sort((a, b) => {
    const ca = isCoordinator(pickLocale(a.position, locale)) ? 0 : 1;
    const cb = isCoordinator(pickLocale(b.position, locale)) ? 0 : 1;
    return ca - cb || a.sort_order - b.sort_order;
  });
}

function PersonNode({
  name,
  position,
  photoUrl,
  locale,
  variant = "default",
  size = "default",
}: {
  name: string;
  position: Localized;
  photoUrl: string | null;
  locale: string;
  variant?: "primary" | "default";
  size?: "default" | "sm";
}) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center rounded-xl border text-center shadow-sm",
        size === "sm" ? "w-32 p-2" : "w-40 p-3",
        variant === "primary" && "border-primary ring-primary/20 ring-2",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-full border",
          size === "sm" ? "size-14" : "size-20",
        )}
      >
        <Image
          src={photoUrl ?? "/images/avatar-placeholder.svg"}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <p className={cn("mt-2 leading-tight font-semibold", size === "sm" ? "text-xs" : "text-sm")}>
        {name}
      </p>
      <p className="text-primary mt-0.5 text-xs">{pickLocale(position, locale)}</p>
    </div>
  );
}

function AdvisoryCard({
  advisory,
  advisoryLabel,
  locale,
  className,
}: {
  advisory: BoardMember[];
  advisoryLabel: string;
  locale: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted/30 rounded-xl border border-dashed p-3 text-center", className)}>
      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
        {advisoryLabel}
      </p>
      {/* Nama mengalir horizontal: 2 kolom (mis. 4 anggota → 2 baris) */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-left">
        {advisory.map((a) => (
          <li key={a.id} className="text-sm leading-tight">
            <span className="font-medium">{a.name}</span>
            <span className="text-muted-foreground block text-xs">{pickLocale(a.position, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrunkV() {
  return <div className="bg-border h-6 w-px" aria-hidden />;
}

/** Bus horizontal + cabang vertikal ke tiap node dalam satu baris. */
function CombRow({
  children,
  passThrough = false,
}: {
  children: React.ReactNode[];
  passThrough?: boolean;
}) {
  const n = children.length;
  return (
    <div className="relative flex items-start justify-center">
      {passThrough ? (
        <div className="bg-border absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" aria-hidden />
      ) : null}
      {children.map((child, i) => (
        <div key={i} className="relative flex flex-col items-center px-2 sm:px-3">
          <div className="relative h-6 w-full">
            <div className="bg-border absolute top-0 left-1/2 h-6 w-px -translate-x-1/2" />
            {n > 1 ? (
              <div
                className={cn(
                  "bg-border absolute top-0 h-px",
                  i === 0 ? "right-0 left-1/2" : i === n - 1 ? "right-1/2 left-0" : "right-0 left-0",
                )}
              />
            ) : null}
          </div>
          {child}
        </div>
      ))}
    </div>
  );
}

export function OrgChart({
  core,
  departments,
  advisory,
  locale,
  departmentsLabel,
  advisoryLabel,
}: {
  core: BoardMember[];
  departments: DepartmentWithMembers[];
  advisory: BoardMember[];
  locale: string;
  departmentsLabel: string;
  advisoryLabel: string;
}) {
  const [ketua, wakil, ...officers] = core;
  const hasAdvisory = advisory.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-2">
      {/* 1a. Dewan Pertimbangan — DI ATAS card Ketua (mobile saja) */}
      {ketua && hasAdvisory ? (
        <div className="flex flex-col items-center sm:hidden">
          <AdvisoryCard
            advisory={advisory}
            advisoryLabel={advisoryLabel}
            locale={locale}
            className="w-64"
          />
          <div className="bg-border h-3 w-px" aria-hidden />
        </div>
      ) : null}

      {/* 1. Ketua di tengah; Dewan ke kanan (desktop) */}
      {ketua ? (
        <div className="flex items-center justify-center">
          {hasAdvisory ? <div className="hidden w-56 shrink-0 sm:block" aria-hidden /> : null}
          <PersonNode
            name={ketua.name}
            position={ketua.position}
            photoUrl={ketua.photo_url}
            locale={locale}
            variant="primary"
          />
          {hasAdvisory ? (
            <div className="hidden w-56 shrink-0 items-center sm:flex">
              <div className="border-muted-foreground/50 w-6 shrink-0 border-t-2 border-dashed" aria-hidden />
              <AdvisoryCard
                advisory={advisory}
                advisoryLabel={advisoryLabel}
                locale={locale}
                className="flex-1"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 2. Wakil Ketua */}
      {wakil ? (
        <>
          <TrunkV />
          <PersonNode
            name={wakil.name}
            position={wakil.position}
            photoUrl={wakil.photo_url}
            locale={locale}
          />
        </>
      ) : null}

      {/* 3. Sekretaris & Bendahara dalam satu baris */}
      {officers.length ? (
        <>
          <TrunkV />
          <div className="w-full overflow-x-auto">
            <div className="mx-auto w-max">
              <CombRow passThrough={departments.length > 0}>
                {officers.map((o) => (
                  <PersonNode
                    key={o.id}
                    name={o.name}
                    position={o.position}
                    photoUrl={o.photo_url}
                    locale={locale}
                  />
                ))}
              </CombRow>
            </div>
          </div>
        </>
      ) : null}

      {/* 4. Departemen — grid responsif (muat 1 layar) */}
      {departments.length ? (
        <>
          <TrunkV />
          <div className="bg-primary/10 text-primary rounded-md border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
            {departmentsLabel}
          </div>
          <TrunkV />
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => {
              const sorted = sortCoordinatorFirst(d.members ?? [], locale);
              const coords = sorted.filter((m) => isCoordinator(pickLocale(m.position, locale)));
              const anggota = sorted.filter((m) => !isCoordinator(pickLocale(m.position, locale)));
              return (
                <div key={d.id} className="bg-card rounded-xl border p-4 shadow-sm">
                  <Link
                    href={`/tentang/departemen/${d.slug}`}
                    className="bg-primary/10 text-primary hover:bg-primary/15 mb-4 block rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
                  >
                    {pickLocale(d.name, locale)}
                  </Link>

                  {/* Koordinator: 1 kartu per baris */}
                  {coords.map((c) => (
                    <div key={c.id} className="mb-3 flex justify-center">
                      <PersonNode
                        name={c.name}
                        position={c.position}
                        photoUrl={c.photo_url}
                        locale={locale}
                        size="sm"
                        variant="primary"
                      />
                    </div>
                  ))}

                  {/* Anggota: 2 kartu per baris */}
                  {anggota.length ? (
                    <div className="grid grid-cols-2 justify-items-center gap-3">
                      {anggota.map((m) => (
                        <PersonNode
                          key={m.id}
                          name={m.name}
                          position={m.position}
                          photoUrl={m.photo_url}
                          locale={locale}
                          size="sm"
                        />
                      ))}
                    </div>
                  ) : null}

                  {!coords.length && !anggota.length ? (
                    <p className="text-muted-foreground text-center text-xs">Belum ada anggota.</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
