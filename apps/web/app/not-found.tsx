import { HomeLink, Notice } from "@/components/notice";

export default function NotFound() {
  return (
    <Notice title="There is no page at this address.">
      <HomeLink />
    </Notice>
  );
}
