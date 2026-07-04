export type LawDecorIcon = "column" | "scales" | "gavel" | "pen" | "seal";
export type LawDecorSide = "left" | "right";
export type LawDecorSize = "lg" | "md" | "sm" | "seal-lg" | "seal-md" | "seal-sm";
export type LawDecorOffset = "edge" | "gutter";

export interface LawDecorPlacement {
  id: string;
  icon: LawDecorIcon;
  side: LawDecorSide;
  offset: LawDecorOffset;
  /** Sayfa yüksekliğine göre dikey konum (%) */
  top: number;
  size: LawDecorSize;
  rotate?: number;
}

/**
 * 3 kolon, 3 terazi, 3 tokmak, 3 kalem, 3 logo mührü.
 * Yatayda yalnızca içerik kolonunun dışındaki güvenli alanlara yerleştirilir.
 */
export const LAW_DECOR_PLACEMENTS: LawDecorPlacement[] = [
  { id: "column-1", icon: "column", side: "left", offset: "edge", top: 5, size: "lg" },
  { id: "scale-1", icon: "scales", side: "right", offset: "edge", top: 10, size: "md", rotate: 4 },
  { id: "gavel-1", icon: "gavel", side: "left", offset: "gutter", top: 17, size: "md", rotate: -10 },
  { id: "pen-1", icon: "pen", side: "right", offset: "gutter", top: 22, size: "sm", rotate: 8 },
  { id: "seal-1", icon: "seal", side: "left", offset: "edge", top: 27, size: "seal-md" },

  { id: "column-2", icon: "column", side: "right", offset: "edge", top: 33, size: "lg" },
  { id: "pen-2", icon: "pen", side: "left", offset: "gutter", top: 40, size: "md", rotate: -6 },
  { id: "scale-2", icon: "scales", side: "right", offset: "gutter", top: 46, size: "md" },
  { id: "gavel-2", icon: "gavel", side: "right", offset: "edge", top: 52, size: "sm", rotate: 12 },
  { id: "seal-2", icon: "seal", side: "right", offset: "gutter", top: 57, size: "seal-lg" },

  { id: "column-3", icon: "column", side: "left", offset: "gutter", top: 62, size: "sm" },
  { id: "scale-3", icon: "scales", side: "left", offset: "edge", top: 68, size: "md", rotate: -5 },
  { id: "gavel-3", icon: "gavel", side: "left", offset: "edge", top: 75, size: "sm", rotate: -14 },
  { id: "pen-3", icon: "pen", side: "right", offset: "edge", top: 72, size: "sm", rotate: 6 },
  { id: "seal-3", icon: "seal", side: "left", offset: "gutter", top: 83, size: "seal-sm" },
];

/** İçerik genişliği + minimum yan boşluk (px) */
export const LAW_DECOR_CONTENT_WIDTH = 1360;
export const LAW_DECOR_MIN_GUTTER = 88;
