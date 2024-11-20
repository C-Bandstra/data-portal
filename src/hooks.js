import {useEffect, useState} from "react";

export const useCheckMobileScreen = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 912);
}

export const useFocusListener = (open, inputId, setHasFocused) => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const input = document.getElementById(inputId);

      if (input && open) {
        // Add event listener when the input is found and 'open' is true
        input.addEventListener("focus", handleFocus);

        // Disconnect the observer once the element is found
        observer.disconnect();
      }
    });

    const handleFocus = () => {
      setHasFocused(true);
    };

    // Observe changes in the DOM to detect when the element is available
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up the observer and event listener
    return () => {
      observer.disconnect();
      const input = document.getElementById(inputId);
      if (input) {
        input.removeEventListener("focus", handleFocus);
      }
    };
  }, [open, inputId, setHasFocused]);
};