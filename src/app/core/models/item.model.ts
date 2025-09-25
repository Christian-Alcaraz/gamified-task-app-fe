import {
  ItemAttributeTyping,
  ItemBaseStatTyping,
  ItemSourceTyping,
  ItemTyping,
  ItemUsageAttributeTyping,
} from '@core/constants/item.constant';

/* eslint-disable */
export class Item {
  _id?: string;
  name?: string;
  description?: string;
  modelName?: string;
  texture?: string;
  type?: ItemTyping;
  tags?: string[];
  attributes?: Record<ItemAttributeTyping, any>;
  usageAttributes?: Record<ItemUsageAttributeTyping, any>;
  cost?: string;
  maxStackSize?: number;
  sources?: Array<ItemSourceTyping>;
  baseStats?: Record<ItemBaseStatTyping, number>;
  rollRanges?: Record<string, number>;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Item> = {}) {
    Object.assign(this, model);
  }
}
/* eslint-enable */
