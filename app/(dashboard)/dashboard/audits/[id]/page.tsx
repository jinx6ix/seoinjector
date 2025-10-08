import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AuditDetails } from "@/components/audit-details";
import { NextPage } from "next";

export const metadata = {
  title: "Audit Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
};

const AuditDetailPage: NextPage<PageProps> = async ({ params }) => {
  const user = await requireAuth();
  const resolvedParams = await params; // Resolve the params Promise

  const audit = await prisma.audit.findUnique({
    where: { id: resolvedParams.id },
    include: { site: true, page: true },
  });

  if (!audit || audit.userId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AuditDetails audit={audit} />
    </div>
  );
};

export default AuditDetailPage;