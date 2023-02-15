import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Community() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      console.log(id);
      router.push(`/map/${id}`);
    }
  }, [id]);
}
