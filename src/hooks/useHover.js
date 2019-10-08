import { useState } from "react";

export default function useHover() {
  const [hovering, setHovering] = useState(false);

  const onMouseOver = () => {
    setHovering(true);
  };

  const onMouseOut = () => {
    setHovering(false);
  };

  const attrs = {
    onMouseOver,
    onMouseOut
  };

  return [hovering, attrs];
}
