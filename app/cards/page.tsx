import { CardsExplorer } from "@/components/cards-explorer";
import { getAllCards } from "@/lib/content";

export const metadata = {
  title: "全部卡片 | zoo-cards",
};

export default function CardsPage() {
  const cards = getAllCards();

  return <CardsExplorer cards={cards} />;
}
