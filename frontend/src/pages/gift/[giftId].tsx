import { useRouter } from "next/router";
import { ViewGift } from "../../components/ViewGift";

export default function IndexPage() {
  const router = useRouter();
  return <ViewGift id={String(router.query.giftId)}></ViewGift>;
}
