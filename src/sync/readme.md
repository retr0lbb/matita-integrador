# O que foi feito aqui no sync record

depois de postergar bastante para fazer essa funcao decidi que ja era hora de comecar a enfrentar a medusa

primeiro eu decidi trocar o tipo por uma classe, para que eu possa depois injetar comportamentos nela como comparar
emails, nomes por fuzzy e etc, tenho que ver com o nosso amigo Alessando se ele coloca algo nos metadados
das contas criadas como matricula RA e etc.\

com a classe criada eu parti para criar a sub classe de contas ja que era essa parte que eu vou focar agora,
para a pesquisa por nome fuzzy quando tivermos que fazer o fluxo reverso, teremos que ter o nome
mas no meu db o nome esta no usuario e nao na conta, e nem a conta nem o usuario estao linkados a uma unidade
o que eu precisava pq o negocio da lex eh feito por unidades. entao aqui vai uma duvida

DUVIDA: eu devo: likar ambos os usuarios e contas a uma unidade? linkar so a conta na unidade e fazer uma funcao especial para retornar os usuarios com as contas? nao linkar nada a unidade ainda e pensar em outra solucao? 

enfim, coloquei ate a funcao geral de comparacao como metodo da classe, que futuramente podemos abstrair muita coisa dela.

algumas duvidas me surgiram entao vou fazer elas agora

DUVIDA: devo adicionar um enum para o tipo de sync, tipo update, migration, delete, creation no meu novo tipo do sync record @sync-record.ts ou melhor deixar manual

DUVIDA: Seria importante fazer idempotencia dos syncs?

## todas as perguntas abaixo estao direcionadas para o arquivo @diff-sync

DUVIDA: quando provider eh igual ao lex deve retornar um UserAccountSyncRecords?

DUVIDA: essa funcao de sync deve deletar registros do banco caso nao tenham na lex?

DUVIDA: o que fazer se a lex mudar o ID de uma pessoa por exemplo, ja que eu estou usando o external ID como fonte de verdade

DUVIDA: O que fazer em caso de em alguma ponta o ID da lex vier nulo? eu devo tratar, pois eu estou usando um mapa

DUVIDA: Acredito que pelo menos 1 vez teremos que fazer um fluxo inverso ou seja ao invez de ser LEX -> meu db -> google teremos que fazer google -> meu db -> lex o que vai ser especialmente trabalhoso ja que no primeiro fluxo podemos contar com IDS ja aqui teremos que fazer um matcher de nomes, no meu modelo, como isso ficaria?

Por fim depois dessas duvidas fui atras de fazer um usecase simples de sync conectando com um repositorio fake da lex que imita o resultado, inclusive DUVIDA: na API da lex temos um campo chamado sync hash que eu decidi nao colocar nos meus tipos no @sync.port.ts por que eu estava esperando usar esse modelo tambem para outros provedores entretanto esse modelo ja esta muito ligado a lex entao eu devo colocar o sync hash aki e fds, ou deixar de fora e ver outro lugar para colocar?

a logica por tras do usecase eh bem simples na realidade gracas a arquitetura. eu pego os dados do adapter da lex, pegos as contas no meu repo de contas e usuario, e depois faco o depara.

entratanto com isso me surgiram algumas duvidas como por exemplo 

DUVIDA: Minhas entidades de ACCOUNT e USER nao sao ligadas a instituição e nem unidade, pois como ja havia dito que temos algumas coisas nao tao claras nesse caminho das maplebears. e entao para uma sincronização mais eficiente eu teria de ligar as contas a alguma instituição ou unidade. eu devo ligar tudo ambos os usuarios e contas ou apenas as contas ou apenas os usuarios?