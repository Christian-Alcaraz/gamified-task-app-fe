export enum EItemAttribute {
  Stackable = 'stackable',
  Craftable = 'craftable',
  Enchantable = 'enchantable',
  Tradeable = 'tradeable',
  Equippable = 'equippable',
  Repairable = 'repairable',
  Sockets = 'sockets',
}

export enum EItemUsageAttribute {
  ConsumeOnUse = 'consumeOnUse',
  CooldownDuration = 'cooldownDuration',
  EffectDuration = 'effectDuration',
}

export enum EItemRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum EItemConsumableBaseStat {
  AddHealth = 'add_health',
  AddMana = 'add_mana',
  AddExperience = 'add_experience',
  BonusStrength = 'bonus_strength',
  BonusDexterity = 'bonus_dexterity',
  BonusIntelligence = 'bonus_intelligence',
  BonusConstitution = 'bonus_constitution',
}

export enum EItemEquipmentBaseStat {
  CriticalChance = 'critical_chance',
  CriticalDamage = 'critical_damage',
  PhysicalResistance = 'physical_resistance',
  MagicResistance = 'magic_resistance',
  Lifesteal = 'lifesteal',
}

export enum EItemBaseStat {
  Strength = 'strength',
  Dexterity = 'dexterity',
  Intelligence = 'intelligence',
  Constitution = 'constitution',
}

export enum EItemType {
  MainHand = 'mainhand',
  OffHand = 'offhand',
  Helmet = 'helmet',
  Body = 'body',
  Legs = 'legs',
  Hands = 'hands',
  Consumable = 'consumable',
  Ring = 'ring',
  Amulet = 'amulet',
  Necklace = 'necklace',
  Bracelet = 'bracelet',
}

export enum EItemTypeIndex {
  mainhand = 1,
  offhand = 2,
  helmet = 3,
  body = 4,
  legs = 5,
  hands = 6,
  consumable = 7,
  ring = 8,
  amulet = 9,
  necklace = 10,
}

export enum EItemSource {
  Drop = 'drop',
  Craft = 'craft',
  Shop = 'shop',
  Reward = 'reward',
}
export const ITEM_ATTRIBUTES = Object.values(EItemAttribute);
export const ITEM_USAGE_ATTRIBUTES = Object.values(EItemUsageAttribute);
export const ITEM_TYPES = Object.values(EItemType);
export const ITEM_BASE_STATS = Object.values(EItemBaseStat);
export const ITEM_CONSUMABLE_BASE_STATS = Object.values(
  EItemConsumableBaseStat,
);
export const ITEM_EQUIPMENT_BASE_STATS = Object.values(EItemEquipmentBaseStat);
export const ITEM_RARITIES = Object.values(EItemRarity);
export const ITEM_SOURCES = Object.values(EItemSource);
export const ITEM_ALL_BASE_STATS = [
  ...ITEM_BASE_STATS,
  ...ITEM_CONSUMABLE_BASE_STATS,
  ...ITEM_EQUIPMENT_BASE_STATS,
];
