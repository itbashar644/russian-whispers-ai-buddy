
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  let location = null;
  
  try {
    location = useLocation();
    
    useEffect(() => {
      // When the route changes, scroll to top
      window.scrollTo(0, 0);
    }, [location?.pathname]);
  } catch (error) {
    // If useLocation fails, we're not in a Router context
    console.log("ScrollToTop: Not in Router context");
  }

  return null;
}
