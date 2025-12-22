import { EStatus, EUserType } from '@core/constants';

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
  _id?: string;
  email?: string;
  userType?: EUserType;
  status?: EStatus;
  createdAt?: Date;
  updatedAt?: Date;
  flags?: IUserFlags;
  preferences?: IUserPreferences;
  equipment?: IUserEquipment;
  stats?: IUserStats;
  character?: IUserCharacter;
  imageUrl?: string; // ? for the meantime; will be replaced with layered images using pixi js

  constructor(model: Partial<User> = {}) {
    Object.assign(this, model);
  }
}
