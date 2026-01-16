import { EStatus } from '@core/constants';
import { IUserLog } from '@core/interfaces/user-log.interface';

export interface IPartyMember extends IUserLog {
  role?: EPartyRole;
}

export enum EPartyRole {
  Leader = 'leader',
  Officer = 'officer',
  Member = 'member',
}

export class Party {
  _id?: string;
  name: string;
  leader: IPartyMember;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  members?: IPartyMember[];
  status: EStatus;
  imageUrl?: string;
  createdBy?: IUserLog;
  updatedBy?: IUserLog;

  constructor(model: Party) {
    this._id = model._id;
    this.name = model.name;
    this.leader = model.leader;
    this.description = model.description;
    this.members = model.members;
    this.imageUrl = model.imageUrl;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
