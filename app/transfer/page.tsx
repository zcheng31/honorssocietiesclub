import type { Metadata } from "next";
import { ClubSite } from "../page";

export const metadata: Metadata = {
  title: "Transfer Roadmap | Honors Societies Club",
  description:
    "Transfer planning, ELAC Honors pathways, university guidance, financial aid, and scholarships for ELAC students.",
};

export default function TransferPage() {
  return <ClubSite view="transfer" />;
}
