const Attribute = {
  Stackable: 'stackable',
  Craftable: 'craftable',
  Enchantable: 'enchantable',
  Tradeable: 'tradeable',
  Equippable: 'equippable',
  Repairable: 'repairable',
  Sockets: 'sockets',
} as const;

const UsageAttribute = {
  ConsumeOnUse: 'consumeOnUse',
  CooldownDuration: 'cooldownDuration',
  EffectDuration: 'effectDuration',
} as const;

const Rarity = {
  Common: 'common',
  Uncommon: 'uncommon',
  Rare: 'rare',
  Epic: 'epic',
  Legendary: 'legendary',
} as const;

const ConsumableBaseStat = {
  AddHealth: 'add_health',
  AddMana: 'add_mana',
  AddExperience: 'add_experience',
  BonusStrength: 'bonus_strength',
  BonusDexterity: 'bonus_dexterity',
  BonusIntelligence: 'bonus_intelligence',
  BonusConstitution: 'bonus_constitution',
};

const EquipmentBaseStat = {
  CriticalChance: 'critical_chance',
  CriticalDamage: 'critical_damage',
  PhysicalResistance: 'physical_resistance',
  MagicResistance: 'magic_resistance',
  Lifesteal: 'lifesteal',
};

const BaseStat = {
  Strength: 'strength',
  Dexterity: 'dexterity',
  Intelligence: 'intelligence',
  Constitution: 'constitution',
} as const;

const Type = {
  MainHand: 'mainhand',
  OffHand: 'offhand',
  Helmet: 'helmet',
  Body: 'body',
  Legs: 'legs',
  Hands: 'hands',
  Consumable: 'consumable',
  Ring: 'ring',
  Amulet: 'amulet',
  Necklace: 'necklace',
  Bracelet: 'bracelet',
} as const;

const TypeIndex = {
  mainhand: 1,
  offhand: 2,
  helmet: 3,
  body: 4,
  legs: 5,
  hands: 6,
  consumable: 7,
  ring: 8,
  amulet: 9,
  necklace: 10,
};

const Source = {
  Drop: 'drop',
  Craft: 'craft',
  Shop: 'shop',
  Reward: 'reward',
} as const;

// Lists

const Attributes = Object.values(Attribute);
const UsageAttributes = Object.values(UsageAttribute);
const Types = Object.values(Type);
const BaseStats = Object.values(BaseStat);
const ConsumableBaseStats = Object.values(ConsumableBaseStat);
const EquipmentBaseStats = Object.values(EquipmentBaseStat);
const Rarities = Object.values(Rarity);
const Sources = Object.values(Source);
const AllBaseStats = [
  ...BaseStats,
  ...ConsumableBaseStats,
  ...EquipmentBaseStats,
];

// Typings

export type ItemAttributeTyping = (typeof Attribute)[keyof typeof Attribute];
export type ItemUsageAttributeTyping =
  (typeof UsageAttribute)[keyof typeof UsageAttribute];
export type ItemTyping = (typeof Type)[keyof typeof Type];
export type ItemBaseStatTyping = (typeof BaseStat)[keyof typeof BaseStat];
export type ItemRarityTyping = (typeof Rarity)[keyof typeof Rarity];
export type ItemSourceTyping = (typeof Source)[keyof typeof Source];

export const Item = {
  Attribute,
  Attributes,
  UsageAttribute,
  UsageAttributes,
  Rarity,
  Rarities,
  BaseStat,
  BaseStats,
  AllBaseStats,
  Type,
  Types,
  TypeIndex,
  Source,
  Sources,
};
