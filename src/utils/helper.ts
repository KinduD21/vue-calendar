/* Add your helper functions here. */

export function getHexColor(colorHexMap: Record<string, string>, colorKey: string) {
  return colorHexMap[colorKey] || colorHexMap.blue;
}
