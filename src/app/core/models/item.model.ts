import {
  EItemAttribute,
  EItemBaseStat,
  EItemSource,
  EItemType,
  EItemUsageAttribute,
} from '@core/constants';

/* eslint-disable */
export class Item {
  _id?: string;
  name?: string;
  description?: string;
  modelName?: string;
  texture?: string;
  type?: EItemType;
  tags?: string[];
  attributes?: Record<EItemAttribute, any>;
  usageAttributes?: Record<EItemUsageAttribute, any>;
  cost?: string;
  maxStackSize?: number;
  sources?: Array<EItemSource>;
  baseStats?: Record<EItemBaseStat, number>[];
  rollRanges?: Record<string, number>;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Item> = {}) {
    Object.assign(this, model);
  }
}
/* eslint-enable */
