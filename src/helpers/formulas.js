export function calculatePercentFromRating (rating, cap, divisor, level = 80) {
  const x = (1 - (0.01 / cap))
  const y = ((rating / level) / divisor)
  return (cap * (1 - Math.pow(x, y))) * 100
}

export function calculateEnergyRegen (base, percent) {
  return base * (1 + (percent) / 100)
}

export function calculateHealth (base, endurance, x = 0, y = 0) {
  return (base + (endurance * 14 * (1 + x))) * (1 + y)
}

export function calculateBonusDamageOrHealing (mastery, power, coefficientMastery, coefficientPower, x = 0, y = 0, z = 0, forceTechPower = 0) {
  const masteryResult = mastery * coefficientMastery
  const powerResult = (power + forceTechPower) * coefficientPower
  return ((masteryResult * (1 + x)) + (powerResult * (1 + y))) * (1 + z)
}
