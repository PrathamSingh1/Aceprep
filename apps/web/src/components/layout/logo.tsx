import Link from "next/link";

export const Logo = () => {
  return (
    <div className="text-lg">
      <Link href="/">
        <h3 className="text-xl font-medium">Aceprep</h3>
      </Link>
    </div>
  );
};
