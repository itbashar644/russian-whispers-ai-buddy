
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    // When the route changes, scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
