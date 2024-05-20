# Capital Gains

O projeto "Capital Gains" é uma aplicação desenvolvida em TypeScript que lida com operações de compra e venda de ativos.

## Decisões Técnicas e Arquiteturais

O projeto foi estruturado de forma modular, com cada módulo responsável por uma parte específica da funcionalidade. A estrutura de diretórios reflete essa organização modular.

- `src/operations/`: Contém a lógica para lidar com operações de compra e venda.
- `src/types/`: Contém os tipos de dados usados em todo o projeto.
- `src/utilities/`: Contém funções utilitárias usadas em todo o projeto.

### Typescript
A decisão de usar TypeScript foi tomada para aproveitar os benefícios da tipagem estática, como a prevenção de erros em tempo de compilação e a melhoria da legibilidade e manutenabilidade do código.

### SRP
O projeto usa o Single Responsibility Principle (SRP), onde cada função e módulo tem uma única responsabilidade. 

### Programação assíncrona
Além disso, o projeto usa programação assíncrona para lidar com operações de I/O, como a leitura de linhas de entrada. Isso permite que o programa continue a executar outras tarefas enquanto espera pela conclusão dessas operações, melhorando assim a eficiência e o desempenho.

### Modularidade
O código é dividido em funções separadas, cada uma lidando com uma tarefa específica. Por exemplo, calculateProfit em src/operações/handlers/sellOperationHandler.ts calcula o lucro, enquanto handleNoTaxCase e handleProfitCase lidam com diferentes cenários de uma operação de venda. Isso torna o código mais fácil de entender, testar e manter.

### Imutabilidade
O estado não sofre mutação direta. Em vez disso, um novo estado é retornado sempre que uma operação é executada. Esta é uma prática comum em programação funcional e gerenciamento de estado semelhante ao Redux, que ajuda a prevenir bugs relacionados à mutação de estado.

### Separação de responsabilidade
As operações de compra e venda são tratadas em arquivos separados (src/operações/handlers/buyOperationHandler.ts e src/operações/handlers/sellOperationHandler.ts), o que torna a organização do código mais clara e lógica.

### Transparência Referencial
Este projeto segue o princípio da Transparência Referencial, o que significa que as funções dependem apenas de seus argumentos de entrada para produzir um resultado. Isso garante que uma função sempre produza o mesmo resultado para os mesmos argumentos de entrada, independentemente de onde e quando a função é chamada, como por exemplo na função [`addOperationsFromLineToBatch`](src/operations/operationProcessing.ts) que recebe uma linha de operações como entrada e retorna um novo lote de operações. Da mesma forma, a função [`processAllOperationBatches`](src/operations/operationProcessing.ts) não tem efeitos colaterais e retorna um novo estado baseado apenas em seu estado de entrada.

### Handlers para operações de compra ou venda 

Os handlers, especificamente nos arquivos `src/operações/handlers/sellOperationHandler.ts` e `src/operações/handlers/buyOperationHandler.ts`, são projetados para processar diferentes tipos de operações (compra e venda) em um determinado estado do aplicativo. Cada handler é uma função que recebe o estado atual e uma operação como argumentos e retorna um novo estado.

No caso do `sellOperationHandler`, existem diferentes funções para lidar com diferentes cenários:

- `handleNoTaxCase`: trata do caso em que nenhum imposto é aplicado.
- `handleProfitCase`: trata do caso em que ocorre lucro.
- `handleNoProfitCase`: trata do caso em que nenhum lucro é obtido.

No `buyOperationHandler`, a função `processBuyOperation` trata uma operação de compra calculando o novo preço médio ponderado e atualizando o estado com o novo preço médio ponderado, o novo número de ações e um imposto de 0.

Este padrão de design permite uma separação clara de interesses, onde cada handler é responsável por processar um tipo específico de operação. Também torna o código mais fácil de testar e manter, pois cada função do handler pode ser testada e modificada de forma independente.

## Uso de Frameworks e Bibliotecas

Nenhum framework ou biblioteca externa foi usado neste projeto. Isso foi feito para manter o projeto o mais simples e leve possível, e para demonstrar a capacidade de construir funcionalidades complexas usando apenas as funcionalidades nativas do Node.js e TypeScript.

## Como Compilar e Executar o Projeto

### Node

1. Instale as dependências do projeto com `npm install`.
2. Compile o projeto com `npm run build`.
3. Execute o projeto com `npm start`.

Ou você pode usar o Docker para compilar e executar o projeto:

### Docker

1. Construa a imagem Docker com `docker-compose build`.
2. Execute a aplicação de forma interativa com `docker-compose run -i app`.
3. Execute o programa utilizando o comando `node dist/src/main.js < input.txt` caso o input.txt ja esteja na raiz do container.

### Usando o Binário

1. É possível gerar um binário executável do projeto para ser usado de forma independente. Siga os passos abaixo para gerar e usar o binário:

2. Primeiro, instale as dependências do projeto. No terminal, execute o seguinte comando:
   
```bash
npm install
```

3. Em seguida, gere o binário executável de acordo com o seu sistema operacional. Para sistemas Linux, use o comando:
   
```bash
npm run package-linux
```

4. Para sistemas macOS, use o comando:
   
```bash
npm run package-macos
```

5. Após a geração do binário, você pode executá-lo passando um arquivo como entrada. Use o comando abaixo, substituindo input.txt pelo caminho do arquivo que você deseja processar:

```bash
./capital-gains < input.txt
```

Importante salientar que não foi testado em um dispositivo macOS por conta de não ter dispositivo disponível para testes.

## Executando os Testes

Para executar os testes, certifique-se de que todas as dependências do projeto estão instaladas. Se ainda não estiverem, você pode instalá-las usando o comando `npm install`.

Uma vez que as dependências estejam instaladas, você pode executar os testes utilizando o comando `npm test` no terminal. Este comando irá iniciar a execução de todos os testes definidos no projeto.
