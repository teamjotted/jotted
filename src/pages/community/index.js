import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Community() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/`);
  }, []);
}
