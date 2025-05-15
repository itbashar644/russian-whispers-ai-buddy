
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // When the route changes, scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
