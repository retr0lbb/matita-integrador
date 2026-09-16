import { randomUUID } from "crypto";

import type { Email } from "../../shared/domains/value-objects/email.vo";

import { AccountAlreadyLinkedError } from "./errors/account-already-linked.error";
import { AccountStatus } from "./value-objects/account-status.vo";

export enum ExternalProvider {
  GOOGLE = "GOOGLE",
  LEX = "LEX",
  MICROSOFT = "MICROSOFT",
}

type AccountCreatePayload = {
  provider: ExternalProvider;
  userId: string;
  email: Email;
  hash: string | null;
};

type AccountReconstitutePayload = {
  id: string;
  externalId: string | null;
  provider: ExternalProvider;
  userId: string;
  email: Email | null;
  hash: string | null;
  createdAt: Date;
  status: AccountStatus;
  updatedAt: Date | null;
};

export class Account {
  private constructor(
    private readonly _id: string,
    private _externalId: string | null,
    private readonly _provider: ExternalProvider,
    private _syncHash: string | null,
    private readonly _userId: string,
    private _email: Email | null,
    private _status: AccountStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date | null,
  ) {}

  static create(payload: AccountCreatePayload): Account {
    return new Account(
      randomUUID(),
      null,
      payload.provider,
      payload.hash,
      payload.userId,
      payload.email,
      AccountStatus.PENDING,
      new Date(),
      null,
    );
  }

  static reconstitute(payload: AccountReconstitutePayload): Account {
    return new Account(
      payload.id,
      payload.externalId,
      payload.provider,
      payload.hash,
      payload.userId,
      payload.email,
      payload.status,
      payload.createdAt,
      payload.updatedAt,
    );
  }

  /**
   * Vincula a Account com a representação externa
   * criada pelo provedor.
   */
  link(externalId: string): void {
    if (this._externalId !== null) {
      throw new AccountAlreadyLinkedError("ACCOUNT_ALREADY_EXISTS");
    }

    this._externalId = externalId;
    this.touch();
  }

  /**
   * Marca a Account como ativa após o vínculo
   * com o provedor externo.
   */
  activate(): void {
    if (this._externalId === null) {
      throw new Error(
        "Não é possível ativar uma conta sem um externalId.",
      );
    }

    this._status = AccountStatus.ACTIVE;
    this.touch();
  }

  /**
   * Atualiza o hash utilizado para detectar
   * alterações na representação externa.
   */
  updateSyncHash(hash: string): void {
    this._syncHash = hash;
    this.touch();
  }

  /**
   * Atualiza o e-mail conhecido pelo provedor.
   */
  updateEmail(email: Email): void {
    this._email = email;
    this.touch();
  }

  markAsFailed(): void {
    this._status = AccountStatus.FAILED;
    this.touch();
  }

  isLinked(): boolean {
    return this._externalId !== null;
  }

  isActive(): boolean {
    return this._status === AccountStatus.ACTIVE;
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get externalId(): string | null {
    return this._externalId;
  }

  get provider(): ExternalProvider {
    return this._provider;
  }

  get userId(): string {
    return this._userId;
  }

  get email(): Email | null {
    return this._email;
  }

  get syncHash(): string | null {
    return this._syncHash;
  }

  get status(): AccountStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }
}