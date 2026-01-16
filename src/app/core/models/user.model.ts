import { EStatus, EUserType } from '@core/constants';
import { IUserLog } from '@core/interfaces/user-log.interface';

export interface IUserFlags {
  hasCreatedCharacter: boolean;
  hasAcceptedTerms: boolean;
}

export interface IUserPreferences {
  theme: string;
}

export interface IUserEquipment {
  head?: string;
  face?: string;
  body?: string;
  accessories?: string;
  mainhand?: string;
  offhand?: string;
  necklace?: string;
  ring?: string;
  bracelet?: string;
  amulet?: string;
}

export interface IUserStats {
  health: number;
  mana: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  gold: number;
  level: number;
  experience: number;
  statPoints: number;
  toNextLevel: number;
}

export interface IUserCharacter {
  name: string;
  skinColor?: string;
  gender: 'male' | 'female';
  class: string;
  imageUrl: string;
  head?: {
    hairBase: string;
    hairColor: string;
  };
  face?: {
    eyeBase: string;
    eyeColor: string;
    facialHairBase: string;
    facialHairColor: string;
  };
  body?: {
    color: string;
    base: string;
  };
  accessories?: {
    head: string;
    face: string;
    waist: string;
    back: string;
    mount: string;
  };
}

export class User {
  _id: string;
  email: string;
  userType: EUserType;
  status: EStatus;
  flags?: IUserFlags;
  preferences?: IUserPreferences;
  equipment?: IUserEquipment;
  stats: IUserStats;
  character?: IUserCharacter;
  imageUrl?: string; // ? for the meantime; will be replaced with layered images using pixi js
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: IUserLog;
  _partyId?: string;

  constructor(model: User) {
    this._id = model._id;
    this.email = model.email;
    this.userType = model.userType;
    this.status = model.status;
    this.flags = model.flags;
    this.preferences = model.preferences;
    this.equipment = model.equipment;
    this.stats = model.stats;
    this.character = model.character;
    this.imageUrl = model.imageUrl;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.updatedBy = model.updatedBy;
    this._partyId = model._partyId;
  }
}
