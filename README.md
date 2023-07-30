# PDF Teacher

Experimento usando a API da OpenAI e a Vercel AI SDK, que consite em um chatbot, que permite enviar um PDF e "conversar com ele".

## Tecnologias usadas
- Vercel AI SDK
- Langchain
- OpenAI
- Supabase

## Como iniciar
- É necessário configurar o Supabase com a tabela necessária para o funcionamento da aplicação. Consulte [este trecho](https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase/#create-a-table-and-search-function-in-your-database) de um guia para saber o que fazer;
- É necessário ter uma chave de acesso a API da OpenAI;
- Preencha as variáveis de ambiente necessárias. Consulte o arquivo [.env.example](/.env.example)

## Demonstração

https://github.com/Jonatan966/pdf-teacher/assets/37812781/e7e3541d-39e6-4055-9166-9f9b5fd36f41

## Fluxo
- Primeiro, é necessário selecionar um PDF, e escrever uma pergunta;
- Ao clicar em Enviar, uma requisição separada para o PDF é feita;
  - O PDF é convertido para um hash MD5, e uma verificação no banco de dados é feita, verificando se o PDF já foi processado antes;
  - Caso o PDF já tenha sido processado, essa requisição apenas retorna seu hash MD5;
  - No caso contrário, o PDF é processado e seu conteúdo é transformado em vetores;
  - O resultado do processamento é armazenado no banco de dados vetorial.
- Uma nova requisição é feita, para a geração da resposta do chatbot.
  - Um prompt template é usado para a geração da resposta;
  - Uma busca semântica é feita no banco de dados vetorial, filtrando os conteúdos relevantes para geração da resposta;
    - O hash MD5 do PDF previamente processado é usado para filtrar os resultados;
  - Depois de todas as informações serem coletadas, a resposta é gerada e retornada em formato Stream.
