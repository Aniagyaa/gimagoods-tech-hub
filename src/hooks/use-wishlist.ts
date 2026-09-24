import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function useWishlist() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!user) { setIds([]); return; }
    supabase.from("wishlist_items").select("product_id").eq("user_id", user.id).then(({ data }) => setIds(data?.map((row) => row.product_id) ?? []));
  }, [user]);

  const toggle = useCallback(async (productId: string) => {
    if (!user) {
      toast("Please log in to save products to your wishlist.", { action: { label: "Login", onClick: () => { window.location.href = "/login"; } }, cancel: { label: "Create Account", onClick: () => { window.location.href = "/register"; } } });
      return;
    }
    const saved = ids.includes(productId);
    setIds((current) => saved ? current.filter((id) => id !== productId) : [...current, productId]);
    const result = saved
      ? await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId)
      : await supabase.from("wishlist_items").insert({ user_id: user.id, product_id: productId });
    if (result.error) {
      setIds((current) => saved ? [...current, productId] : current.filter((id) => id !== productId));
      toast.error("Wishlist could not be updated. Please try again.");
      return;
    }
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
  }, [ids, user]);
  return { ids, toggle, isSaved: (productId: string) => ids.includes(productId) };
}