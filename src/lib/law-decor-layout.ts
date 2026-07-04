export type LawDecorIcon = "column" | "scales" | "gavel" | "pen";
export type LawDecorSide = "left" | "right";
export type LawDecorSize = "lg" | "md" | "sm";

export interface LawDecorPlacement {
  id: string;
  icon: LawDecorIcon;
  side: LawDecorSide;
  /** Viewport yüksekliğine göre dikey konum (vh) */
  top: number;
  size: LawDecorSize;
}

/** 3 kolon, 3 terazi, 3 tokmak, 3 kalem. Yan gutter, üst üste binmeyecek aralıklarla. */
export const LAW_DECOR_PLACEMENTS: LawDecorPlacement[] = [
  { id: "column-1", icon: "column", side: "left", top: 10, size: "lg" },
  { id: "gavel-1", icon: "gavel", side: "left", top: 26, size: "md" },
  { id: "scale-1", icon: "scales", side: "left", top: 42, size: "md" },
  { id: "pen-1", icon: "pen", side: "left", top: 58, size: "sm" },
  { id: "column-3", icon: "column", side: "left", top: 76, size: "sm" },
  { id: "gavel-3", icon: "gavel", side: "left", top: 88, size: "sm" },

  { id: "column-2", icon: "column", side: "right", top: 14, size: "lg" },
  { id: "pen-2", icon: "pen", side: "right", top: 30, size: "md" },
  { id: "scale-2", icon: "scales", side: "right", top: 46, size: "md" },
  { id: "gavel-2", icon: "gavel", side: "right", top: 62, size: "sm" },
  { id: "scale-3", icon: "scales", side: "right", top: 78, size: "sm" },
  { id: "pen-3", icon: "pen", side: "right", top: 90, size: "sm" },
];
