import { StatusTyping } from '@core/constants/status.constant';

export type UserTyping = 'User' | 'Admin';

export interface UserFlags {
  hasCreatedCharacter: boolean;
  hasAcceptedTerms: boolean;
}

export interface UserPreferences {
  theme: string;
}

export interface UserEquipment {
  head?: string;
  face?: string;
  body?: string;
  accessories?: string;
  mainHand?: string;
  offHand?: string;
}

export interface UserStats {
  health: number;
  mana: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  experience: number;
  level: number;
  statPoints: number;
  toNextLevel: number;
}

export interface UserCharacter {
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
  userType?: UserTyping;
  status?: StatusTyping;
  createdAt?: Date;
  updatedAt?: Date;
  flags?: UserFlags;
  preferences?: UserPreferences;
  equipment?: UserEquipment;
  stats?: UserStats;
  character?: UserCharacter;
  imageUrl?: string; // ? for the meantime; will be replaced with layered images using pixi js

  constructor(model: Partial<User> = {}) {
    Object.assign(this, model);
  }
}
