import {
  EItemAttribute,
  EItemBaseStat,
  EItemSource,
  EItemType,
  EItemUsageAttribute,
} from '@core/constants';
import { IUserLog } from '@core/interfaces/user-log.interface';

/* eslint-disable */
export class Item {
  _id?: string;
  name: string;
  description?: string;
  type: EItemType;
  modelName: string;
  texture?: string;
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
  updatedBy?: IUserLog;

  constructor(model: Item) {
    this.name = model.name;
    this.type = model.type;
    this.modelName = model.modelName;
    this.texture = model.texture;
    this.tags = model.tags;
    this.attributes = model.attributes;
    this.usageAttributes = model.usageAttributes;
    this.cost = model.cost;
    this.maxStackSize = model.maxStackSize;
    this.sources = model.sources;
    this.baseStats = model.baseStats;
    this.updatedBy = model.updatedBy;
    this.rollRanges = model.rollRanges;
  }
}
/* eslint-enable */
