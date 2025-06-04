import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/sign-in" className="text-sm font-medium underline">
        로그인
      </Link>
      <h1 className="text-xl font-semibold">Header</h1>
    </div>
  );
}
