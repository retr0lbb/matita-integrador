import { Injectable } from "@nestjs/common";
import { InstitutionSnapshot, SnapshotSourcePort, TenantSnapshot } from "../domain/sync.port";
import { randomUUID } from "crypto";

@Injectable()
export class FakeLexAdapter implements SnapshotSourcePort {
    async fetchSnapshot(tenantId: string): Promise<InstitutionSnapshot> {
        return {
           syncId: randomUUID(),
           source: "FAKE",
           syncedAt: new Date(),
           institution: {
            externalId: tenantId,
            name: "Escola Jujutsu Tokio"
           },
           classes: [
            {
                grade: "1",
                name: "Primeiro ano da escola Jujutsu",
                externalId: "a12cf98f-9919-4e5e-a6dc-c2825adc502e",
                schoolYear: 2026,
                unitExternalId: "b8abb11a-e75c-4bae-bbb7-75c4eda4ef9d",
                members: [
                    {
                        role: "STUDENT",
                        userExternalId: "f4ef70ec-d8f9-486b-a799-e1d02af24eee"
                
                    },
                    {
                        role: "TEACHER",
                        userExternalId: "a6c4c198-6a9d-44fb-975c-fe67592b2434"
                    }
                ]
            },
            {
                grade: "2",
                name: "Segundo ano da escola Jujutsu",
                externalId: "b33e88a1-1896-4b79-b638-523079ce097b",
                schoolYear: 2026,
                unitExternalId: "b8abb11a-e75c-4bae-bbb7-75c4eda4ef9d",
                members: [
                    {
                        role: "STUDENT",
                        userExternalId: "0bbc1b14-9264-44f5-91be-307ca8ac48c8"
                    },
                    {
                        role: "TEACHER",
                        userExternalId: "794ef867-133f-4f25-ad25-51acc4442e36"
                    }
                ]
            },
           ],
           users: [
            {
                externalId: "0bbc1b14-9264-44f5-91be-307ca8ac48c8",
                name: "Aoi Todo",
                email: "aoitodo@jujutsu.com" 
            },
            {
                externalId: "f4ef70ec-d8f9-486b-a799-e1d02af24eee",
                name: "Megumi Fushiguro",
                email: "megfu@jujutsu.com",
            },
            {
                externalId: "a6c4c198-6a9d-44fb-975c-fe67592b2434",
                name: "Satoru Gojo",
                email: "satorugojo@jujutsu.com",
            },
            {
                externalId: "794ef867-133f-4f25-ad25-51acc4442e36",
                name: "Atsuya Kusakabe",
                email: "kusakabe@jujutsu.com",
            }
           ],
           units: [
            {
                externalId: "b8abb11a-e75c-4bae-bbb7-75c4eda4ef9d",
                name: "Tokio region"
            }
           ]
           
        }       
    }

    async listInstitutions(): Promise<TenantSnapshot> {
        const data: TenantSnapshot = {
            syncId: randomUUID(),
            syncDateTime: new Date(),
            data: [
                {
                    id: "0ba0699f-0b39-434d-9694-193990f6d797",
                    tenantName: "Escola Jujutsu Tokio"
                },
                {
                    id: "0ba0699f-0b39-434d-9694-193990f6d797",
                    tenantName: "Escola Jujutsu Kyoto"
                }
            ],
        }

        return data
    }
}