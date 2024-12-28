import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveUpLeft,
  MoveUpRight,
  MoveDownLeft,
  MoveDownRight,
} from "lucide-react";

interface KeyProps {
  direction:
    | "up"
    | "down"
    | "left"
    | "right"
    | "upleft"
    | "upright"
    | "downleft"
    | "downright";
  onPress: (key: string) => void;
  active?: boolean;
  className?: string;
}

const getArrowIcon = (direction: string) => {
  const iconProps = { size: 32, strokeWidth: 3 };
  switch (direction) {
    case "up":
      return <ArrowUp {...iconProps} />;
    case "down":
      return <ArrowDown {...iconProps} />;
    case "left":
      return <ArrowLeft {...iconProps} />;
    case "right":
      return <ArrowRight {...iconProps} />;
    case "upleft":
      return <MoveUpLeft {...iconProps} />;
    case "upright":
      return <MoveUpRight {...iconProps} />;
    case "downleft":
      return <MoveDownLeft {...iconProps} />;
    case "downright":
      return <MoveDownRight {...iconProps} />;
    default:
      return null;
  }
};

export default function Key({
  direction,
  onPress,
  active = false,
  className,
}: KeyProps) {
  const directionToKey = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    upleft: "q",
    upright: "e",
    downleft: "z",
    downright: "c",
  };

  return (
    <button
      className={`button2 rounded-md p-4 ${className} ${active ? "hover" : ""}`}
      onClick={() => onPress(directionToKey[direction])}
    >
      {getArrowIcon(direction)}
    </button>
  );
}
