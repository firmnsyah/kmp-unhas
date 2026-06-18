import type { BoardMember } from "@/shared/lib/types";
import { Reveal } from "@/shared/ui/motion";
import { EmptyState } from "@/shared/ui/section";
import { PersonCard } from "./person-card";

export function MemberGrid({
  members,
  locale,
  batchLabel,
  emptyMessage,
}: {
  members: BoardMember[];
  locale: string;
  batchLabel: (batch: string) => string;
  emptyMessage: string;
}) {
  if (!members.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {members.map((member, i) => (
        <Reveal key={member.id} delay={(i % 4) * 0.05}>
          <PersonCard
            name={member.name}
            position={member.position}
            photoUrl={member.photo_url}
            batchLabel={member.batch ? batchLabel(member.batch) : undefined}
            locale={locale}
          />
        </Reveal>
      ))}
    </div>
  );
}
