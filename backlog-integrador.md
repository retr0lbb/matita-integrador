# Backlog — Integrador

## ✅ Concluído

- [x] add classrooms module.
- [x] learn more about hexagonal arch.
- [x] create google service to classroom
- [x] remove addUserToClassroom god function on drizzle classroom repository and substitute to repository of userToclassroom(save and get)
- [x] correct the flux of google things creation local -> google -> update local
- [x] add google integration.
- [x] verify if course has to need location and turns? IT DONT
- [x] add hash column to account.
- [x] create remove user account
- [x] think if user should be held main or account should be held main.(user)
- [x] add to database classroom owner id as user relation
- [x] remove double userNotFoundError
- [x] fix import from google parcial import error account already exists (the error fixed itself)
- [x] create test for user creation.
- [x] create Cron job for sync google full 24/7 daily connection.
- [x] finish the findById google service.
- [x] [IMPORTANT] add account linkage to tables
- [x] sync Google -> Integrador (import) funcionando

## 🔓 Pode fazer agora — não depende da chave da Lex

- [ ] **Decidir: `ownerId` do Classroom aponta pra `User` ou `Account`, e refatorar** *(junta "verify if owner id should be user or account", "test if database ownerId is working as intended" e "refatorar classroom para usar o novo account e owner id")*
- [ ] **Guardar `orgUnitId` (estável) em vez de só o path de texto da UO** *(era o "add volatile paths using path id from provider")*
- [ ] **Criar `removeUserFromClassroom` e limpar os métodos de add/get** *(junta "create remove user to classroom" com "fix the new 2 methods on add user to classroom and get user to classroom")*
- [ ] **Identity resolution strategy** — regra pra quando uma conta Google órfã pode ou não ser casada com um `User` já existente
- [ ] **Criar payload fake da Lex**, no formato da doc do Sync Full, pra desenvolver e testar o diff engine sem esperar a chave
- [ ] **Criar a porta genérica de sync + o extrator do Google como fonte** *(junta "create sync port and lex adapter" — só a parte da porta/interface —, "see if i can make an google extractor" e parte do "refatorar sync engine")*
- [ ] **Instituição / multi-tenant**: institution provider email + account linkage, link student to institution, link unit to user *(3 itens que são partes do mesmo trabalho: `Instituicao` virar dona de configuração própria, não mais fixa em `.env`)*

## 🔒 Bloqueado — esperando chave da Lex

- [ ] Hash integration com a Lex
- [ ] Adapter real da Lex pra porta de sync (implementação, depois que a porta genérica já existir)
- [ ] Cron job de sync fetch full da Lex (implementação real — o agendamento em si já dá pra testar com o payload fake)

## 🧹 Limpeza / baixa prioridade

- [ ] Novas portas pra melhor querying *(vago — revisar se ainda faz sentido)*
- [ ] Link unit e orgPath usando criação automática de UO no Google
- [ ] Adicionar domínio customizado (internet) à organização *(tarefa administrativa, não código)*
- [ ] Filas (BullMQ/Redis) *(só compensa quando o volume justificar)*

## 🚀 Futuro

- [ ] Integração automática com calendário do Google
- [ ] Provedor Microsoft
- [ ] Login para admins
- [ ] Gerenciar Drive automaticamente

---

## Ordem sugerida enquanto a chave da Lex não chega

1. Payload fake da Lex + porta genérica de sync + extrator do Google
2. Decisão do `ownerId` (User vs Account)
3. Identity resolution strategy
4. Instituição / multi-tenant
