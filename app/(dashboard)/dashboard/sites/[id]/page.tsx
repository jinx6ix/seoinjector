import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteDetails } from "@/components/site-details";
import { NextPage } from "next";

export const metadata = {
  title: "Site Details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const SiteDetailPage: NextPage<PageProps> = async ({ params }) => {
  const user = await requireAuth();
  const resolvedParams = await params; // Resolve the params Promise

  const site = await prisma.site.findUnique({
    where: { id: resolvedParams.id },
    include: {
      pages: {
        orderBy: { lastCrawled: "desc" },
        take: 10,
      },
      audits: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      keywords: {
        orderBy: { volume: "desc" },
        take: 10,
      },
    },
  });

  if (!site || site.userId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SiteDetails site={site} />
    </div>
  );
};

export default SiteDetailPage;