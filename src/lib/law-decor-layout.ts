export type LawDecorIcon = "column" | "scales" | "gavel" | "pen" | "seal";
export type LawDecorSide = "left" | "right";
export type LawDecorSize = "lg" | "md" | "sm" | "seal-lg" | "seal-md" | "seal-sm";
export type LawDecorOffset = "edge" | "gutter";

export interface LawDecorPlacement {
  id: string;
  icon: LawDecorIcon;
  side: LawDecorSide;
  offset: LawDecorOffset;
  /** Viewport yüksekliğine göre dikey konum (vh) */
  top: number;
  size: LawDecorSize;
  rotate?: number;
}

/** 3 kolon, 3 terazi, 3 tokmak, 3 kalem, 3 logo mührü. Yan şeritte dağıtılmış. */
export const LAW_DECOR_PLACEMENTS: LawDecorPlacement[] = [
  { id: "column-1", icon: "column", side: "left", offset: "edge", top: 8, size: "lg" },
  { id: "scale-1", icon: "scales", side: "right", offset: "edge", top: 12, size: "md", rotate: 4 },
  { id: "gavel-1", icon: "gavel", side: "left", offset: "gutter", top: 22, size: "md", rotate: -10 },
  { id: "pen-1", icon: "pen", side: "right", offset: "gutter", top: 26, size: "sm", rotate: 8 },
  { id: "seal-1", icon: "seal", side: "left", offset: "edge", top: 34, size: "seal-md" },

  { id: "column-2", icon: "column", side: "right", offset: "edge", top: 38, size: "lg" },
  { id: "pen-2", icon: "pen", side: "left", offset: "gutter", top: 46, size: "md", rotate: -6 },
  { id: "scale-2", icon: "scales", side: "right", offset: "gutter", top: 50, size: "md" },
  { id: "gavel-2", icon: "gavel", side: "right", offset: "edge", top: 58, size: "sm", rotate: 12 },
  { id: "seal-2", icon: "seal", side: "right", offset: "gutter", top: 62, size: "seal-lg" },

  { id: "column-3", icon: "column", side: "left", offset: "gutter", top: 68, size: "sm" },
  { id: "scale-3", icon: "scales", side: "left", offset: "edge", top: 74, size: "md", rotate: -5 },
  { id: "gavel-3", icon: "gavel", side: "left", offset: "edge", top: 82, size: "sm", rotate: -14 },
  { id: "pen-3", icon: "pen", side: "right", offset: "edge", top: 78, size: "sm", rotate: 6 },
  { id: "seal-3", icon: "seal", side: "left", offset: "gutter", top: 90, size: "seal-sm" },
];

export const LAW_DECOR_CONTENT_WIDTH = 1360;
